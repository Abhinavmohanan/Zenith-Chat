import { useContext, useEffect, useMemo } from "react";
import useRefresh from "./useRefresh";
import { AuthContext } from "@/context/AuthContext";
import {io} from 'socket.io-client'



const useSocket = ()=>{
    const refresh = useRefresh();
    const {user} = useContext(AuthContext);
    let socket = useMemo(()=>{
      if(user?.accessToken) return io("http://localhost:4000/chat",{auth:{accessToken:user?.accessToken}})
    },[user?.accessToken])
    let debounceSocket: any;

    if(socket) {
        socket.on('connect',()=>{
          console.log("Connected to socket" + socket?.id);
        })

        socket.on('disconnect',()=>{
          console.log("Disconnected socket " + socket?.id);
          socket?.removeAllListeners('connect');
          socket?.removeAllListeners('connect_error');
          socket?.removeAllListeners('disconnect');
        })

        socket.on("connect_error", (err: any) => {
          console.log(err,err.message);
          if(err.data?.refresh){
            console.log("Refresh required from socket")
            refresh();
          }
        });
    }
  

    useEffect(() => {
          debounceSocket = setTimeout(async() => {
            if(!user?.accessToken) return
            socket = io("http://localhost:4000/chat",{auth:{accessToken:user?.accessToken}})
          }, 500)
        
        return () => {
            socket?.disconnect();
            clearTimeout(debounceSocket)
          }
      }, [user])


    return socket;
}

export default useSocket;