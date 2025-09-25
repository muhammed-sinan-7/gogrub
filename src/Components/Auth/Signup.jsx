import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../Context/UserContext'; // Correct import

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [errors, setErrors] = useState({});
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const  [orders,setOrders] = useState([])
    const { dispatch } = useUser();
    const navigate = useNavigate();

    const validate = () => {
        const newError = {};
        if (!name.trim()) newError.fnameerror = 'Enter Your Name';
        if (!email.includes('@')) newError.emailerror = 'Enter A Valid Email Address!';
        if (!password.trim()) newError.passworderror = 'Create A Password!';
        else if (password.length < 6) newError.passworderror = 'Password Must Should be 6 Characters';
        if (!cpassword.trim()) newError.cpassworderror = 'Please Confirm Password';
        else if (cpassword !== password) newError.cpassworderror = "Password Doesn't Matching";
        return newError;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const userData = { name, email, password, cpassword, cart, wishlist ,isBlock:false,isAdmin:false, orders , };

        try {
            const res = await axios.post("http://localhost:3005/users", userData, {
                headers: { "Content-Type": "application/json" },
            });

            console.log("Data Saved", res.data);


            dispatch({ type: "SET_USER", payload: res.data });


            localStorage.setItem("activeUser", JSON.stringify(res.data));


            navigate('/');
        } catch (error) {
            console.log("Error", error);
        }
    };

    return (
        <div className="bg-orange-500 flex flex-col items-center text-white px-6 w-full">
            <div className="mb-6 mt-5 flex">
                <h2 className="text-3xl relative font-bold">Create Account</h2>
            </div>

            <div className='flex flex-col w-full space-y-10'>
                <div className="flex flex-col">
                    {errors.fnameerror && <p className="text-red-200 text-sm mb-1">{errors.fnameerror}</p>}
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="First Name"
                        className="p-3 border rounded text-black w-full bg-white"
                    />
                </div>

                <div className="flex flex-col">
                    {errors.emailerror && <p className="text-red-200 text-sm mb-1">{errors.emailerror}</p>}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="p-3 border rounded text-black w-full bg-white"
                    />
                </div>

                <div className="flex flex-col">
                    {errors.passworderror && <p className="text-red-200 text-sm mb-1">{errors.passworderror}</p>}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="p-3 border rounded text-black w-full bg-white"
                    />
                </div>

                <div className="flex flex-col">
                    {errors.cpassworderror && <p className="text-red-200 text-sm mb-1">{errors.cpassworderror}</p>}
                    <input
                        type="password"
                        value={cpassword}
                        onChange={(e) => setCpassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="p-3 border rounded text-black w-full bg-white"
                    />
                </div>

                <div className="flex justify-center pb-10">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-white text-orange-500 font-semibold py-3 rounded hover:bg-gray-100 transition-colors duration-200 w-full"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Signup;
