
import { Route, Routes,useLocation  } from 'react-router-dom'
import './App.css'

import Navbar from './Components/Navbar/Navbar'
import Home from './Pages/Home'
import SignUpPage from './Pages/Sign/SignUpPage'



function App() {
   const location = useLocation(); 
  
  return (
    <>
     {location.pathname !== '/signup' && <Navbar />}
      
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* more routes */}
      </Routes>
    </>
  )
}

export default App
