import React from "react";
import { Book } from "db";
import { trpc } from "@/trpc";

interface Props {
  book: Omit<Book, "createdAt"> & {
    createdAt: string;
  };
}
const BookItem = ({ book }: Props) => {
  const deleteMutation = trpc.books.deleteBoook.useMutation();
  const utils = trpc.useContext();
  const handleDelete = () => {
    deleteMutation.mutate(
      {
        id: book.id,
      },
      {
        onSuccess: () => {
          utils.books.getAllBooks.invalidate();
        },
      }
    );
  };
  return (
    <li
      className={`${
        deleteMutation.isLoading && "opacity-75"
      } py-4 px-2 rounded-md curosr-pointer bg-gray-50 text-black font-medium flex justify-between `}
    >
      <span className="text-sm">
        title:{book.title} pages:{book.pages} author:{book.author}
      </span>
      <div onClick={handleDelete} className="rounded-full w-5 flex justify-center items-center ct h-5  text-xs px-- bg-red-400 text-white cursor-pointer font-medium">
        <span>x</span>
      </div>
    </li>
  );
};

export default BookItem;
