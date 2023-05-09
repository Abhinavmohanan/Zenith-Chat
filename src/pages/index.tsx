import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState } from 'react'
import { Configuration, OpenAIApi } from "openai";
import Navbar from '@/components/Navbar/Navbar';
import Lottie from 'lottie-react'
import animData from  '../assets/animations/welcome.json' ;

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  return (
    <>
      {/* <Navbar/> */}
        <main className={`xl:h-screen flex  px-32 py-16 justify-between items-center  bg-gradient-to-r  from-cyan-300 to-sky-400 ${inter.className} max-lg:flex-col max-lg:px-0 max-sm:px-0`}>
            <Lottie className='w-1/2 max-sm:w-4/5' animationData={animData} loop={true}/>
            <div className='flex flex-wrap flex-col items-center justify-between w-1/3 bg-gray-100 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-30 border border-blue-200 max-lg:w-5/6 max-sm:w-11/12
        '>
               <div className='mt-20'>Login</div>
               <form onSubmit={(e)=>console.log("Submit Form" + e)} className='flex flex-col gap-7 w-full p-10'>
                  <div>
                    <div className='text-zinc-950 mb-2'>Username/Email</div>
                    <input className='w-full p-2 bg-blue-100 rounded-lg text-black focus:outline-none focus:border focus:bg-blue-50 border-blue-300'/>
                  </div>
                  <div>
                    <div className='text-zinc-950 mb-1'>Password</div>
                    <input className='w-full p-2 bg-blue-100 rounded-lg text-black focus:outline-none focus:border focus:bg-blue-50 border-blue-300'/>
                    <div className='text-zinc-950 mt-1'>Forgot your password?</div>
                  </div>
               </form>
               <button className='mb-20' >Submit</button>
            </div>
        </main>
    </>
  )
}
