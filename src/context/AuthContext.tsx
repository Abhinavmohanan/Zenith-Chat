import { userType } from '@/types/userType';
import React,{ReactNode, ServerContext, createContext, useState} from 'react'



type contextType = {
  user: userType | null,
  setUser: React.Dispatch<React.SetStateAction<userType | null>>
}


export const AuthContext = createContext<contextType>({user:null,setUser:()=>{}});

type authType = {
    children: ReactNode
  }

export const AuthProvider = ({children} : authType) => {
    const [user,setUser] = useState<userType | null>(null);

  return (
    <AuthContext.Provider value={{user,setUser}}>
        {children}
    </AuthContext.Provider>
  )
}
