-- CreateEnum
CREATE TYPE "ElectionStatus" AS ENUM ('DRAFT', 'UPCOMMING', 'ONGOING', 'FINISHED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Election" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "desa" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "status" "ElectionStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Election_pkey" PRIMARY KEY ("id")
);
