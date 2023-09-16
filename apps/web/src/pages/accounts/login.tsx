
import Input from '@/ui/Input'
import React,{FormEvent} from 'react'

const Login = () => {
  const handleForm = (e:FormEvent)=>{
    e.preventDefualt()
  }
  return (
    <main>
      <div> 
        <form onClick={handleForm} className="flex flex-col gap-2 ">
          <Input/>
          <Input/>
          <Input/>
          <div className="py-2"/>
          <Button/>
        </form>
      </div> 
    </main>
  )
}

export default Login
