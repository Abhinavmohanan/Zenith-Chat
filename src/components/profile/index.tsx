import logo from '../../assets/images/logo.png'
import Image from 'next/image';
import profile from '../../assets/images/profile.jpg'
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import styles from './profile.module.css'
import { FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import { AccountCircle, Close, Edit, EmojiEmotions, Search, Send } from '@mui/icons-material';
import Input from '@mui/material/Input';
import { Dispatch, SetStateAction, useContext, useRef } from 'react';
import { AuthContext } from '@/context/AuthContext';

type propsType = {
  setProfileView: Dispatch<SetStateAction<boolean>>
}

const Profile = ({setProfileView }: propsType) => {

    const {user} = useContext(AuthContext);
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
    const searchRef = useRef<null| HTMLInputElement>(null);
    const StyledTextarea = styled(TextareaAutosize)(
        ({ theme }) => `
        flex:1;
        margin: 0 1rem;
        resize: none;
        box-sizing: border-box;
        width:50%;
        font-size:14px;
        padding:5px 10px 5px 10px;
        color:black;
        height:10px;
        background: rgba(255, 255, 255, 0.45);
        border: 1px solid rgba(255, 255, 255, 0.46);
        backdrop-filter: blur(7.4px);
        /* Note: backdrop-filter has minimal browser support */
        
        border-radius: 10px;
        &:hover {
            border:none
        }
      
        &:focus {
          border:none;
          box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[500] : blue[200]};
        }
      
        // firefox
        &:focus-visible {
          outline: 0;
        }
      `,
      );
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
                            <div className={styles.profile_item_heading}>Status</div> <div className={styles.profile_item}>  Hey I'm on Zenith , I'm the Fastest Man Alive , I'm the Flash <Edit sx={{marginRight:"10px",fontSize:"19px",color:"black"}}/></div> 
                    </div>
                </>
    </>)
}

export default Profile;