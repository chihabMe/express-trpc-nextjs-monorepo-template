import React from "react";
import type { GetServerSideProps } from "next";
import { TRPCReturnOutputs, trpcServerClient } from "@/trpc";
interface Props {
  data: TRPCReturnOutputs["books"]["getAllBooks"];
}
export const ProfilePage = ({ data }: Props) => {
  return (
    <div>
      <h1 className="font-bold text-xl capitalize">
        results : {data.numberOfResults}
      </h1>
      <ul className="flex flex-col gap-2 ">
        {data.results.map((item) => <li key={item.id}>{item.title}</li>)}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const data = await trpcServerClient.books.getAllBooks.fetch();
  console.log(data);
  return {
    props: {
      data,
      trpcState: trpcServerClient.dehydrate(),
    },
  };
};
export default ProfilePage;
