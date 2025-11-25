/*
  Warnings:

  - You are about to drop the column `biografia` on the `Candidato` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Candidato" DROP COLUMN "biografia",
ADD COLUMN     "experiencias" TEXT;
