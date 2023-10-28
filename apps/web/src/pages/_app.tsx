import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { trpc } from "@/trpc";
import Header from "@/components/layout/Header/Header";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
};
export default trpc.withTRPC(MyApp);
