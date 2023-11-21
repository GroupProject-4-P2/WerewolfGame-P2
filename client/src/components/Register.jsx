import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"
import axios from "axios"

export const Register = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState("")

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
            if (error.response.data) {
                setError(error.response.data.message)
            } else {
                setError(`cari errornya bro, ganbate`)
            }
        }
    }

    return (
        <section className="vh-100 bg-image"
            style={{ backgroundimage: "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')" }}>
            <div className="mask d-flex align-items-center h-100 gradient-custom-3">
                <div className="container h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                            <div className="pub-button">
                            </div>
                            <div className="card" style={{ borderradius: "15px" }}>
                                <div className="card-body p-5">
                                    <h2 className="text-uppercase text-center mb-5">Create an account</h2>

                                    <form>
                                        {error && <div className="alert alert-danger" role="alert">{error}</div>}
                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="form3Example1cg">Name</label>
                                            <input type="text" id="form3Example1cg" className="form-control form-control-lg" name="name" value={userData.username} onChange={handleInputChange} />
                                        </div>

                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="form3Example3cg">Email</label>
                                            <input type="email" id="form3Example3cg" className="form-control form-control-lg" name="email" value={userData.email} onChange={handleInputChange} />
                                        </div>

                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="form3Example4cg">Password</label>
                                            <input type="password" id="form3Example4cg" className="form-control form-control-lg" name="password" value={userData.password} onChange={handleInputChange} />
                                        </div>

                                        <div className="d-flex justify-content-center">
                                            <button type="button" className="btn btn-success btn-block btn-lg gradient-custom-4 text-body" onClick={handleCreateUser}>Register</button>
                                        </div>

                                        <p className="text-center text-muted mt-5 mb-0">Have already an account? <Link to="/login"
                                            className="fw-bold text-body"><u>Login here</u></Link></p>

                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}