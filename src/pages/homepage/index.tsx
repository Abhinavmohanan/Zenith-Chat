import logo from '../../assets/images/logo.png'
import Image from 'next/image';
import profile from '../../assets/images/profile.jpg'
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import styles from './homepage.module.scss'
import { FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import { AccountCircle, Close, EmojiEmotions, Search, Send } from '@mui/icons-material';
import Input from '@mui/material/Input';
import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Transition } from '@headlessui/react'
import Profile from '@/components/profile';
import { AuthContext } from '@/context/AuthContext';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { searchUserType } from '@/types/userType';
import useSocket from '@/hooks/useSocket';
function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
}

const HomePage = () => {

    const axiosJWT = useAxiosPrivate();
    const { user } = useContext(AuthContext);
    const router = useRouter()
    const [profileView, setProfileView] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [focusSearch, setFocusSearch] = useState(false);
    const [searching, setSearching] = useState(false);
    const [searchUsers, setSearchUsers] = useState<searchUserType[]>([]);
    const socket = useSocket();
    let debounceSearch: any;
    let debounceSet:any;

    useEffect(() => {
        
    },[])

    useEffect(() => {
        if(searchTerm.length === 0) return;
        if (debounceSearch) {
            clearTimeout(debounceSearch)
        }
        if (debounceSet) {
            clearTimeout(debounceSearch)
        }
        debounceSet= setTimeout(async() => {
            setSearching(true)
            setSearchUsers([]);
        }, 100)
        debounceSearch = setTimeout(async() => {
            getUsers()
        }, 1000)

        return () => {
            clearTimeout(debounceSearch)
        }
    }, [searchTerm])

    const getUsers = async () => {
        try{
            const response = await axiosJWT.get(`/searchUsers/${searchTerm}`);
            setSearching(false)
            if(response.data){
                setSearchUsers(response.data)
                console.log("NEW USERS")
                console.log(searchUsers)
            }
        }
        catch(err){
            console.log(err)
        }
    }

    const addRoom = (to: searchUserType)=>{
        console.log("Adding Room")
        setSearchTerm('');
        socket?.emit('joinRoom',to,(response : String)=>{
            console.log(response)
        })
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
    const searchRef = useRef<null | HTMLInputElement>(null);
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
        <main className={`xl:h-screen flex flex-col  px-32 py-16 justify-center items-center max-lg:flex-col max-lg:px-0 max-sm:px-0`}>
            {/* <div className="logo"><Image src={logo} alt="" /></div> */}
            <div className={'overflow-hidden flex items-center justify-around w-11/12 h-full bg-gray-100 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-30 border border-blue-200 max-lg:w-5/6 max-sm:w-11/12'}>
                {profileView ? <Transition  /*Need to fix transition*/
                    className={styles.section__1__profile}
                    enter="transition-opacity duration-75"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0" show={profileView}>
                    <Profile setProfileView={setProfileView} />
                </Transition> :
                    <div className={styles.section__1}>
                        <div className={styles.profile_bar}>
                            <Image className={styles.profile} alt='' onClick={async () => {
                                setProfileView(!profileView)
                            }} src={profile} />
                            <div>
                                <FormControl sx={{ border: "none", outline: "none" }}>
                                    <Input
                                        onFocus={() => setFocusSearch(true)}
                                        onBlur={() => setFocusSearch(false)}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value)
                                        }}
                                        value={searchTerm}
                                        inputRef={searchRef}
                                        disableUnderline
                                        sx={{ padding: "10px", width: "220px", height: "44px", background: "rgba(255, 255, 255, 0.45);", border: "1px solid rgba(255, 255, 255, 0.46)", outline: "none", borderRadius: "10px", backdropFilter: "blur(7.4px)" }}
                                        id="input-with-icon-adornment"
                                        endAdornment={
                                            <InputAdornment className='hover:cursor-pointer' position="end">
                                                {searchTerm.length!=0 ? <Close
                                                onClick={() => {
                                                    setSearchTerm('')
                                                }}
                                                sx={{
                                                    width: "15px",
                                                    height: "15px",
                                                    marginRight: "10px",
                                                }}/>: <></>}
                                                <Search onClick={() => { searchRef.current?.focus() }} />
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </div>
                            {focusSearch || searchTerm.length != 0 ?
                                <div className={styles.search_list}>
                                    {searchTerm ?
                                    <>
                                         {searchUsers.length !== 0? <>
                                               {
                                                searchUsers.map((user) => {
                                                    // eslint-disable-next-line react/jsx-key
                                                    if(user)return (
                                                    <div onClick={()=>{
                                                        addRoom(user)}} className={styles.search_list_item}>
                                                        <Image className={styles.profile} alt='' src={profile} />
                                                        <div className={styles.chat__desc}>
                                                            <div className={styles.chat__heading}>{user.name}</div>
                                                            <div className={styles.chat__msg}>{user.username}</div>
                                                        </div>
                                                    </div>);
                                               })
                                                }
                                            </>
                                            : <div className={styles.search_list_empty}>{searching? "Searching...": "No Users found"}</div>
                                        }
                                    </>
                                        :
                                        <div className={styles.search_list_empty}>Search to start conversation</div>}
                                </div>:<></> }
                        </div>
                        <div className={styles.chat_profiles_container}>
                            <div className={styles.chat_profiles}>
                                <div onClick={()=>{
                                                        console.log("Clicked")
                                                        }} className={styles.chat_profile}>
                                    <Image className={styles.profile} alt='' src={profile} />
                                    <div className={styles.chat__desc}>
                                        <div className={styles.chat__heading}>{user?.username}</div>
                                        <div className={styles.chat__msg}>Latest Message</div>
                                    </div>
                                </div>
                            
                            </div>
                        </div>
                    </div>}
                <div className={styles.section__2}>
                    <div className={styles.chat_header}>
                        <Image className={styles.profile_chat} alt='' src={profile} />
                        Name
                    </div>
                    <div className={styles.chat_body}>
                        <div className={styles.chat_messages}>
                            <div className={styles.chat_message}>Lorem ipsum dolor sit amet consectetur</div>
                            <div className={styles.chat_message}>Lorem ipsum dolor  <br></br>sit amet consectetur</div>
                            <div className={styles.chat_message}>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur</div>
                            <div className={styles.chat_message}>Lorem ipsum dolor sit amet consectetur</div>
                            <div className={styles.chat_message}>Lorem ipsum dolor  <br></br>sit amet consectetur</div>
                            <div className={styles.chat_message}>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur</div>
                            <div className={styles.chat_message}>Lorem ipsum dolor sit amet consectetur</div>
                            <div className={styles.chat_message}>Lorem ipsum dolor  <br></br>sit amet consectetur</div>
                            <div className={styles.chat_message}>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur</div>
                            <div className={styles.chat_message}>Lorem ipsum dolor sit amet consectetur</div>
                            <div className={styles.chat_message}>Lorem ipsum dolor  <br></br>sit amet consectetur</div>
                            <div className={styles.chat_message}>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur</div>
                            <div className={styles.chat_message}>Lorem ipsum dolor sit amet consectetur</div>
                            <div className={styles.chat_message}>Lorem ipsum dolor  <br></br>sit amet consectetur</div>
                            <div className={styles.chat_message}>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur</div>

                        </div>
                        <div className={styles.chat_send}>
                            <EmojiEmotions sx={{ color: "rgba(44, 153, 221, 0.6)", cursor: "pointer" }} />
                            <StyledTextarea
                                className={styles.styled_textarea}
                                maxRows={3}
                                placeholder="Type a message"
                            />
                            <Send sx={{ color: "rgba(44, 153, 221, 0.5)", cursor: "pointer" }} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </>)
}

export default HomePage;