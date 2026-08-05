/*
  Warnings:

  - You are about to drop the `PasswordReset` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PasswordReset" DROP CONSTRAINT "PasswordReset_userId_fkey";

-- DropTable
DROP TABLE "PasswordReset";

-- CreateTable
CREATE TABLE "OTPResetPassword" (
    "id" SERIAL NOT NULL,
    "otp" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OTPResetPassword_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OTPResetPassword_userId_idx" ON "OTPResetPassword"("userId");

-- CreateIndex
CREATE INDEX "OTPResetPassword_otp_idx" ON "OTPResetPassword"("otp");

-- AddForeignKey
ALTER TABLE "OTPResetPassword" ADD CONSTRAINT "OTPResetPassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
