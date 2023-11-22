import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"
import axios from "axios"
import Swal from 'sweetalert2'

export const Register = () => {
    const navigate = useNavigate();
    const handleLogin = () => {
        navigate('/login')
    }
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    });


    const handleInputChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCreateUser = async () => {
        try {
            await axios.post('http://localhost:3000/register', userData)
            navigate(`/login`)
        } catch (error) {
            let errorMessage
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            }
            Swal.fire({
                icon: 'error',
                title: 'Register Fail',
                text: errorMessage,
            });
        }
    }

    return (
        <div className="h-screen bg-indigo-100 flex justify-center items-center">
            <div className="lg:w-2/5 md:w-1/2 w-2/3">
                <form className="bg-white p-10 rounded-lg shadow-lg min-w-full">
                    <h1 className="text-center text-2xl mb-6 text-gray-600 font-bold font-sans">Register to Create Account</h1>
                    <div>
                        <label className="text-gray-800 font-semibold block my-3 text-md" htmlFor="name">Name</label>
                        <input className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none" type="text" name="name" id="name" placeholder="name" value={userData.name} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className="text-gray-800 font-semibold block my-3 text-md" htmlFor="email">Email</label>
                        <input className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none" type="text" name="email" id="email" placeholder="email" value={userData.email} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className="text-gray-800 font-semibold block my-3 text-md" htmlFor="password">Password</label>
                        <input className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none" type="password" name="password" id="password" placeholder="password" value={userData.password} onChange={handleInputChange} />
                    </div>

                    <button type="submit" className="w-full mt-6 bg-indigo-600 rounded-lg px-4 py-2 text-lg text-white tracking-wide font-semibold font-sans" onClick={handleCreateUser}>Register</button>
                    <button type="submit" className="w-full mt-6 mb-3 bg-indigo-100 rounded-lg px-4 py-2 text-lg text-gray-800 tracking-wide font-semibold font-sans" onClick={handleLogin}>Login</button>

                </form>
            </div>
        </div>
    )
}