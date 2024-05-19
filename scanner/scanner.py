import cv2
import numpy as np

# Récupération de l'image de base
image = cv2.imread("test.jpg")
cv2.imshow("Image de base", image)

# Réglage du contraste et de la luminosité
contrast = 2.1
light = -80
image = cv2.convertScaleAbs(image, alpha=contrast, beta=light)
cv2.imshow('Après contrast et luminosité', image)

# Transformation en niveaux de gris
image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
cv2.imshow("Image en niveaux de gris", image)

# Standardiser la hauteur de l'image
HEIGHT = 480
(h, w) = image.shape[:2]
ratio = HEIGHT / float(h)
dim = (int(w * ratio), HEIGHT)

image = cv2.resize(image, dim, interpolation=cv2.INTER_NEAREST)
cv2.imshow(f"Ajustement de la taille a {HEIGHT}px", image)

# Binarisation
threshold = 200
_, image = cv2.threshold(image, threshold, 160, cv2.THRESH_BINARY_INV)
cv2.imshow("Binarisation", image)

image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)

# Détection des lignes
# contours, _ = cv2.findContours(image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

# canvas = np.zeros(image.shape, np.uint8)

# cv2.drawContours(canvas, contours, -1, (255, 255, 255), 1, cv2.LINE_AA)
# cv2.imshow("Contours", canvas)

# Détection des côtés
edges = cv2.Canny(image, 50, 200)
cv2.imshow("Côtés", image)

# Détection des lignes

lines = cv2.HoughLinesP(edges, 1, np.pi/180, 100, minLineLength=10, maxLineGap=5)
for line in lines:
    x1, y1, x2, y2 = line[0]
    cv2.line(edges, (x1, y1), (x2, y2), (255, 0, 0), 3)

# Fin

cv2.waitKey(0)

cv2.destroyAllWindows()