/*
  Warnings:

  - You are about to drop the column `token` on the `verification_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[verificationCode]` on the table `verification_tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `verificationCode` to the `verification_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."verification_tokens_token_key";

-- AlterTable
ALTER TABLE "public"."verification_tokens" DROP COLUMN "token",
ADD COLUMN     "verificationCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_verificationCode_key" ON "public"."verification_tokens"("verificationCode");
