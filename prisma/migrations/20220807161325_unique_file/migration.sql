/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_title_key" ON "File"("title");

-- CreateIndex
CREATE UNIQUE INDEX "File_name_key" ON "File"("name");
