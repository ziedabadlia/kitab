import {
  createBookAction,
  getBookFormOptions,
} from "@/features/admin/books/actions/book";
import { BookForm } from "@/features/admin/books/components/BookForm";

export default async function NewBookPage() {
  const { departments, categories } = await getBookFormOptions();

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-slate-900'>Create New Book</h1>
        <p className='text-slate-500'>
          Fill in the details to add a new book to the library.
        </p>
      </div>

      <BookForm
        departments={departments}
        categories={categories}
        onSubmit={createBookAction}
      />
    </div>
  );
}
