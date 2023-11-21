import {
    createBrowserRouter,
    redirect,
} from "react-router-dom";
import { Login } from "../views/auth/Login";
import { Register } from "../views/auth/Register";
const router = createBrowserRouter([
    {
        loader: () => {
            const access_token = localStorage.getItem(`access_token`)
            if (access_token) {
                throw redirect(`/loby`)
            }
            return null
        },
        path: "/login",
        element: <Login />
    },
    {
        loader: () => {
            const access_token = localStorage.getItem(`access_token`)
            if (access_token) {
                throw redirect(`/loby`)
            }
            return null
        },
        path: "/register",
        element: <Register />
    },
]);

export default router;