-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ecg" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "filepath" TEXT NOT NULL,
    "rawImageFilePath" TEXT,
    "treatedImageFilePath" TEXT,
    "profileId" INTEGER NOT NULL,
    CONSTRAINT "Ecg_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Ecg" ("date", "filepath", "id", "profileId", "rawImageFilePath", "treatedImageFilePath") SELECT "date", "filepath", "id", "profileId", "rawImageFilePath", "treatedImageFilePath" FROM "Ecg";
DROP TABLE "Ecg";
ALTER TABLE "new_Ecg" RENAME TO "Ecg";
CREATE TABLE "new_Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "pseudonym" TEXT NOT NULL,
    "image" TEXT,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Profile" ("id", "image", "pseudonym", "userId", "username") SELECT "id", "image", "pseudonym", "userId", "username" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
