import Image from 'next/image'
import { Inter } from 'next/font/google'
import { trpc } from '@/trpc'

const inter = Inter({ subsets: ['latin'] })

const  HomePage = () =>{
  const helloQuery = trpc.hello.useQuery()
  if(helloQuery.isLoading)return <h1>loading</h1>
  return (
  <div>
      {helloQuery.data}
  </div>
  )
}
export default HomePage
