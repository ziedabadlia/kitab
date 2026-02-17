import { updateBookAction } from "@/features/admin/books/actions/book";
import { BookForm } from "@/features/admin/books/components/BookForm";
import { getBookByIdAction } from "@/features/admin/booksDetails/actions/book";
import { getBookFormOptions } from "@/features/admin/books/actions/book";
import { redirect, notFound } from "next/navigation";

export default async function EditBookPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  // Fetch book data and form options in parallel
  const [book, { departments, categories }] = await Promise.all([
    getBookByIdAction(id),
    getBookFormOptions(),
  ]);

  // Handle case where book doesn't exist
  if (!book) {
    notFound();
  }

  // Server action to handle form submission
  const handleUpdate = async (formData: FormData) => {
    "use server";

    // Add the book ID to the FormData
    formData.append("bookId", id);

    const result = await updateBookAction(formData);

    if (result.success) {
      redirect("/admin/books");
    } else {
      throw new Error(result.message || "Failed to update book");
    }
  };

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-slate-800'>Edit Book</h1>
        <p className='text-slate-600 mt-1'>Update the book information below</p>
      </div>

      <BookForm
        initialData={book}
        departments={departments}
        categories={categories}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
