import { trpc } from "@/trpc";
import React from "react";
export const ProfilePage = () => {
  const { isLoading, data: profile } =
    trpc.accounts.getLoggedUserAccount.useQuery();
  if (isLoading) return <h1>loading</h1>;
  return <div>{profile?.username}</div>;
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
// };
export default ProfilePage;
