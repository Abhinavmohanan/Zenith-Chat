import logo from '../../assets/images/logo.png'
import Image from 'next/image';
const HomePage = () => {
    return (<>
        <main className={`xl:h-screen flex flex-col  px-32 py-16 justify-center items-center max-lg:flex-col max-lg:px-0 max-sm:px-0`}>
            <div className="logo"><Image src={logo} alt="" /></div>
            <div className='flex flex-wrap flex-col items-center justify-between w-full h-full translate-y-10 bg-gray-100 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-30 border border-blue-200 max-lg:w-5/6 max-sm:w-11/12
            '>

            </div>
        </main>
    </>)
}

export default HomePage;