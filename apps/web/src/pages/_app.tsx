import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { trpc } from "@/trpc";
import Header from "@/components/layout/Header/Header";
import NextNProgress from 'nextjs-progressbar';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <NextNProgress color="#3b82f6" />
      <Header />
      <Component {...pageProps} />
    </>
  );
};
export default trpc.withTRPC(MyApp);
