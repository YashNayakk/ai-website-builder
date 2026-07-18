import { Loader2Icon } from 'lucide-react';
import React, {useState} from 'react'

const Home = () => {
  const [input , setInput] = useState('');
  const [loading , setLoading] = useState(false);

  const onSubmitHandler = async (e: React.FormEvent) =>{
    e.preventDefault();

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }

  return (
    <section className='flex flex-col items-center text-white text-sm px-4 pb-20 font-poppins '>
      <a className='flex items-center border border-slate-700 rounded-full p-1 pr-2 mt-20 gap-2 text-sm'>
        <span className='bg-indigo-600 text-xs px-3 py-1 rounded-full'>New</span>
        <p className='flex items-center gap-2'>
          <span>Try 30 days free trial option</span>
          <svg className="mt-px" width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m1 1 4 3.5L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </p>
      </a>

      <h1 className='text-[40px] max-w-3xl text-center font-semibold mt-4 leading-12 md:text-6xl md:leading-17.5 '>Turn thoughts into websites instantly, with AI</h1>
      <p className="text-center text-base max-w-md mt-2">Create, customize and publish website faster than ever with our AI Site Builder</p>
    
      <form onSubmit={onSubmitHandler} className='bg-white/10 w-full max-w-2xl px-4 py-4 rounded-xl mt-10 border border-indigo-600/70 focus-within:ring-2 ring-indigo-500 transition-all'>
        <textarea onChange={e => setInput(e.target.value)} className='bg-transparent outline-none text-gray-300 w-full resize-none '
         rows={4} required placeholder='describe ur presentation with ai'/>
        <button  className='ml-auto flex items-center bg-linear-to-r from-[#CB52D4] to-indigo-600 gap-2 px-4 py-2 rounded-md text-white '>
          {!loading ? 'cretae with ai' : 
          (<>
          Creating <Loader2Icon className='animate-spin size-4 text-white'/>
          </>)}
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-16 md:gap-20 mx-auto mt-16">
        <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/framer.svg" alt="" />
        <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/huawei.svg" alt="" />
        <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/instagram.svg" alt="" />
        <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/microsoft.svg" alt="" />
        <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/walmart.svg" alt="" />
      </div>
    </section>
  )
}

export default Home