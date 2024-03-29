import Profile from '@/components/profile';
import { AuthContext } from '@/context/AuthContext';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useRefresh from '@/hooks/useRefresh';
import useSocket from '@/hooks/useSocket';
import { RoomType, messageType, searchUserType } from '@/types/userType';
import { Transition } from '@headlessui/react';
import { Close, EmojiEmotions, Search, Send } from '@mui/icons-material';
import { CircularProgress, FormControl, InputAdornment } from '@mui/material';
import Input from '@mui/material/Input';
import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import profile from '../../assets/images/profile.jpg';
import styles from './homepage.module.scss';

import { sendErrorToast } from '@/utils/toast';
import 'react-toastify/dist/ReactToastify.css';
function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
}

import { EmojiClickData } from 'emoji-picker-react';
import dynamic from 'next/dynamic';

const EmojiPicker = dynamic(
  () => {
    return import('emoji-picker-react');
  },
  { ssr: false }
);

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
    const [emojis,setEmoji] = useState(false) 
    
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
                const rooms = response.data as RoomType[]
                rooms.sort((a,b)=>{
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                })
                console.log("ROOMS ARE:")
                console.log(rooms)
                setRooms(rooms)
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
        if(socket){
            socket.on('addRoom',(room:RoomType)=>{
                console.log("New Room added")
                console.log(room)
                setRooms([room,...rooms])
                joinRoom([room.id])
            })
            
            socket.on('recieveMessage',(message: messageType)=>{  //Non reactive values used inside
                console.log("Rooms" )
                console.log(rooms)
                console.log("Recieved Message : " + message.message)
                const foundRoom = rooms.find((room:RoomType)=>room._id === message.roomid)
                if(foundRoom){
                    const index = rooms.indexOf(foundRoom)
                    rooms.splice(index,1)
                    foundRoom.messages.push(message)
                    setRooms([foundRoom,...rooms])
                }
                console.log("Selected room " )
                console.log( selectedRoom) 
                console.log("Found room " )
                console.log( foundRoom)
                if(foundRoom && selectedRoom && foundRoom?._id == selectedRoom?._id){
                    addMessage(message)
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
                    return
                }
                const foundRoom = response as RoomType;
                setRooms([...rooms,foundRoom])
                setSelectedRoom(foundRoom)
                setCloseMobile(true);
                setRoomMessages(foundRoom.messages)
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
        //Reset height
        messageRef.current!.style.height = '30px';
        if(messageRef.current?.value?.trim().length === 0) {
            sendErrorToast("Message cannot be empty")
            //clear
            messageRef.current!.value = '';
            return;
        }

        if(socket){
            if(socket.disconnected) socket.connect();
            console.log("Connecting" + socket.connected)
            let message:messageType = {} as messageType;
            message.message = messageRef.current?.value as String;
            messageRef.current!.value = '';
            setEmoji(false);
            message.date = new Date();
            message.sender = user?.username;
            message.receiver = selectedRoom?.to.username;
            console.log("Sending Message : " + message.message)
            selectedRoom?.messages.push(message)
            addMessage(message)
            rooms.splice(rooms.indexOf(selectedRoom!),1)
            setRooms([selectedRoom!,...rooms])
            socket.emit('sendMessage', selectedRoom?.id, message);
        }
    }

    const addMessage = (message: messageType)=>{
        if(selectedRoom?.messages){
            setRoomMessages([...selectedRoom.messages])
        }
    }

    const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
        
        const cursor = messageRef.current?.selectionStart;
        const text = messageRef.current?.value.slice(0, cursor) + emojiData.emoji + messageRef.current?.value.slice(cursor);
        if(messageRef.current?.focus){
            messageRef.current.value = text;
            messageRef.current.setSelectionRange(cursor! + emojiData.emoji.length, cursor! + emojiData.emoji.length);
        }
        
    };
    

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
        <main className={`h-screen flex flex-col justify-center items-center max-lg:flex-col max-lg:px-0 max-sm:px-0 max-xl:px-0 max-sm:py-0  max-xl:py-5`}>
            {/* <div className="logo"><Image src={logo} alt="" /></div> */}
            {!isConnected?<div className='flex gap-5 text-lg text-cyan-800'>Trying to reconnect <CircularProgress/></div>:
            <div className={' flex items-center justify-around w-full h-full bg-gray-100 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-30 border border-blue-200 max-lg:w-5/6 max-sm:rounded-none max-sm:w-screen max-sm:h-screen'}>
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
                    <div style={closeMobile?{}:{display:"inherit"} } className={styles.section__1}>
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
                                            if(window.innerWidth < 1024){
                                                setCloseMobile(true);
                                            }
                                            setRoomMessages(room.messages)
                                            }} className={(selectedRoom?._id == room._id)? styles.chat_profile_selected : styles.chat_profile}>
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
                            <div style={{position:"relative"}}>
                                <EmojiEmotions onClick={()=>{
                                    setEmoji(!emojis)
                                }} sx={{ color: "rgba(44, 153, 221, 0.6)", cursor: "pointer" }} />
                                <div className={styles.emoji}>
                                    {emojis? <EmojiPicker previewConfig={{showPreview:false}}  onEmojiClick={(emoji: EmojiClickData, event: MouseEvent)=>{
                                        onEmojiClick(emoji, event)}} />: <></>}
                                </div>
                            </div>
                            <textarea
                            style={{height:"30px"}}
                            onChange={(e)=>{
                                    //Get no. of line breaks
                                    const lineBreaks = (e.target.value.match(/\n/g) || []).length;
                                    //Set height of textarea
                                    if(lineBreaks < 3){
                                        messageRef.current!.style.height = `${lineBreaks * 20 + 30}px`
                                    }
                                    if(messageRef.current?.value?.trim().length === 0){
                                        messageRef.current!.style.height = `30px`
                                        messageRef.current.value=''
                                    }
                                  
                            }}      
                            onKeyDown={(e)=>{
                                if(e.key === "Enter" && !e.ctrlKey){
                                    sendMessage()
                                }
                                if(e.key === "Enter" && e.ctrlKey){
                                    if(messageRef.current){
                                        const end = messageRef.current.selectionEnd
                                        messageRef.current.value += "\n"
                                    }
                                }
                                
                            }}
                                className={styles.styled_textarea}
                                rows={3}
                                placeholder="Type a message"
                                ref = {messageRef}
                            />
                            <Send onClick={()=>{
                                sendMessage()
                                //Clear height

                            }} sx={{ color: "rgba(44, 153, 221, 0.5)", cursor: "pointer" }} />
                        </div>
                    </div>
                    </>:<div className='text-black'>
                            Zenith Chat - A Chat App for Gen Z
                    </div>}
                </div>
            </div>}
        </main>
    </>)
}

export default HomePage;