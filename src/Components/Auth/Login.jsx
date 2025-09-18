import React, { useState } from 'react'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors,setErrors] = useState({})
    const validate = () => {
    const newError = {}

    {/* name validation*/ }




    if (!email.includes('@')) {
      newError.emailerror = 'Enter A Valid Email Address!'
    }

    if (!password.trim()) {
      newError.passworderror = 'Create A Password!'
    } else if (password.length < 6) {
      newError.passworderror = 'Password Must Should be 6 Characters'
    }else if(password.length >6){
      newError.passworderror = ''
    }

   
    return newError;
  }

  const handleSubmit =async  (e) => {
    e.preventDefault();
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return ;
    } 
    const userData={
      
      email,
      password,
      
    }

    try{
      let res = await axios.post("http://localhost:3005/users",userData,{
        headers:{
          "Content-Type":"application/json",
        },
      });
        console.log("Data Saved", res.data);
    }catch(error){
      console.log("Error",error)
    }
    navigate('/ ')
  };

    return (
        <div className="flex-1 flex-col bg-orange-500 flex items-center pt-20 justify-evenly text-white">

            <div>
                <h2 className="relative bottom-6 register-head text-2xl">Login</h2>
            </div>

            <div className='reg-form relative bottom-18 flex flex-col mt-10'>
                
                <div className="flex flex-col mb-2">
                    <p className=" error text-white-500 text-sm min-h-5">{errors.emailerror || ''}</p>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="p-2 border rounded text-black"
                    />
                </div>

                <div className="flex flex-col mb-2">
                    <p className="error text-white-500 text-sm min-h-5">{errors.passworderror || ''}</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="p-2 border rounded text-black"
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="reg-button bg-white text-black h-13 w-40 cursor-pointer hover:bg-amber-200 rounded"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login
