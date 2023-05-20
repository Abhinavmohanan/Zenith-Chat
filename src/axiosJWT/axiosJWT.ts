import { AuthContext } from "@/context/AuthContext";
import useRefresh from "@/hooks/useRefresh";
import { axiosPrivate } from "@/utils/axiosPrivate";
import { useContext } from "react";

const axiosJWT = axiosPrivate

axiosJWT.interceptors.request.use(config=>{
    const {user} = useContext(AuthContext);
    config.headers.Authorization = `Bearer ${user?.accessToken}`
    return config
})

axiosJWT.interceptors.response.use(response=>response, error=>{
    const refresh = useRefresh()
    if(error.response.status === 401){
        refresh();
    }
    else{
        return Promise.reject(error)
    }
})


export default axiosJWT;