import { AuthContext } from "@/context/AuthContext";
import { axiosPrivate } from "@/utils/axiosPrivate";
import axios from "axios";
import { useContext } from "react";


const useRefresh = () => {

    const {setUser} = useContext(AuthContext);

    const refresh = async() => {
        let response;
        try{
            response = await axiosPrivate.post('/refreshToken',{ headers: {'Content-Type': 'application/json' }},{withCredentials:true})
            if(response.status == 401){
                console.log("Unauthorized")
                setUser(null);
                return;
            }
            if(response.status == 200){
                setUser(response.data.user);
            }

            return response.status;
        }
        catch(err){
            console.log(err)
            return
        }

        return 0;
    }

    return refresh
}

export default useRefresh;