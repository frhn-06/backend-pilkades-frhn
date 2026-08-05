/*
  Warnings:

  - A unique constraint covering the columns `[otp]` on the table `OTPResetPassword` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "OTPResetPassword_otp_idx";

-- CreateIndex
CREATE UNIQUE INDEX "OTPResetPassword_otp_key" ON "OTPResetPassword"("otp");
