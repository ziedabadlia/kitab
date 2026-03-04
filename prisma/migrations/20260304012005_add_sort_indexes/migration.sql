-- CreateIndex
CREATE INDEX "books_available_copies_idx" ON "books"("available_copies");

-- CreateIndex
CREATE INDEX "borrowings_created_at_idx" ON "borrowings"("created_at");

-- CreateIndex
CREATE INDEX "borrowings_status_created_at_idx" ON "borrowings"("status", "created_at");
