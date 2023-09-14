import Image from 'next/image'
import { Inter } from 'next/font/google'
import { trpc } from '@/trpc'
import { ChangeEvent, FormEvent, FormEventHandler, useState } from 'react'
import { initialize } from 'next/dist/server/lib/render-server'
import BookItem from '@/components/BookItem'

const inter = Inter({ subsets: ['latin'] })
const initialForm  = {
  title:"",
  author:"",
  pages:1,
}
const  HomePage = () =>{

  const utils = trpc.useContext()
  const [form,setForm] = useState(initialForm)
  const createBookMutation = trpc.books.createBook.useMutation()
  const getAllBooksQuery = trpc.books.getAllBooks.useQuery()
  const handleChange = (e:ChangeEvent<HTMLInputElement>)=>
    setForm(prev=>({...prev,[e.target.name]:e.target.value}))

  const handleSubmitForm = (e:FormEvent)=>{
    const pages = parseInt(form.pages.toString())
    e.preventDefault()
     createBookMutation.mutate({
      pages:pages ,
      title:form.title,
      author:form.author

    },{
        onSuccess:(e)=>{
          setForm(initialForm)
          utils.books.getAllBooks.invalidate()
        }

    })
  }
  return (
  <div className="w-full min-h-screen  pt-10   max-w-md mx-auto flex flex-col gap-4">
     <form onSubmit={handleSubmitForm} className='w-full flex flex-col gap-2'>  
        <input placeholder='title' className='w-full outline-blue-300 outline outline-2 px-2 h-10 rounded-md bg-white text-gray-800 ' onChange={handleChange} value={form["title"]}  name="title" />
        <input className='w-full outline-blue-300 outline outline-2 h-10 rounded-md bg-white text-gray-800 '  type='number' onChange={handleChange} value={form["pages"]}  name="pages" />
        <input placeholder='author' className='w-full outline outline-2 outline-blue-300 px-2 h-10 rounded-md bg-white text-gray-800 '  onChange={handleChange} value={form["author"]}  name="author" />
        <button className=" py-3  rounded-md mt-4 bg-blue-500 text-white font-medium curosr-pointer">
          create
        </button>
     </form>  
      {getAllBooksQuery.isLoading ? 
        <h1>loading books</h1>
        :
      <ul className="flex flex-col gap-2">
        <li>results {getAllBooksQuery.data?.numberOfResults}</li>
        {getAllBooksQuery?.data?.results.map(book=>(<BookItem key={book.id} book={book} />))}
      </ul>

      }
  </div>
  )
}
export default HomePage
