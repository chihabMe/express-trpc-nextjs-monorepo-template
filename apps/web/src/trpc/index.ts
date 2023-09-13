
import {httpBatchLink} from "@trpc/client"
import {createTRPCNext} from "@trpc/next"
import type {AppRouter} from "server/src/trpc/router"

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  if (process.env.RENDER_INTERNAL_HOSTNAM)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  // assume localhost
   return `http://localhost:${process.SERVER_PORT??3001}`
}
export const trpc = createTRPCNext<AppRouter>({
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
