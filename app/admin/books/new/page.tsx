import {
  createBookAction,
  getBookFormOptions,
} from "@/features/admin/books/actions/book";
import { BookForm } from "@/features/admin/books/components/BookForm";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function NewBookPage() {
  // 1. Fetch the options needed for the form props
  const { departments, categories } = await getBookFormOptions();

  const handleCreate = async (formData: FormData) => {
    "use server";

    const result = await createBookAction(formData);

    if (result.success) {
      toast.success("book created successfully!");
      redirect("/admin/books");
    } else {
      toast.error("failed to create book");
      throw new Error(result.message);
    }
  };

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
        onSubmit={handleCreate}
      />
    </div>
  );
}
