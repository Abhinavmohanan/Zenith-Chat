import logo from '../../assets/images/logo.png'
import Image from 'next/image';
import profile from '../../assets/images/profile.jpg'

import styles from './homepage.module.css'
import { FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import { AccountCircle, Search } from '@mui/icons-material';
import Input from '@mui/material/Input';
import { useRef } from 'react';

const HomePage = () => {
    const searchRef = useRef<null| HTMLInputElement>(null);

    return (<>
        <main className={`xl:h-screen flex flex-col  px-32 py-16 justify-center items-center max-lg:flex-col max-lg:px-0 max-sm:px-0`}>
            {/* <div className="logo"><Image src={logo} alt="" /></div> */}
            <div className='flex items-center justify-around w-10/12 h-full bg-gray-100 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-30 border border-blue-200 max-lg:w-5/6 max-sm:w-11/12
            '>
                <div className={styles.section__1}>
                    <div className={styles.profile_bar}>
                        <Image className={styles.profile} alt='' src={profile}/>
                        <div>
                        <FormControl sx={{border:"none",outline:"none"}}>
                            <Input
                            inputRef={searchRef}
                            disableUnderline
                            sx={{padding:"10px"  ,  width:"220px",height:"44px",background:"rgba(255, 255, 255, 0.45);",border:"1px solid rgba(255, 255, 255, 0.46)",outline:"none",borderRadius:"10px",backdropFilter:"blur(7.4px)"}}
                                id="input-with-icon-adornment"
                                endAdornment={
                                    <InputAdornment className='hover:cursor-pointer' onClick={()=>{searchRef.current?.focus()}}  position="end">
                                    <Search />
                                    </InputAdornment>
                                } 
                                />
                        </FormControl>
                        </div>
                    </div>
                    <div className={styles.chat_profiles_container}>
                        <div className={styles.chat_profiles}>
                                    <div className={styles.chat_profile}>
                                        <Image className={styles.profile} alt='' src={profile}/>
                                        <div className={styles.chat__desc}>
                                            <div className={styles.chat__heading}>Name</div>
                                            <div className={styles.chat__msg}>Latest Message</div>
                                        </div>
                                    </div>
                                    <div className={styles.chat_profile}>
                                        <Image className={styles.profile} alt='' src={profile}/>
                                        <div className={styles.chat__desc}>
                                            <div className={styles.chat__heading}>Name</div>
                                            <div className={styles.chat__msg}>Latest Message</div>
                                        </div>
                                    </div>
                                    <div className={styles.chat_profile}>
                                        <Image className={styles.profile} alt='' src={profile}/>
                                        <div className={styles.chat__desc}>
                                            <div className={styles.chat__heading}>Name</div>
                                            <div className={styles.chat__msg}>Latest Message</div>
                                        </div>
                                    </div>
                                    <div className={styles.chat_profile}>
                                        <Image className={styles.profile} alt='' src={profile}/>
                                        <div className={styles.chat__desc}>
                                            <div className={styles.chat__heading}>Name</div>
                                            <div className={styles.chat__msg}>Latest Message</div>
                                        </div>
                                    </div>
                                    <div className={styles.chat_profile}>
                                        <Image className={styles.profile} alt='' src={profile}/>
                                        <div className={styles.chat__desc}>
                                            <div className={styles.chat__heading}>Name</div>
                                            <div className={styles.chat__msg}>Latest Message</div>
                                        </div>
                                    </div>
                                    <div className={styles.chat_profile}>
                                        <Image className={styles.profile} alt='' src={profile}/>
                                        <div className={styles.chat__desc}>
                                            <div className={styles.chat__heading}>Name</div>
                                            <div className={styles.chat__msg}>Latest Message</div>
                                        </div>
                                    </div>
                                    <div className={styles.chat_profile}>
                                        <Image className={styles.profile} alt='' src={profile}/>
                                        <div className={styles.chat__desc}>
                                            <div className={styles.chat__heading}>Name</div>
                                            <div className={styles.chat__msg}>Latest Message</div>
                                        </div>
                                    </div>
                                    <div className={styles.chat_profile}>
                                        <Image className={styles.profile} alt='' src={profile}/>
                                        <div className={styles.chat__desc}>
                                            <div className={styles.chat__heading}>Name</div>
                                            <div className={styles.chat__msg}>Latest Message</div>
                                        </div>
                                    </div>
                                    <div className={styles.chat_profile}>
                                        <Image className={styles.profile} alt='' src={profile}/>
                                        <div className={styles.chat__desc}>
                                            <div className={styles.chat__heading}>Name</div>
                                            <div className={styles.chat__msg}>Latest Message</div>
                                        </div>
                                    </div>
                                    <div className={styles.chat_profile}>
                                        <Image className={styles.profile} alt='' src={profile}/>
                                        <div className={styles.chat__desc}>
                                            <div className={styles.chat__heading}>Name</div>
                                            <div className={styles.chat__msg}>Latest Message</div>
                                        </div>
                                    </div>
                                    <div className={styles.chat_profile}>
                                        <Image className={styles.profile} alt='' src={profile}/>
                                        <div className={styles.chat__desc}>
                                            <div className={styles.chat__heading}>Name</div>
                                            <div className={styles.chat__msg}>Latest Message</div>
                                        </div>
                                    </div>
                                    <div className={styles.chat_profile}>
                                        <Image className={styles.profile} alt='' src={profile}/>
                                        <div className={styles.chat__desc}>
                                            <div className={styles.chat__heading}>Name</div>
                                            <div className={styles.chat__msg}>Latest Message</div>
                                        </div>
                                    </div>
                                    <div className={styles.chat_profile}>
                                        <Image className={styles.profile} alt='' src={profile}/>
                                        <div className={styles.chat__desc}>
                                            <div className={styles.chat__heading}>Name</div>
                                            <div className={styles.chat__msg}>Latest Message</div>
                                        </div>
                                    </div>
                                    <div className={styles.chat_profile}>
                                        <Image className={styles.profile} alt='' src={profile}/>
                                        <div className={styles.chat__desc}>
                                            <div className={styles.chat__heading}>Name</div>
                                            <div className={styles.chat__msg}>Latest Message</div>
                                        </div>
                                    </div>
                                    <div className={styles.chat_profile}>
                                        <Image className={styles.profile} alt='' src={profile}/>
                                        <div className={styles.chat__desc}>
                                            <div className={styles.chat__heading}>Name</div>
                                            <div className={styles.chat__msg}>Latest Message</div>
                                        </div>
                                    </div>
                                    <div className={styles.chat_profile}>
                                        <Image className={styles.profile} alt='' src={profile}/>
                                        <div className={styles.chat__desc}>
                                            <div className={styles.chat__heading}>Name</div>
                                            <div className={styles.chat__msg}>Latest Message</div>
                                        </div>
                                    </div>
                        
                        </div>
                    </div>
                </div>
                <div className={styles.section__2}>
                </div>
            </div>
        </main>
    </>)
}

export default HomePage;