import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios'
import Swal from 'sweetalert2'

export const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: ``,
        password: ``
    })

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const [error, setError] = useState("")

    const handleLogin = async () => {
        try {
            const { data } = await axios.post(`http://localhost:3000/login`, form)
            localStorage.setItem(`access_token`, data.access_token)
            navigate(`/loby`)
        } catch (error) {
            let errorMessage
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            }
            Swal.fire({
                icon: 'error',
                title: 'Login Fail',
                text: errorMessage,
            });
        }
    }

    async function handleCredentialResponse(response) {
        try {
            let { data } = await axios.post(`http://localhost:3000/google-login`, null, {
                headers: {
                    g_token: response.credential
                }
            })
            localStorage.setItem(`access_token`, data.access_token)
            navigate(`/loby`)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: "199027147966-oeto1p8safjjv895uh1rfa5emrmnehok.apps.googleusercontent.com",
            callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
            { theme: "outline", size: "large" }
        );
    }, [])
    return (
        <section id="cms-login">
            <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
                <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                    </div>
                    <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                        <div className="max-w-md mx-auto">
                            <div>
                                <h1 className="text-2xl font-semibold">Welcome to Werewolf Game</h1>
                                <h4 className="text-1xl font-semibold">Please Login First!</h4>
                            </div>
                            <div className="divide-y divide-gray-200">
                                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                    <div className="relative">
                                        <input id="email" name="email" type="text" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" value={form.email} onChange={handleInputChange} />
                                        <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email Address</label>
                                    </div>
                                    <div className="relative">
                                        <input id="password" name="password" type="password" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" value={form.password} onChange={handleInputChange} />
                                        <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
                                    </div>
                                    <div className="relative">
                                        <button className="bg-blue-500 text-white rounded-md px-2 py-1" onClick={handleLogin}>Login</button>
                                        <br /><br />
                                        <div id="buttonDiv"></div>

                                        <p className="text-center text-muted mt-5 mb-0">Don't have an account? <Link to="/register"
                                            className="fw-bold text-body"><u>Register here</u></Link></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}