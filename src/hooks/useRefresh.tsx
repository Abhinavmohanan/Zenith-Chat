import { AuthContext } from "@/context/AuthContext";
import { axiosPrivate, axiosPublic } from "@/utils/axiosPrivate";
import axios from "axios";
import { useContext } from "react";


const useRefresh = () => {

    const {setUser} = useContext(AuthContext);

    const refresh = async() => {
        let response;
        try{
            response = await axiosPublic.post('/refreshToken',{ headers: {'Content-Type': 'application/json' }},{withCredentials:true})
            if(response.status === 200){
                setUser(response.data.user);
                return response.data.user.accessToken;
            }
        }
        catch(err: any){
            console.log("Unauthorized")
            console.log(err)
            setUser(null);
            return;
        }
    }

    return refresh
}

export default useRefresh;