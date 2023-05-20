import { toast } from 'react-toastify';

export const sendErrorToast = (msg: String)=>{
    toast.error(msg, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  }

  export const sendPromiseToast = async (Promise: Promise<unknown>,pending:string,success:string,error:string)=>{
    try{
        const response : any = await toast.promise(Promise,
            {
                pending,
                success,
                error
              },
            {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
          return response
        }
        catch(err){

            console.log("Error: " + err)
        }
  }