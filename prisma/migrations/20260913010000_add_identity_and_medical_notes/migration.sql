ALTER TABLE "User"
ADD COLUMN "dui" TEXT,
ADD COLUMN "medicalNotesKey" TEXT,
ADD COLUMN "medicalNotesName" TEXT;

ALTER TABLE "Member"
ADD COLUMN "dui" TEXT,
ADD COLUMN "emergencyPhone" TEXT,
ADD COLUMN "medicalNotesKey" TEXT,
ADD COLUMN "medicalNotesName" TEXT;

CREATE UNIQUE INDEX "User_dui_key" ON "User"("dui");
CREATE UNIQUE INDEX "Member_dui_key" ON "Member"("dui");
