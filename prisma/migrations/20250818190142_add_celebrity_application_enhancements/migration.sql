-- AlterTable
ALTER TABLE "celebrity_applications" ADD COLUMN     "agreeToTerms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasIdDocumentBack" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasIdDocumentFront" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasIntroVideo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "idDocumentBackUrl" TEXT,
ADD COLUMN     "idDocumentFrontUrl" TEXT,
ADD COLUMN     "introVideoUrl" TEXT,
ADD COLUMN     "merchandiseLink" TEXT;
