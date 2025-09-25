import { useEffect, useState } from 'react'
import '../Sign/SignUp.css'
import Login from '../../Components/Auth/Login';
import Signup from '../../Components/Auth/Signup';
import { useSearchParams } from 'react-router-dom';
import '../Sign/Signuppage.css'

function SignUpPage() {
  const [searchParams] = useSearchParams();
  const [activeForm, setActiveForm] = useState('signup')

  useEffect(() => {
    const formparam = searchParams.get('form');
    if (formparam === 'login') {
      setActiveForm('login')
    } else {
      setActiveForm('signup')
    }
  }, [searchParams])

  const handleShowLogin = () => {
    setActiveForm('login')
  }

  const handleShowSignup = () => {
    setActiveForm('signup')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300 p-4 sig-body">
      {/* Desktop */}
      <div className="hidden lg:flex bg-white w-2/4 h-170 rounded-lg shadow-2xl overflow-hidden">
        {/* Left  */}
        <div className="flex-1 flex flex-col bg-grey-100 items-center justify-center text-white">
          <h2 className="text-5xl  text-black font-bold mb-8">Welcome To</h2>
          <div className="flex items-center flex-shrink-0">
            <span className="text-6xl font-bold">
              <span className="text-orange-500">G</span>
              <span className="text-black">o</span>
              <span className="text-orange-500">G</span>
              <span className="text-black">ru</span>
              <span className="text-black">b</span>
              <span className="text-black">.</span>
            </span>
          </div>
          <div className='flex gap-10 relative top-30'>
            <button className={`toggle-button bg-amber-600 text-whit text-xl px-4 py-2 rounded
            ${activeForm === 'signup'
                ? 'bg-amber-600 text-amber-6000'
                : 'bg-gray-200 text-amber-600'}`} onClick={handleShowSignup}>Sign Up</button>
            <button className={`toggle-button  bg-amber-600 text-xl px-5 rounded
          ${activeForm === 'login'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-amber-600'
              }`}
              onClick={handleShowLogin}>Log In</button>
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 flex flex-col bg-orange-500 items-center justify-center text-white p-8">
          {activeForm === 'login' ? <Login /> : <Signup />}
        </div>
      </div>

      {/* Tablet Layout (md to lg breakpoint) */}
      <div className="hidden md:flex lg:hidden bg-white w-full max-w-4xl rounded-lg shadow-2xl overflow-hidden flex-col">
        {/* Top section - Welcome */}
        <div className="flex-1 flex-col bg-gray-100 flex items-center justify-center text-black p-6">
          <h2 className="text-3xl font-bold mb-4">Welcome To</h2>
          <div className="flex items-center flex-shrink-0 mb-6">
            <span className="text-5xl font-bold">
              <span className="text-orange-500">G</span>
              <span className="text-black">o</span>
              <span className="text-orange-500">G</span>
              <span className="text-black">ru</span>
              <span className="text-black">b</span>
              <span className="text-black">.</span>
            </span>
          </div>
          
          {/* Toggle buttons for tablet */}
          <div className='flex gap-6'>
            <button className={`toggle-button text-lg px-4 py-2 rounded transition-colors
            ${activeForm === 'signup'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-amber-600'}`} onClick={handleShowSignup}>Sign Up</button>
            <button className={`toggle-button text-lg px-4 py-2 rounded transition-colors
          ${activeForm === 'login'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-amber-600'
              }`}
              onClick={handleShowLogin}>Log In</button>
          </div>
        </div>

        {/* Form section */}
        <div className="flex-1 flex flex-col bg-orange-500 items-center justify-center text-white p-8">
          {activeForm === 'login' ? <Login /> : <Signup />}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden flex-col bg-white w-full max-w-sm rounded-lg shadow-2xl overflow-hidden">
        {/* Top section - Welcome */}
        <div className="bg-gray-100 flex flex-col items-center justify-center text-black py-8">
          <h2 className="text-3xl font-bold mb-4">Welcome To</h2>
          <div className="flex items-center flex-shrink-0 mb-6">
            <span className="text-4xl font-bold">
              <span className="text-orange-500">G</span>
              <span className="text-black">o</span>
              <span className="text-orange-500">G</span>
              <span className="text-black">ru</span>
              <span className="text-black">b</span>
              <span className="text-black">.</span>
            </span>
          </div>

          {/* Toggle buttons for mobile */}
          <div className='flex gap-4'>
            <button className={`toggle-button text-sm px-3 py-2 rounded transition-colors
            ${activeForm === 'signup'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-amber-600'}`} onClick={handleShowSignup}>Sign Up</button>
            <button className={`toggle-button text-sm px-3 py-2 rounded transition-colors
          ${activeForm === 'login'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-amber-600'
              }`}
              onClick={handleShowLogin}>Log In</button>
          </div>
        </div>

        {/* Bottom section - Form */}
        <div className="flex flex-col items-center justify-center bg-orange-500">
          {activeForm === 'login' ? <Login /> : <Signup />}
        </div>
      </div>
    </div >
  );
}

export default SignUpPage