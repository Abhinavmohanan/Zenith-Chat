import React, { ReactNode, useEffect } from 'react'
import useRefresh from '@/hooks/useRefresh';

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
    return <div>Loading...</div>
  }

  return (
    <>{children}
    </>
    
  )
}

export default PersistLogin
