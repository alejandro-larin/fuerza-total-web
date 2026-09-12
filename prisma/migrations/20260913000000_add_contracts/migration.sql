CREATE TYPE "ContractStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');

CREATE TABLE "Contract" (
  "id" TEXT NOT NULL,
  "memberId" TEXT NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3),
  "status" "ContractStatus" NOT NULL DEFAULT 'ACTIVE',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Contract_memberId_idx" ON "Contract"("memberId");
CREATE INDEX "Contract_status_idx" ON "Contract"("status");

ALTER TABLE "Contract" ADD CONSTRAINT "Contract_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
