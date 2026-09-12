CREATE TYPE "Role" AS ENUM ('OWNER', 'TRAINER');
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'OVERDUE');
CREATE TYPE "PlanType" AS ENUM ('CLASSIC', 'TOTAL', 'PERSONALIZED', 'CLASSES');
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED');
CREATE TYPE "PaymentConcept" AS ENUM ('FEE', 'PLAN');
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'TRANSFER');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'TRAINER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Plan" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "monthlyPrice" DECIMAL(10,2) NOT NULL,
  "type" "PlanType" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Member" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "joinedAt" TIMESTAMP(3) NOT NULL,
  "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
  "planId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Membership" (
  "id" TEXT NOT NULL,
  "memberId" TEXT NOT NULL,
  "planId" TEXT NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3),
  "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CheckIn" (
  "id" TEXT NOT NULL,
  "memberId" TEXT NOT NULL,
  "enteredAt" TIMESTAMP(3) NOT NULL,
  "leftAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Payment" (
  "id" TEXT NOT NULL,
  "memberId" TEXT NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "concept" "PaymentConcept" NOT NULL,
  "paidAt" TIMESTAMP(3) NOT NULL,
  "method" "PaymentMethod" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Plan_name_key" ON "Plan"("name");
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");
CREATE INDEX "Member_status_idx" ON "Member"("status");
CREATE INDEX "Member_planId_idx" ON "Member"("planId");
CREATE INDEX "Membership_memberId_idx" ON "Membership"("memberId");
CREATE INDEX "Membership_planId_idx" ON "Membership"("planId");
CREATE INDEX "Membership_status_idx" ON "Membership"("status");
CREATE INDEX "CheckIn_memberId_idx" ON "CheckIn"("memberId");
CREATE INDEX "CheckIn_enteredAt_idx" ON "CheckIn"("enteredAt");
CREATE INDEX "CheckIn_enteredAt_leftAt_idx" ON "CheckIn"("enteredAt", "leftAt");
CREATE INDEX "Payment_memberId_idx" ON "Payment"("memberId");
CREATE INDEX "Payment_paidAt_idx" ON "Payment"("paidAt");

ALTER TABLE "Member" ADD CONSTRAINT "Member_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
