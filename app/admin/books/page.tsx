import { getBooksAction } from "@/features/admin/books/actions/book";
import { BookTable } from "@/features/admin/books/components/BooksTable";

export default async function AllBooksPage() {
  // Fetch initial data for the first page (SSR)
  // This ensures the page is fast and searchable by SEO bots
  const { books } = await getBooksAction({
    page: 1,
    search: "",
  });

  return (
    <div className='w-full p-6 space-y-6'>
      <BookTable initialData={books} />
    </div>
  );
}
