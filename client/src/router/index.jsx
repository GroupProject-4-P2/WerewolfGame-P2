import {
    createBrowserRouter,
    redirect,
} from "react-router-dom";
import { Login } from "../views/auth/Login";
import { Register } from "../views/auth/Register";
import { Lobby } from "../views/lobby/Lobby";
const router = createBrowserRouter([
    {
        loader: () => {
            const access_token = localStorage.getItem(`access_token`)
            if (access_token) {
                throw redirect(`/loby`)
            }
            return null
        },
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
        ],
    },
    {
        loader: () => {
            const access_token = localStorage.getItem(`access_token`)
            if (!access_token) {
                throw redirect(`/login`)
            }
            return null
        },
        children: [
            {
                path: "/",
                element: <Lobby />,
            },
        ],
    },
]);

export default router;