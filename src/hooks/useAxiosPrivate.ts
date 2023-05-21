import { AuthContext } from "@/context/AuthContext";
import useRefresh from "@/hooks/useRefresh";
import { axiosPrivate } from "@/utils/axiosPrivate";
import { error } from "console";
import { useContext, useEffect } from "react";


const useAxiosPrivate = () => {
    const refresh = useRefresh();
    const {user} = useContext(AuthContext);
    
    const axiosJWT = axiosPrivate;

    useEffect(()=>{  //AxiosJWT is the parent component ==> axiosPrivate is imported in the parent component first ==> axiosPrivate is initialized first ==> axiosPrivate is used in the child component ==> axiosPrivate is used in the child component with the interceptors attached
        axiosJWT.interceptors.request.use(config=>{
            if(!config.headers.Authorization){
                console.log("Attaching Bearer")
                config.headers.Authorization = `Bearer ${user?.accessToken}`
            }
            return config
        },error=>Promise.reject(error))

        axiosJWT.interceptors.response.use(response=>response, async (error)=>{
            if(error){
                const originalRequest = error.config
                if((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry){
                    originalRequest._retry = true;
                    const accessToken = await refresh();
                    if(!accessToken){
                        console.log("Error in refreshing JWT")
                        return Promise.reject(error)
                    }
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`
                    //remake request with new JWT
                    console.log("Retrying request with new AT")
                    return axiosPrivate.request(originalRequest)
                }
                else{
                    return Promise.reject(error)
                }
            }

        })
    },[])


    return axiosJWT;
}



export default useAxiosPrivate;