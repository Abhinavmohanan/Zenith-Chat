import React, { ReactNode, useEffect } from 'react'
import useRefresh from '@/hooks/useRefresh';
import { CircularProgress } from '@mui/material';

type ProtectedType = {
  children: ReactNode;
}

const PersistLogin =  ({children} : ProtectedType) => {
  const [loading,setLoading] = React.useState(true);
  const refresh = useRefresh();

  useEffect(()=>{
      setLoading(true)
      async function getLoginState(){
        const res: any = await refresh();
        setLoading(false)
      }
      getLoginState();
  },[])

  if(loading){
    return <div className='flex gap-5 text-lg text-cyan-800 justify-center items-center h-screen'>Loading <CircularProgress/></div>
  }

  return (
    <>{children}
    </>
    
  )
}

export default PersistLogin
