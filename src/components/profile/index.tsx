import { AuthContext } from '@/context/AuthContext';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { Close, Edit } from '@mui/icons-material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useContext } from 'react';
import profile from '../../assets/images/profile.jpg';
import styles from './profile.module.css';

type propsType = {
  setProfileView: Dispatch<SetStateAction<boolean>>
}

const Profile = ({setProfileView }: propsType) => {
    const axiosJWT = useAxiosPrivate();
    const {user,setUser} = useContext(AuthContext);
    const router = useRouter();

    
    const handleLogout = async() => {
      try{
        const response = await axiosJWT.post('/logout',{},{withCredentials:true})
        if(response.status === 200){
          setUser(null);
          router.push('/')
        }
      }
      catch(err){
        console.log(err)
      }
    }
    const blue = {
        100: '#DAECFF',
        200: '#b6daff',
        400: '#3399FF',
        500: '#007FFF',
        600: '#0072E5',
        900: '#003A75',
      };
    
      const grey = {
        50: '#f6f8fa',
        100: '#eaeef2',
        200: '#d0d7de',
        300: '#afb8c1',
        400: '#8c959f',
        500: '#6e7781',
        600: '#57606a',
        700: '#424a53',
        800: '#32383f',
        900: '#24292f',
      };
    return (<>
                <>
                    <Close onClick={()=>{setProfileView(false)}}
                     sx={{cursor:"pointer", color:"black",position:"absolute",top:"20px",right:"20px"}}/>
                    <Image className={styles.profile} alt='' src={profile}/>
                    <div>
                      <div className={styles.name}>{user?.name}</div>
                      <div className='text-black font-thin text-center'>@{user?.username}</div>
                    </div>
                    <div className={styles.phone}>
                          <div className={styles.profile_item_heading}>Email</div> <div className={styles.profile_item}> {user?.email}</div> <div><Edit sx={{marginRight:"10px",fontSize:"19px",color:"black"}}/></div>
                    </div>
                    <div className={styles.status}>
                    <div className={styles.profile_item_heading}>Status</div> <div className={styles.profile_item}> Hey I&apos;m on Zenith</div> <div><Edit sx={{marginRight:"10px",fontSize:"19px",color:"black"}}/></div>
                    </div>
                    <div>
                      <button onClick={handleLogout} className={styles.logout_button}>Logout</button>
                    </div>
                </>
    </>)
}

export default Profile;
