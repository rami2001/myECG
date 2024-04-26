/*
  Warnings:

  - You are about to alter the column `gender` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.
  - You are about to alter the column `gender` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "pseudonym" TEXT,
    "dateOfBirth" DATETIME NOT NULL,
    "gender" BOOLEAN NOT NULL,
    "image" TEXT,
    "refreshToken" TEXT
);
INSERT INTO "new_User" ("dateOfBirth", "email", "gender", "id", "image", "password", "pseudonym", "refreshToken", "username") SELECT "dateOfBirth", "email", "gender", "id", "image", "password", "pseudonym", "refreshToken", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE TABLE "new_Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "pseudonym" TEXT,
    "dateOfBirth" DATETIME NOT NULL,
    "gender" BOOLEAN NOT NULL,
    "image" TEXT,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Profile" ("dateOfBirth", "gender", "id", "image", "pseudonym", "userId", "username") SELECT "dateOfBirth", "gender", "id", "image", "pseudonym", "userId", "username" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
