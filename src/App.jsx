
import { Route, Routes,useLocation  } from 'react-router-dom'
import './App.css'

import Navbar from './Components/Navbar/Navbar'
import Home from './Pages/Home'
import SignUpPage from './Pages/Sign/SignUpPage'
import Category from './Components/Category/Category'
import AllProducts from './Components/All/AllProducts'
import Product from './Components/Product/Product'
import { useEffect, useState } from 'react'
import { LogIn } from 'lucide-react'



function App() {
const [user,setUser] = useState(null)

useEffect(()=>{
  const savedUser = localStorage.getItem("activeUser")
  if(savedUser){
    setUser(JSON.parse(savedUser))
  }
},[])

   const location = useLocation(); 
  
  return (
    <>
     {location.pathname !== '/signup' && <Navbar />}
      
      <Routes>
          <Route path="/" exact element={user ? <Home /> : <LogIn/>} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/category/:name" element={<Category />} />
          <Route path="/products" element={<AllProducts />} /> 
          
          <Route path="/product/:id" element={<Product />} />
          {/* more routes */}
      </Routes>
    </>
  )
}

export default App
