/*
  Warnings:

  - You are about to drop the column `filepath` on the `Ecg` table. All the data in the column will be lost.
  - You are about to drop the column `rawImageFilePath` on the `Ecg` table. All the data in the column will be lost.
  - You are about to drop the column `treatedImageFilePath` on the `Ecg` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ecg" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "image" TEXT,
    "note" TEXT,
    "profileId" INTEGER NOT NULL,
    CONSTRAINT "Ecg_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Ecg" ("date", "id", "profileId") SELECT "date", "id", "profileId" FROM "Ecg";
DROP TABLE "Ecg";
ALTER TABLE "new_Ecg" RENAME TO "Ecg";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
