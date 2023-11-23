import { createContext } from "react";
import { io } from "socket.io-client";

const socketContext = createContext(null)
export default socketContext

export function SocketProvider({children}) {
    return <socketContext.Provider value={{
            socket: io("http://localhost:3000")
        }}>
        {children}
    </socketContext.Provider>
}