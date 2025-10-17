-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ecg" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "isBad" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "note" TEXT,
    "profileId" INTEGER NOT NULL,
    CONSTRAINT "Ecg_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Ecg" ("date", "id", "image", "note", "profileId") SELECT "date", "id", "image", "note", "profileId" FROM "Ecg";
DROP TABLE "Ecg";
ALTER TABLE "new_Ecg" RENAME TO "Ecg";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "pseudonym" TEXT,
    "dateOfBirth" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "image" TEXT,
    "isParticipating" BOOLEAN NOT NULL DEFAULT false,
    "refreshToken" TEXT
);
INSERT INTO "new_User" ("dateOfBirth", "email", "gender", "id", "image", "password", "pseudonym", "refreshToken", "username") SELECT "dateOfBirth", "email", "gender", "id", "image", "password", "pseudonym", "refreshToken", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
