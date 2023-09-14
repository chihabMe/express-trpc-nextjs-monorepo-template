
import {httpBatchLink} from "@trpc/client"
import {createTRPCNext} from "@trpc/next"
import type {AppRouter} from "server/src/trpc/router"

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';

  if (process.env.TRPC_SERVER_URL)
    // reference for vercel.com
    return `https://${process.env.TRPC_SERVER_URL}`;

  // assume localhost
   return `http://localhost:${process.env.SERVER_PORT??3001}`
}
let trpcClient;

const trpcServerUrl = process.env.NEXT_PUBLIC_TRPC_SERVER_URL
console.log('server url ',trpcServerUrl)
if(!trpcServerUrl){
  trpcClient = createTRPCNext<AppRouter>({
  config(opts) {
    // const url = `${getBaseUrl()}/api/trpc`
    const url = `http://localhost:3001/api/trpc`
    console.log(url)
    return {
      links: [
        httpBatchLink({

          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/

          url,

          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
      ],
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
});

}else{
  trpcClient = createTRPCNext<AppRouter>({
  config(opts) {
    // const url = `${getBaseUrl()}/api/trpc`
    const url = `${trpcServerUrl}/api/trpc`
    console.log("production",url)
    return {
      links: [
        httpBatchLink({

          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/

          url,

          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
      ],
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
});

}
export const trpc  = trpcClient  ;
