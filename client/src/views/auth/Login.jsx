import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios'

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
            navigate(`/`)
        } catch (error) {
            if (error.response.data) {
                setError(error.response.data.message)
            } else {
                setError(`cari errornya bro, ganbate`)
            }
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
            navigate(`/`)
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
            <div className="container-login">
                <form style={{ width: "23rem" }}>

                    <h3 className="fw-normal mb-3 pb-3" style={{ letterspacing: "1px" }}>Welcome to Werewolf Game</h3>

                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="form2Example18">Email</label>
                        <input type="email" id="form2Example18" className="form-control form-control-lg"
                            placeholder="Your Email" value={form.email} name="email"
                            onChange={handleInputChange} />
                    </div>

                    <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="form2Example28">Password</label>
                        <input type="password" id="form2Example28" className="form-control form-control-lg"
                            placeholder="Your Password" value={form.password} name="password"
                            onChange={handleInputChange} />
                    </div>

                    <div className="pt-1 mb-4">
                        <button className="btn btn-info btn-lg btn-block" type="button" onClick={handleLogin}>Login</button>
                    </div>

                    <div id="buttonDiv"></div>

                    <p className="text-center text-muted mt-5 mb-0">Don't have an account? <Link to="/register"
                        className="fw-bold text-body"><u>Register here</u></Link></p>

                </form>
            </div>
            
        </section>
    )
}