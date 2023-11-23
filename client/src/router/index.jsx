import {
    createBrowserRouter,
    redirect,
} from "react-router-dom";
import { Login } from "../views/auth/Login";
import { Register } from "../views/auth/Register";
import { Lobby } from "../views/lobby/Lobby";

import { Test } from "../views/tes/Test";

import { Chat } from "../views/ingame/Chat";
import { Vote } from "../views/ingame/Vote";

const router = createBrowserRouter([
    {
        loader: () => {
            const access_token = localStorage.getItem(`access_token`)
            if (access_token) {
                throw redirect(`/`)
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
            {

                path: "/test",
                element: <Test />,
            },
            // {
            //     path: "/vote",
            //     element: <Vote />,
            // },
        ],
    },
    {
        loader: () => {
            const RoomId = localStorage.getItem(`RoomId`)
            if (!RoomId) {
                throw redirect(`/login`)
            }
            return null
        },
        children: [
            {
                path: "/chat",
                element: <Chat />,
            },
        ],
    },
]);

export default router;