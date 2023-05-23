import { useContext, useEffect, useMemo, useState } from "react";
import useRefresh from "./useRefresh";
import { AuthContext } from "@/context/AuthContext";
import {Socket, io} from 'socket.io-client'

const useSocket = ()=>{  //ISSUE WHEN USER ALONE UPDATES ACCESS TOKEN IS NOT UPDATED IN SOCKET IT HAS TO TRY ACCESSING SOCKET TO SHOW ERROR AND THEN REFRESH AGAIN TO GET NEW ACCESS TOKEN
  const {user } = useContext(AuthContext)
  const [socket,setSocket] = useState<Socket | null>(null)

  useEffect(() => {
      const socketIo = io("http://localhost:4000/chat",{autoConnect:false,auth:{accessToken:user?.accessToken},});
      socketIo.connect();
      setSocket(socketIo)

      return () => {
        socketIo.disconnect();
      }
  },[])

  return socket
}

export default useSocket;