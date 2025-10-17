import sys

import numpy as np
import cv2
import imutils

RESIZED_MAX_SIDE = 320
NORMALIZED = 1600
X_CROP = 16
Y_CROP = 16

def load_and_resize_image(image_path, new_max_side = RESIZED_MAX_SIDE):
    image = cv2.imread(image_path)
    orig = image.copy()

    max_side = max(image.shape[0], image.shape[1])
    ratio = new_max_side / max_side

    width = int(ratio * image.shape[1])
    height = int(ratio * image.shape[0])
    resized_image = cv2.resize(image, (width, height))

    return resized_image, orig, ratio

def process_image(image, gaussian_kernel = (3, 3)):
    gray_scaled = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    blurred = cv2.GaussianBlur(gray_scaled, gaussian_kernel, 0)

    edged = cv2.Canny(blurred, 64, 210)

    return edged

def find_screen_contour(edged_image):
    contours = cv2.findContours(edged_image.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    contours = imutils.grab_contours(contours)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:4]

    EPSILON = 0.05
    screen_contour = None

    for contour in contours:
        perimeter = cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, EPSILON * perimeter, True)

        if len(approx) == 4:
            screen_contour = approx
            break

    return screen_contour

def four_point_transform(image, pts):
    rect = np.zeros((4, 2), dtype="float32")

    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]

    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]

    width_a = np.sqrt(((rect[2][0] - rect[3][0]) ** 2) + ((rect[2][1] - rect[3][1]) ** 2))
    width_b = np.sqrt(((rect[1][0] - rect[0][0]) ** 2) + ((rect[1][1] - rect[0][1]) ** 2))
    min_width = min(int(width_a), int(width_b))

    height_a = np.sqrt(((rect[1][0] - rect[2][0]) ** 2) + ((rect[1][1] - rect[2][1]) ** 2))
    height_b = np.sqrt(((rect[0][0] - rect[3][0]) ** 2) + ((rect[0][1] - rect[3][1]) ** 2))
    min_height = min(int(height_a), int(height_b))

    dst = np.array([
        [0, 0],
        [min_width - 1, 0],
        [min_width - 1, min_height - 1],
        [0, min_height - 1]], dtype="float32")

    matrix = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(image, matrix, (min_width, min_height))

    return warped

def normalize(scanned) :

    max_side = max(scanned.shape[0], scanned.shape[1])
    ratio = NORMALIZED / max_side

    width = int(ratio * scanned.shape[1])
    height = int(ratio * scanned.shape[0])
    normalized = cv2.resize(scanned, (width, height))

    return normalized

def crop(normalized, x_crop = X_CROP, y_crop = Y_CROP) :

    width = normalized.shape[1]
    height = normalized.shape[0]

    start_x = x_crop
    start_y = y_crop

    end_x = width - x_crop
    end_y = height - x_crop

    cropped = normalized[start_y:end_y,start_x:end_x]

    return cropped

def scan(image_path):
    resized_image, orig, ratio = load_and_resize_image(image_path)
    edged_image = process_image(resized_image)
    screen_contour = find_screen_contour(edged_image)

    if screen_contour is None:
        print("Aucun ECG trouvé.")
    else:
        warped_image = four_point_transform(orig, screen_contour.reshape(4, 2) * (1 / ratio))
        
        normalized = normalize(warped_image)

        cropped = crop(normalized)

        return cropped

src_path = sys.argv[1]
dst_path = sys.argv[2]

ecg_scan = scan(src_path)

if ecg_scan is not None:
    cv2.imwrite(dst_path, ecg_scan)
    sys.exit(0)
else:
    sys.exit(1)