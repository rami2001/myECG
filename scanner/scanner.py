import cv2
import numpy as np
from matplotlib import pyplot as plt
from scipy.interpolate import interp1d

# Pour tester les résultats
fig, axes = plt.subplots(2, 3, figsize=(12, 6))

# Etape 01 :
# Récupération de l'image de base
image = cv2.imread("test.jpg")
axes[0, 0].imshow(image)
axes[0, 0].set_title("Image de base")

# Standardiser la hauteur de l'image
# HEIGHT = 400
# (h, w) = image.shape[:2]
# ratio = HEIGHT / float(h)
# dim = (int(w * ratio), HEIGHT)

# image = cv2.resize(image, dim, interpolation=cv2.INTER_NEAREST)
# cv2.imshow(f"Ajustement de la taille a {HEIGHT}px", image)

# Etape 02 :
# Transformation en niveaux de gris
grayscale = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
axes[0, 1].imshow(grayscale)
axes[0, 1].set_title("Image en niveaux de gris")

# Etape 03 :
# Réglage du contraste et de la luminosité
contrast = 0.6
light = 20
adjusted = cv2.convertScaleAbs(grayscale, alpha=contrast, beta=light)
axes[0, 2].imshow(adjusted)
axes[0, 2].set_title("Ajustement du contraste de et de la luminosité")

# Etape 04 :
# Binarisation
threshold = 70
_, binary = cv2.threshold(adjusted, threshold, 127, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
axes[1, 0].imshow(binary)
axes[1, 0].set_title("Seuillage (binarisation)")

# Etape 05 :
# Détection des lignes
contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

canvas = np.zeros(binary.shape, np.uint8)
canvas = cv2.cvtColor(canvas, cv2.COLOR_GRAY2BGR)

cv2.drawContours(canvas, contours, -1, (255, 0, 0), 3, cv2.LINE_AA)

axes[1, 1].imshow(canvas)
axes[1, 1].set_title("Contours des lignes")

# Etape 06 :
# Ligne la plus longue
max_contour = max(contours, key=lambda x: cv2.arcLength(x, True))
graph_line = np.zeros(canvas.shape)

cv2.drawContours(graph_line, max_contour, -1, (255, 0, 0), 5, cv2.LINE_AA)

axes[1, 2].imshow(graph_line)
axes[1, 2].set_title("Ligne la plus longue")

# Etape 07 :
# Numérisation
precision = 10000
epsilon = 1/precision * cv2.arcLength(max_contour, True)
approx = cv2.approxPolyDP(max_contour, epsilon, True)

app = np.reshape(approx, (1, approx.shape[0], 2))
result = [(x, y) for sublist in app for x, y in sublist]

x_y_dict = {}
for x, y in result:
    if x not in x_y_dict:
        x_y_dict[x] = [y]
    else:
        x_y_dict[x].append(y)

new_points = []
for x, y_values in x_y_dict.items():
    avg_y = sum(y_values)/len(y_values)
    new_points.append((x, avg_y))

new_points = sorted(new_points, key=lambda p: p[0])

x = np.array([x for x, y in new_points])
y = np.array([100 - y for x, y in new_points])

cubic_interpolation_model = interp1d(x, y, kind="cubic", fill_value="extrapolate")
X_ = np.linspace(x.min(), x.max(), 500)
Y_ = cubic_interpolation_model(X_)

plt.figure(figsize=(10, 6))
plt.plot(X_, Y_)
plt.xlim(x.min(), x.max())
plt.ylim(Y_.min(), Y_.max())
plt.grid(True)
plt.show()

cv2.waitKey(0)

cv2.destroyAllWindows()