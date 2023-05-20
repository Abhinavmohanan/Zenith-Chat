import React, { ReactNode, useContext, useEffect, useRef } from 'react'
import {AuthContext} from '../context/AuthContext'
import { useRouter } from 'next/router'
import useRefresh from '@/hooks/useRefresh';
import { get } from 'http';

type ProtectedType = {
  children: ReactNode;
}

const Protected =  ({children} : ProtectedType) => {
  const router = useRouter();
  const [loading,setLoading] = React.useState(true);
  const {user}= useContext(AuthContext);
  
  useEffect(()=>{
    setLoading(true)
    console.log("USER CHANGED: ")
    console.log(user)
    if(router && !user && router.pathname == '/homepage'){
      router.push('/')
      console.log("Redirecting to homepage")
    }
    // if(router && user && router.pathname == '/'){
    //   router.push('/homepage')
    // }
    setLoading(false)
  },[router,user])

  if(loading){
    return <div>Loading...</div>
  }

  return (
    <>{children}
    </>
    
  )
}

export default Protected
