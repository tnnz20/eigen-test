-- CreateTable
CREATE TABLE "borrows" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "book_id" INTEGER NOT NULL,
    "borrow_date" INTEGER NOT NULL,
    "return_date" INTEGER,
    "status" INTEGER NOT NULL,

    CONSTRAINT "borrows_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "borrows" ADD CONSTRAINT "borrows_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrows" ADD CONSTRAINT "borrows_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
