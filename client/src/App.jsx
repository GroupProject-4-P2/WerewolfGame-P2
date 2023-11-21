import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { Login } from "./components/Login";
import { Register } from "./components/Register";

const router = createBrowserRouter([
  {
    loader: () => {
      const access_token = localStorage.getItem(`access_token`)
      if(access_token) {
        throw redirect(`/loby`)
      }
      return null
    },
    path: "/login",
    element: <Login/>
  },
  {
    loader: () => {
      const access_token = localStorage.getItem(`access_token`)
      if(access_token) {
        throw redirect(`/loby`)
      }
      return null
    },
    path: "/register",
    element: <Register/>
  },
]);

function App() {


  return <RouterProvider router={router} />
}

export default App
