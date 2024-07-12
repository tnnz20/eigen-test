-- CreateTable
CREATE TABLE "books" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "author" VARCHAR(100) NOT NULL,
    "stock" INTEGER NOT NULL,
    "is_borrowed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" INTEGER NOT NULL,
    "updated_at" INTEGER NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "books_code_key" ON "books"("code");
