-- CreateTable
CREATE TABLE "penalties" (
    "id" TEXT NOT NULL,
    "member_id" INTEGER NOT NULL,
    "start_date" INTEGER NOT NULL,
    "end_date" INTEGER NOT NULL,

    CONSTRAINT "penalties_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "penalties" ADD CONSTRAINT "penalties_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
