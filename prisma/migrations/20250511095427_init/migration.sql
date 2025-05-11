/*
  Warnings:

  - You are about to drop the column `userId` on the `SwapRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[swapRequestId,userId]` on the table `SwapRequestVolunteer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `requesterId` to the `SwapRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SwapRequest" DROP CONSTRAINT "SwapRequest_userId_fkey";

-- DropIndex
DROP INDEX "SwapRequestVolunteer_swapRequestId_key";

-- AlterTable
ALTER TABLE "SwapRequest" DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "requesterId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'open',
ADD COLUMN     "volunteerId" TEXT,
ALTER COLUMN "note" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SwapRequestVolunteer_swapRequestId_userId_key" ON "SwapRequestVolunteer"("swapRequestId", "userId");

-- AddForeignKey
ALTER TABLE "SwapRequest" ADD CONSTRAINT "SwapRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapRequest" ADD CONSTRAINT "SwapRequest_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
