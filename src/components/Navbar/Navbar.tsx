import Image from 'next/image'
import logo from '../../assets/images/logo.png'

function Navbar(){
    return (
    <>
        <main>
        <div className="w-1/5 ml-14 fixed pt-8"><Image src={logo} alt=''/></div>
        </main>
    </>)
}

export default Navbar