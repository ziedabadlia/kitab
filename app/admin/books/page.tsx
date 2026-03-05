import { getBooksAction } from "@/features/admin/books/actions/book";
import { BookTable } from "@/features/admin/books/components/BooksTable";

export const revalidate = 300;

export default async function AllBooksPage() {
  const initialData = await getBooksAction({ page: 1, search: "" });

  return (
    <div className='w-full p-6 space-y-6'>
      <BookTable initialData={initialData} />
    </div>
  );
}
