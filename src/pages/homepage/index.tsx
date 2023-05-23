import logo from '../../assets/images/logo.png'
import Image from 'next/image';
import profile from '../../assets/images/profile.jpg'
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import styles from './homepage.module.scss'
import { FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import {  Close, EmojiEmotions, Search, Send } from '@mui/icons-material';
import Input from '@mui/material/Input';
import { useContext, useEffect, useRef, useState } from 'react';
import { Transition } from '@headlessui/react'
import Profile from '@/components/profile';
import { AuthContext } from '@/context/AuthContext';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { RoomType, messageType, searchUserType } from '@/types/userType';
import useSocket from '@/hooks/useSocket';
import useRefresh from '@/hooks/useRefresh';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendErrorToast} from '@/utils/toast'
function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
}

const HomePage = () => {

    const axiosJWT = useAxiosPrivate();
    const { user } = useContext(AuthContext);
    const [rooms,setRooms] = useState<RoomType[]>([])
    const [profileView, setProfileView] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [focusSearch, setFocusSearch] = useState(false);
    const [searching, setSearching] = useState(false);
    const refresh = useRefresh();
    const [searchUsers, setSearchUsers] = useState<searchUserType[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
    const [isConnected,setConnected]    = useState(false)
    const [roomMessages,setRoomMessages] = useState<messageType[]>(selectedRoom?.messages ?? [])
    const messageRef = useRef<HTMLTextAreaElement>(null)
    //Message ref map
    const socket = useSocket()

    const [closeMobile, setCloseMobile] = useState(false);


    let debounceSearch: any;
    let debounceSet:any;

    useEffect(()=>{
        console.log(selectedRoom)   
        const chatScroll = document.getElementById('chat-scroll')
        if(chatScroll){
            chatScroll.scrollTop   = chatScroll.scrollHeight
        }
    },[roomMessages,selectedRoom])

    useEffect(()=>{
        if(socket){
            socket.on('connect',()=>{
                if(rooms.length > 0){
                    const room = rooms.map((room : RoomType)=>{
                        return room.id
                    })
                    joinRoom(room)
                }
                setConnected(true);
                console.log("Connected to socket" + socket?.id + "\nAuth:" );
                console.log(socket.auth)
            })
    
            socket.on('disconnect',()=>{
                console.log("Disconnected socket " + socket?.id);
                if(socket.disconnected) setConnected(false);
            })

            socket.on("connect_error", async(err: any) => {
                console.log(err,err.message);
                if(err.data?.refresh){
                console.log("Refresh required from socket")
                const accessToken = await refresh();
                if(accessToken){
                    socket.auth= {accessToken: accessToken};
                    socket.open();
                    setConnected(true)
                }
                }
            });
        }


        const getRooms = async()=>{
            try{
                const response = await axiosJWT.get('/getRooms')
                console.log(response.data)
                setRooms(response.data)
                const room = response.data.map((room : RoomType)=>{
                    return room.id
                })
                joinRoom(room)
            }catch(err){
                console.log("Error fetching Rooms" + err)
            }
        }

        if(socket && rooms.length === 0){
            getRooms()
        }

        return ()=>{
            socket?.off('connect')
            socket?.off('disconnect')
            socket?.off('connect_error')
        }

    },[socket])

    
    useEffect(()=>{
        if(socket && rooms.length > 0){
            socket.on('recieveMessage',(message: messageType)=>{  //Non reactive values used inside
                console.log("Rooms" )
                console.log( rooms)
                console.log("Recieved Message : " + message.message)
                const foundRoom = rooms.find((room:RoomType)=>room._id === message.roomid)
                console.log("Selected room " )
                console.log( selectedRoom) 
                console.log("Found room " )
                console.log( foundRoom)
                if(foundRoom && selectedRoom && foundRoom?._id == selectedRoom?._id){
                    addMessage(message)
                }
                else{
                    foundRoom?.messages.push(message)
                }
        })
        }

        return ()=>{
            socket?.off('recieveMessage')
        }

    },[socket,rooms,selectedRoom])


    


    useEffect(() => {
        if(searchTerm.length === 0) return;
        if (debounceSearch) {
            clearTimeout(debounceSearch)
        }
        if (debounceSet) {
            clearTimeout(debounceSet)
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
        if(socket){
            if(socket.disconnected) socket.connect();
            console.log("Connecting" + socket.connected)
            console.log("Adding Room")
            setSearchTerm('');
            socket.emit('addRoom',to,(response : RoomType,exists: boolean | undefined)=>{
                console.log(response)
                if(exists){
                    const foundRoom = rooms.find((room:RoomType)=>room._id === response._id)
                    if(foundRoom){
                        setSelectedRoom(foundRoom)
                        setCloseMobile(true);
                        setRoomMessages(foundRoom.messages)
                    }
                }
                //Check if already added is done from backend
                setRooms([...rooms,response])
            })
        }
    }

    const joinRoom = (room: String[])=>{
        if(socket){
            if(socket.disconnected) socket.connect();
            console.log("Connecting" + socket.connected)
            console.log("Joining Rooms")
            socket.emit('joinRoom',room)
        }
    }

    const sendMessage = ()=>{
        if(messageRef.current?.value == '') {
            sendErrorToast("Message cannot be empty")
            return;
        }
        if(socket){
            if(socket.disconnected) socket.connect();
            console.log("Connecting" + socket.connected)
            let message:messageType = {} as messageType;
            message.message = messageRef.current?.value as String;
            messageRef.current!.value = '';
            message.date = new Date();
            message.sender = user?.username;
            message.receiver = selectedRoom?.to.username;
            console.log("Sending Message : " + message.message)
            addMessage(message)
            socket.emit('sendMessage', selectedRoom?.id, message);
        }
    }

    const addMessage = (message: messageType)=>{
        selectedRoom?.messages.push(message)
        if(selectedRoom?.messages){
            setRoomMessages([...selectedRoom.messages])
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
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            />
        <main className={`xl:h-screen flex flex-col  px-32 py-16 justify-center items-center max-lg:flex-col max-lg:px-0 max-sm:px-0 max-xl:px-0 max-xl:py-5`}>
            {/* <div className="logo"><Image src={logo} alt="" /></div> */}
            {!isConnected?<>Connection Error Trying to Reconnect....</>:<div className={'overflow-hidden flex items-center justify-around w-11/12 h-full bg-gray-100 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-30 border border-blue-200 max-lg:w-5/6 max-sm:w-11/12'}>
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
                            <div className={styles.profile__search}>
                                <FormControl sx={{ border: "none", outline: "none",width:"100%" }}>
                                    <Input
                                        onFocus={() => setFocusSearch(true)}
                                        onBlur={() => setFocusSearch(false)}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value)
                                        }}
                                        value={searchTerm}
                                        inputRef={searchRef}
                                        disableUnderline
                                        sx={{ padding: "10px", width: "100%", height: "44px", background: "rgba(255, 255, 255, 0.45);", border: "1px solid rgba(255, 255, 255, 0.46)", outline: "none", borderRadius: "10px", backdropFilter: "blur(7.4px)" }}
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
                                {rooms.length == 0 ? 
                                    <div className={styles.chat_empty}>
                                        Search to start a chat 
                                    </div>
                                :rooms.map((room)=>{
                                    return (
                                        <div onClick={()=>{
                                            setSelectedRoom(room)
                                            setCloseMobile(true);
                                            setRoomMessages(room.messages)
                                            }} className={styles.chat_profile}>
                                            <Image className={styles.profile} alt='' src={profile} />
                                            <div className={styles.chat__desc}>
                                                <div className={styles.chat__heading}>{room.to.name}</div>
                                                <div className={styles.chat__msg}>@{room.to.username}</div>
                                            </div>
                                        </div>
                                    )
                                })
                                }
                            </div>
                        </div>
                    </div>}
                <div style={closeMobile?{display:"inherit"}:{} } className={styles.section__2}>

                   {selectedRoom? <>
                    <div className={styles.chat_header}>
                        <div className={styles.chat_header_heading}>
                            <Image className={styles.profile_chat} alt='' src={profile} />
                            {selectedRoom.name?? selectedRoom.to.name}
                        </div>
                        <div  className={styles.close_chat}>
                            <Close onClick={()=>{setCloseMobile(false)}}/>
                        </div>
                    </div>
                    <div className={styles.chat_body}>
                        <div id='chat-scroll' className={styles.chat_messages}>
                            {roomMessages && roomMessages.length !== 0  ? 
                            <>
                            {roomMessages.map((message)=>{
                                return (<div style={message.sender === user?.username ? {alignSelf:"flex-end"}:{alignSelf:"flex-start"}} className={styles.chat_message}>{message.message}</div>)
                            })}
                            </>
                            :<>
                                <div className={styles.chat_message_blank}>No Messages</div>
                            </> 
                            }
                        </div>
                        <div className={styles.chat_send}>
                            <EmojiEmotions sx={{ color: "rgba(44, 153, 221, 0.6)", cursor: "pointer" }} />
                            <StyledTextarea
                                className={styles.styled_textarea}
                                maxRows={3}
                                placeholder="Type a message"
                                ref = {messageRef}
                            />
                            <Send onClick={()=>{
                                sendMessage()
                            }} sx={{ color: "rgba(44, 153, 221, 0.5)", cursor: "pointer" }} />
                        </div>
                    </div>
                    </>:<div className='text-black'>
                            Zenith Chat - A Chat App for Zenith Students
                    </div>}
                </div>
            </div>}
        </main>
    </>)
}

export default HomePage;