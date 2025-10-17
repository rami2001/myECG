import sys
import csv
import json

from collections import deque

import numpy as np

from scipy import fftpack
from statistics import median
from fractions import Fraction

from scipy.interpolate import interp1d
from matplotlib import pyplot as plt

import cv2

from skimage import io, img_as_ubyte, img_as_float
from skimage import morphology
from skimage.filters import unsharp_mask
from skimage.exposure import adjust_gamma
from skimage.util import invert

COLS = 2
LINES = 12 // COLS
ECG_NAMES = ["d1", "d2", "d3", "avr", "avl", "avf", "v1", "v2", "v3", "v4", "v5", "v6"]

# Constants for binarization
MAGNITUDE_THRESH = 99.3
EXCLUSION_RADIUS_PERCENTAGE = 0.055

# Constants for calibration
PRECISION = 100

# Constants for segmentation
LINE_THICKNESS = 8
HALF_LINE_THICKNESS = int(LINE_THICKNESS // 2)

X_OFFSET = HALF_LINE_THICKNESS
Y_JUMP = 16

DIRECTIONS_L2R = [(0, -1), (1, 0), (0, 1), (1, -1), (1, 1)]
DIRECTIONS_R2L = [(0, -1), (-1, 0), (0, 1), (-1, -1), (-1, -1)]

# Constants for digitization
INTERP_METHOD = "cubic"
SAMPLING = 1000

Y_SHIFT = 1

V_PER_CM = 1
T_PER_CM = 0.4

class Binarization :
    @staticmethod
    def remove_grid(image_path, magnitude_thresh = MAGNITUDE_THRESH, exclusion_radius_percentage = EXCLUSION_RADIUS_PERCENTAGE) :
        image = io.imread(image_path, as_gray=True)
        image = invert(image)

        fft_image = fftpack.fft2(image)

        fft_shifted = fftpack.fftshift(fft_image)

        magnitude_spectrum_before = np.log(np.abs(fft_shifted) + 1)

        threshold = np.percentile(np.abs(fft_shifted), magnitude_thresh)

        magnitude = np.abs(fft_shifted)

        rows, cols = image.shape
        mask = np.ones((rows, cols), dtype=np.float32)

        mask = magnitude < threshold

        crow, ccol = rows // 2, cols // 2

        exclusion_radius = (max(rows, cols) * exclusion_radius_percentage)

        y, x = np.ogrid[:rows, :cols]
        center_mask = (x - ccol)**2 + (y - crow)**2 <= exclusion_radius**2
        mask[center_mask] = 1

        fft_shifted_filtered = fft_shifted * mask
        magnitude_spectrum_after = np.log(np.abs(fft_shifted_filtered) + 1)

        fft_filtered = fftpack.ifftshift(fft_shifted_filtered)
        filtered_image = fftpack.ifft2(fft_filtered)
        filtered_image = np.abs(filtered_image)

        filtered_image_uint8 = invert(img_as_ubyte(filtered_image / np.max(filtered_image)))

        return filtered_image_uint8
    
    @staticmethod
    def sharpen(image, radius = 16, amount = 1.25) :
        filtered_image_float = img_as_float(image)
        sharpened = img_as_ubyte(unsharp_mask(filtered_image_float, radius, amount))

        return sharpened

    @staticmethod
    def gamma(image, gamma = 0.7) :
        adjusted = adjust_gamma(image, gamma)
        
        return adjusted

    @staticmethod
    def binarize(image) :
        _, binary = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        
        kernel = np.array([
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 1, 1, 1, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ], dtype=np.uint8)

        dilated = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)

        se = cv2.getStructuringElement(cv2.MORPH_RECT, (6, 6))
        squares_mask = cv2.morphologyEx(binary, cv2.MORPH_ERODE, se)
        squares_mask = morphology.area_opening(squares_mask, 256, connectivity=0)
        se = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (6, 6))
        squares_mask = cv2.morphologyEx(squares_mask, cv2.MORPH_DILATE, se)

        without_squares = dilated - squares_mask

        return binary, without_squares

    @staticmethod
    def remove_small_objects(image) :
        _, cols = image.shape

        opened = morphology.area_opening(image, (cols * 2 / 3), connectivity=0)

        return opened

    @staticmethod
    def apply(image_path = "scan.jpg") :
        grid_removed = Binarization.remove_grid(image_path)
        sharpened = Binarization.sharpen(grid_removed)
        adjusted = Binarization.gamma(sharpened)
        binary_raw, without_squares = Binarization.binarize(adjusted)
        binary_treated = Binarization.remove_small_objects(without_squares)

        return binary_raw, binary_treated

class Calibration :
    @staticmethod
    def get_small_objects(binary_raw) :
        _, w = binary_raw.shape

        opened = morphology.area_opening(binary_raw, (w // COLS))
        sub = binary_raw - opened
        
        return sub

    @staticmethod
    def get_rectangle(sub) :
        h, w = sub.shape

        contours, _ = cv2.findContours(sub, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contours = sorted(contours, key=cv2.contourArea, reverse=True)[:12]            

        rectangle = None

        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)

            ratio = Fraction(h, w)
            f_ratio = np.longdouble(ratio)

            if (1.9 < f_ratio < 2.1) :

                rectangle = sub[y:y+h, x:x+w]
                
                return rectangle
    
    @staticmethod
    def get_px_per_cm(rectangle, precision = PRECISION) :
        rectangle_h, rectangle_w = rectangle.shape

        new_w = precision * rectangle_w
        half_new_w = precision // 2 * rectangle_w
        new_h = precision * rectangle_h
        rectangle_big = cv2.resize(rectangle, (new_w, new_h), interpolation=cv2.INTER_NEAREST)

        y_s = []
        for y in range(new_h) :
            if rectangle_big[y, half_new_w] :
                y_s.append(y)

        med = median(y_s)
        clean_h = new_h - 2 * med

        ppc = clean_h / (2 * precision)

        return ppc
    
    @staticmethod
    def apply(binary_raw, precision = PRECISION) :
        small_objects = Calibration.get_small_objects(binary_raw)
        rectangle = Calibration.get_rectangle(small_objects)
        ppc = Calibration.get_px_per_cm(rectangle, precision = precision)

        return ppc

class Segmentation :
    @staticmethod
    def horizontal_segmentation(binary) :
        hull = morphology.convex_hull_image(binary)

        hull_coords = np.column_stack(np.where(hull))

        x_min = np.min(hull_coords[:, 1])
        x_max = np.max(hull_coords[:, 1])
        y_min = np.min(hull_coords[:, 0])
        y_max = np.max(hull_coords[:, 0])

        middle_x = (x_min + x_max) // 2

        cv2.line(binary, (middle_x, y_min), (middle_x, y_max), (0, 0, 0), LINE_THICKNESS)

        return binary, (x_min, x_max, y_min, y_max), middle_x

    @staticmethod
    def get_starting_and_ending_points(binary, x_min, x_max, y_min, y_max, middle_x) :
        skeleton = morphology.skeletonize(binary)
        skeleton = img_as_ubyte(skeleton)

        skeleton = skeleton.astype(bool)

        starting_points = []
        ending_points = []

        for c in range(COLS) :
            x_left = x_min + X_OFFSET if c == 0 else middle_x + LINE_THICKNESS
            x_right = middle_x - LINE_THICKNESS if c == 0 else x_max - X_OFFSET

            y = y_min
            while y <= y_max:
                if skeleton[y, x_left]:
                    starting_points.append((x_left - X_OFFSET, y))
                    y = y + Y_JUMP

                y = y + 1
                
            y = y_min
            while y <= y_max:
                if skeleton[y, x_right]:
                    ending_points.append((x_right + X_OFFSET, y))
                    y = y + Y_JUMP

                y = y + 1

        if (len(starting_points) != 12 or len(ending_points) != 12) :
            sys.exit(1)

        return starting_points, ending_points
    
    @staticmethod
    def approx_segmentation(binary, starting_points, ending_points, y_min, y_max) :
        sub_images = []

        for idx, (x, _) in enumerate(starting_points) :
            ecg_index = (idx % LINES) + LINES * (idx // LINES)

            x2, _ = ending_points[idx]

            left = x
            right = x2

            if (idx % LINES == 0) :
                top = y_min
            else :
                top = starting_points[idx - 1][1] + 8

            if ((idx + 1) % LINES == 0) :
                bottom = y_max
            else :
                bottom = starting_points[idx + 1][1] - 8

            sub_image = binary[top:bottom, left:right]
            sub_images.append(sub_image)

        return sub_images
    
    @staticmethod
    def is_valid(binary, pixel, h, w, visited, max_y, min_y):
        tl = h if max_y == None else max_y
        bl = 0 if min_y == None else min_y

        return (0 <= pixel[0] < w and bl <= pixel[1] < tl and pixel not in visited and binary[pixel[1], pixel[0]] != 0)

    @staticmethod
    def find_paths(binary, start_pixel, end_pixel, strict_directions_allowed, value, max_y = None, min_y = None) :
        dest = np.zeros_like(binary)
        queue = deque([start_pixel])
        visited = set([start_pixel])
        paths = []

        while queue:
            current_pixel = queue.popleft()

            if current_pixel == end_pixel :
                paths.append(current_pixel)

            for direction in strict_directions_allowed :
                new_pixel = (current_pixel[0] + direction[0], current_pixel[1] + direction[1])

                if Segmentation.is_valid(binary, new_pixel, binary.shape[0], binary.shape[1], visited, max_y, min_y) :
                    visited.add(new_pixel)
                    queue.append(new_pixel)

                    dest[new_pixel[1], new_pixel[0]] = value
                
        return dest
    
    @staticmethod
    def segmentation(sub_images) :
        signals = []
        for idx, sub_image in enumerate(sub_images) :
            h, w = sub_image.shape

            starting_point = None
            ending_point = None
            for x in range(w) :
                for y in range(h) :
                    if sub_image[y, x] and starting_point == None:
                        starting_point = (x, y)                    

                    if sub_image[y, w - x - 1] and ending_point == None:
                        ending_point = (w - x - 1, y)

                if (starting_point != None and ending_point != None) :
                    break

            r2l = Segmentation.find_paths(sub_image, ending_point, starting_point, DIRECTIONS_R2L, 255)
            l2r = Segmentation.find_paths(sub_image, starting_point, ending_point, DIRECTIONS_L2R, 255)

            result = cv2.bitwise_and(l2r, r2l)

            se = cv2.getStructuringElement(cv2.MORPH_RECT, (1, h // 4))
            erosion = cv2.morphologyEx(result, cv2.MORPH_ERODE, se)

            clamped = result - erosion

            white_pixel_indices = np.where(clamped != 0)

            y_coords = white_pixel_indices[0]

            max_y = np.max(y_coords)
            min_y = np.min(y_coords)

            corrected = result[min_y:max_y, 0:w]

            signals.append(corrected)
    
        return signals

    @staticmethod
    def apply(binary) :
        cut, hull, middle_x = Segmentation.horizontal_segmentation(binary)

        x_min, x_max, y_min, y_max = hull

        starting_points, ending_points = Segmentation.get_starting_and_ending_points(cut, x_min, x_max, y_min, y_max, middle_x)
        approx_segments = Segmentation.approx_segmentation(cut, starting_points, ending_points, y_min, y_max)
        signals = Segmentation.segmentation(approx_segments)
        return signals

class Digitization :
    @staticmethod
    def shift_v(image, y_shift) :
        h, w = image.shape

        shift_matrix = np.float32([
            [1, 0, 0],
            [0, 1, y_shift]
        ])

        shifted = cv2.warpAffine(image, shift_matrix, (w, h))

        return shifted

    @staticmethod
    def get_baseline_and_endpoint(signal) :
        h, w = signal.shape

        signal_padded = np.copy(signal)

        baseline = None
        baseline_candidates = []

        for x in range(w):
            for y in range(h):
                if signal[y, x] and baseline is None:
                    baseline_candidates.append(y)

            if baseline_candidates:
                baseline_median = int(median(baseline_candidates))
                baseline = (x, baseline_median)
                cv2.line(signal_padded, (0, baseline[1]), (baseline[0], baseline[1]), 255, 1)
                break
        
        endpoint = None
        endpoint_candidates = []
        for x in range(w - 1, 0, -1):
            for y in range(h):
                if signal[y, x] and endpoint is None:
                    endpoint_candidates.append(y)

            if endpoint_candidates :
                endpoint_median = int(median(endpoint_candidates))
                endpoint = (x, endpoint_median)

                cv2.line(signal_padded, (endpoint[0], endpoint[1]), (w, endpoint[1]), 255, 1)
                break

        return baseline, endpoint, signal_padded

    @staticmethod
    def thin(signal, y_shift = Y_SHIFT) :
        shifted_up = Digitization.shift_v(signal, -y_shift)
        shifted_down = Digitization.shift_v(signal, y_shift)

        hi = signal - shifted_down
        lo = signal - shifted_up

        thin = cv2.bitwise_or(hi, lo)

        return thin

    @staticmethod
    def get_key_points(thin, baseline, ppc, tpc = T_PER_CM, vpc = V_PER_CM) :
        h, w = thin.shape

        tpp = tpc / ppc
        vpp = vpc / ppc

        signal_points = []
        for x in range(w):
            y_s = []
            for y in range(h):
                if thin[y, x] != 0:
                    y_s.append(y)

            if y_s:
                new_hi = np.max(y_s)
                new_lo = np.min(y_s)

                hi_steep = np.abs(new_hi - baseline)
                lo_steep = np.abs(new_lo - baseline)

                if hi_steep >= lo_steep:
                    new_y = new_hi - 1
                else:
                    new_y = new_lo + 1

                relative_y = baseline - new_y

                calibrated_x = tpp * x
                calibrated_y = vpp * relative_y

                signal_points.append((calibrated_x, calibrated_y))

        return signal_points

    @staticmethod
    def interpolate_all(ecgs_as_key_points, method = INTERP_METHOD, sampling = SAMPLING) :
        interpolated = []

        for ecg_as_key_points in ecgs_as_key_points :
            x_vals, y_vals = zip(*ecg_as_key_points)
            interp_func = interp1d(x_vals, y_vals, kind=method)

            x_new = np.linspace(min(x_vals), max(x_vals), num=sampling)
            y_new = interp_func(x_new)

            interpolated.append((x_new, y_new))    

        return interpolated

    @staticmethod
    def apply(signals, ppc, dst_path, tpc=T_PER_CM, vpc=V_PER_CM):
        gender = sys.argv[3]
        age = sys.argv[4]
        
        ecgs_dict = {}
        ecgs_dict["gender"] = gender
        ecgs_dict["age"] = float(age)

        for idx, signal in enumerate(signals):
            baseline_point, _, signal_padded = Digitization.get_baseline_and_endpoint(signal)
            thin = Digitization.thin(signal_padded, y_shift=Y_SHIFT)

            baseline_y = baseline_point[1]

            ecg_as_key_points = Digitization.get_key_points(thin, baseline_y, ppc, tpc, vpc)

            ecgs_dict[ECG_NAMES[idx]] = ecg_as_key_points

            with open(f"{dst_path}/{ECG_NAMES[idx]}.csv", "w") as f:
                writer = csv.writer(f)
                writer.writerow(["s", "mV"])
                
                for point in ecg_as_key_points:
                    writer.writerow([point[0], point[1]])

        with open(f"{dst_path}/ecg.json", "w") as f:
            json.dump(ecgs_dict, f)

        return ecg_as_key_points

src_path = sys.argv[1]
dst_path = sys.argv[2]

binary_raw, binary = Binarization.apply(src_path)
ppc = Calibration.apply(binary_raw)
segmented_signals = Segmentation.apply(binary)
ecg_as_key_points = Digitization.apply(segmented_signals, ppc, dst_path)

sys.exit(0)