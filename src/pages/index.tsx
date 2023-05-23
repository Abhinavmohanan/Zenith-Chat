import { Inter } from 'next/font/google'
import { useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Lottie from 'lottie-react'
import animData from '../assets/animations/welcome.json';
import { axiosPublic } from '@/utils/axiosPrivate';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendErrorToast, sendPromiseToast } from '@/utils/toast'
import { AuthContext } from '@/context/AuthContext'
import { Visibility, VisibilityOff } from '@mui/icons-material';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [register, setRegister] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { user, setUser } = useContext(AuthContext);
  const name = useRef<HTMLInputElement>(null)
  const username = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)
  const email = useRef<HTMLInputElement>(null)
  const loginpassword = useRef<HTMLInputElement>(null)
  const loginemail = useRef<HTMLInputElement>(null)


  const router = useRouter()
  async function handleLoginSubmit() {
    if (!loginemail.current?.value || !loginpassword.current?.value) {
      sendErrorToast("Please fill all the fields")
      return
    }

    const promise = axiosPublic.post('/login', {
      email: loginemail.current?.value,
      password: loginpassword.current?.value,
    },
      { headers: { 'Content-Type': 'application/json' } })
      try{
        const response: any = await sendPromiseToast(promise, "Loggin in...", "Logged in Successfully", "Error while Loggin in",)
        console.log(response)
        if (response) {
          setUser(response.data.user)
          //Reset form 
          loginemail.current.value = ""
          loginpassword.current.value = ""
          router.push('/homepage')
        }
      }catch(err){
        console.log("Error while logging in" + err)
        return
      }

  }

  async function handleRegisterSubmit() {
    if (!email.current?.value || !password.current?.value || !name.current?.value || !username.current?.value) {
      sendErrorToast("Please fill all the fields")
      return
    }

    const promise = axiosPublic.post('/register', {
      email: email.current?.value,
      password: password.current?.value,
      name: name.current?.value,
      username: username.current?.value
    },
      { headers: { 'Content-Type': 'application/json' } })
    const reponse = await sendPromiseToast(promise, "Registering...", "Registered Successfully , You can now Login", "Error while registering",)
    if(reponse){
      //reset form
      email.current.value = ""
      password.current.value = ""
      name.current.value = ""
      username.current.value = ""

      setRegister(false);
    }
  }

  return (
    <main>
      {/* <Navbar />       */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className={`relative xl:h-screen flex justify-around items-center  ${inter.className} max-md:flex-col max-lg::px-0 max-sm:px-0`}>
        <Lottie className='w-1/2 max-sm:w-3/5' animationData={animData} loop={true} />
        {user ? <><button onClick={() => {
          router.push('/homepage')
        }} className=''>View dashboard</button></> : <>
          <div className='login-reg-container'>
            <div id="login-form" className={'login-transition flex gap-5 flex-col items-center justify-center bg-gray-100 rounded-2xl backdrop-filter backdrop-blur-2xl bg-opacity-30 border border-blue-200 max-lg:w-5/6 max-sm:w-11/12 ' + (!register ? ' visible' : '')}>
              <div className=' text-black'>Login</div>
              <form onSubmit={(e) => console.log("Submitted Form" + e)} className='flex flex-col gap-7 w-full p-10'>
                <div>
                  <div className='text-zinc-950 mb-2'>Email / Username</div>
                  <input
                    placeholder="Type your Email/Username here"
                    ref={loginemail} className='w-full p-2 bg-blue-100 rounded-lg text-black focus:outline-none focus:border focus:bg-blue-50 border-blue-300' />
                </div>
                <div>
                  <div className='text-zinc-950 mb-1'>Password</div>
                  <div className='relative'>
                    <input
                      ref={loginpassword} className='w-full p-2 bg-blue-100 rounded-lg text-black focus:outline-none focus:border focus:bg-blue-50 border-blue-300'
                      type={showPass ? "text" : "password"}
                      placeholder="Type your password here"
                    />
                    {showPass ? (
                      <VisibilityOff
                        onClick={() => {
                          setShowPass(!showPass);
                        }}
                        sx={{
                          color: "rgb(75, 179, 253)",
                          position: "absolute",
                          right: "10px",
                          top: "25%",
                          cursor: "pointer",
                        }}
                      />
                    ) : (
                      <Visibility
                        onClick={() => {
                          setShowPass(!showPass);
                        }}
                        sx={{
                          color: "rgb(75, 179, 253)",
                          position: "absolute",
                          right: "10px",
                          top: "25%",
                          cursor: "pointer",
                        }}
                      />
                    )}
                  </div>
                  <div className='text-zinc-950 mt-1'>Forgot your password?</div>
                </div>
              </form>
              <button className='text-black' onClick={handleLoginSubmit}>Submit</button>
              <div className='text-zinc-950 cursor-pointer' onClick={() => {
                setRegister(!register)
              }}> Do not have an account yet ? Register now</div>
            </div>
            <div id='register-form' className={'login-transition flex gap-5 flex-col items-center justify-center bg-gray-100 rounded-2xl backdrop-filter backdrop-blur-2xl bg-opacity-30 border border-blue-200 max-lg:w-5/6 max-sm:w-11/12 ' + (register ? ' visible' : '')}>
              <div className='pt-5 text-black'>Register</div>
              <form onSubmit={(e) => console.log("Submitted Form" + e)} className='flex flex-col gap-7 w-full p-10'>
                <div className='flex justify-between'>
                  <div className='pr-2 w-1/2'>
                    <div className='text-zinc-950 mb-2'>Name</div>
                    <input placeholder='Type your name' ref={name} className='w-full p-2 bg-blue-100 rounded-lg text-black focus:outline-none focus:border focus:bg-blue-50 border-blue-300' />
                  </div>
                  <div className=' pl-2 w-1/2'>
                    <div className='text-zinc-950 mb-2'>Username</div>
                    <input placeholder='Type a username' ref={username} className=' w-full p-2 bg-blue-100 rounded-lg text-black focus:outline-none focus:border focus:bg-blue-50 border-blue-300' />
                  </div>
                </div>
                <div>
                  <div className='text-zinc-950 mb-2'>Email</div>
                  <input placeholder='Type your email' ref={email} className='w-full p-2 bg-blue-100 rounded-lg text-black focus:outline-none focus:border focus:bg-blue-50 border-blue-300' />
                </div>
                <div>
                  <div className='text-zinc-950 mb-1'>Password</div>
                  <div className='relative'>
                    <input
                      ref={password} className='w-full p-2 bg-blue-100 rounded-lg text-black focus:outline-none focus:border focus:bg-blue-50 border-blue-300'
                      type={showPass ? "text" : "password"}
                      placeholder="Type your password here"
                    />
                    {showPass ? (
                      <VisibilityOff
                        onClick={() => {
                          setShowPass(!showPass);
                        }}
                        sx={{
                          color: "rgb(75, 179, 253)",
                          position: "absolute",
                          right: "10px",
                          top: "25%",
                          cursor: "pointer",
                        }}
                      />
                    ) : (
                      <Visibility
                        onClick={() => {
                          setShowPass(!showPass);
                        }}
                        sx={{
                          color: "rgb(75, 179, 253)",
                          position: "absolute",
                          right: "10px",
                          top: "25%",
                          cursor: "pointer",
                        }}
                      />
                    )}
                  </div>
                </div>
              </form>
              <button className='text-black' onClick={handleRegisterSubmit}>Submit</button>
              <div className='text-zinc-950 cursor-pointer pb-5' onClick={() => {
                setRegister(!register)
              }}> Already an account ? Login now</div>
            </div>
          </div>
        </>}
      </div>
    </main>
  )
}
