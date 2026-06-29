-- CreateEnum
CREATE TYPE "Role" AS ENUM ('instructor', 'student');

-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('Beginner', 'Medium', 'Advance');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('pending', 'completed', 'failed');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'student',
    "photoUrl" TEXT NOT NULL DEFAULT '',
    "photoPublicId" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "courseTitle" TEXT NOT NULL,
    "subTitle" TEXT,
    "description" TEXT,
    "category" TEXT,
    "courseLevel" "CourseLevel" NOT NULL DEFAULT 'Beginner',
    "coursePrice" DOUBLE PRECISION,
    "courseThumbnail" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lecture" (
    "id" TEXT NOT NULL,
    "lectureTitle" TEXT NOT NULL,
    "videoUrl" TEXT,
    "publicId" TEXT NOT NULL DEFAULT '',
    "isPreviewFree" BOOLEAN NOT NULL DEFAULT false,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LectureProgress" (
    "id" TEXT NOT NULL,
    "lectureId" TEXT NOT NULL,
    "viewed" BOOLEAN NOT NULL DEFAULT false,
    "courseProgressId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LectureProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoursePurchase" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'pending',
    "orderId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL DEFAULT '',
    "courseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoursePurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseEnrollments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseEnrollments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CourseProgress_userId_courseId_key" ON "CourseProgress"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "LectureProgress_courseProgressId_lectureId_key" ON "LectureProgress"("courseProgressId", "lectureId");

-- CreateIndex
CREATE UNIQUE INDEX "CoursePurchase_orderId_key" ON "CoursePurchase"("orderId");

-- CreateIndex
CREATE INDEX "_CourseEnrollments_B_index" ON "_CourseEnrollments"("B");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseProgress" ADD CONSTRAINT "CourseProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseProgress" ADD CONSTRAINT "CourseProgress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureProgress" ADD CONSTRAINT "LectureProgress_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureProgress" ADD CONSTRAINT "LectureProgress_courseProgressId_fkey" FOREIGN KEY ("courseProgressId") REFERENCES "CourseProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePurchase" ADD CONSTRAINT "CoursePurchase_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePurchase" ADD CONSTRAINT "CoursePurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseEnrollments" ADD CONSTRAINT "_CourseEnrollments_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseEnrollments" ADD CONSTRAINT "_CourseEnrollments_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
