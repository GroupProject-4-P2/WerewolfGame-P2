import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios'
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import socketContext from "../../socketContext";

export const Lobby = () => {
    //const [socket, setSocket] = useState(null);
    const {socket} = useContext(socketContext);
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState({ name: 'User', email: '123' });
    const [search, setSearch] = useState('');
    const [room, setRoom] = useState('');
    const [loadingGame, setLoadingGame] = useState(false);
    const [startGameButton, setStartGameButton] = useState(false);

    useEffect(() => {
        //setSocket(io('http://localhost:3000'));
        console.log('Koneksi dengan server', socket);
        socket.emit('getinfo:user', { authorization: `Bearer ${localStorage.getItem('access_token')}` });
    }, []);

  

    useEffect(() => {
        // if (socket) {
            socket.on("hello", (payload) => {
                console.log(payload)
                socket.emit('check:user', { authorization: `Bearer ${localStorage.getItem('access_token')}` })
            });

            socket.on('getinfo:user', (payload) => {
           
                setUserProfile({ name: payload.data.name, email: payload.data.email });
            });

            socket.on('start:game', (payload) => {
           
                if (payload.isStart) {
                    let timerInterval;
                    const secondsToCountdown = 5; 

                    localStorage.setItem('RoomId', payload.RoomId);
                    
                    Swal.fire({
                        title: "Permainan Dimulai!",
                        html: `Selamat bermain`,
                        timer: secondsToCountdown * 1000, 
                        timerProgressBar: true,
                        showConfirmButton: false,
                        onBeforeOpen: () => {
                            Swal.showLoading();
                            const timer = Swal.getPopup().querySelector("b");
                            timerInterval = setInterval(() => {
                                const remainingTime = Math.ceil(Swal.getTimerLeft() / 1000);
                                timer.textContent = `${remainingTime}`;
                            }, 1000);
                        },
                        onClose: () => {
                            clearInterval(timerInterval);
                        }
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.timer) {
                            navigate('/chat');
                            setLoadingGame(false);
                            Swal.close();
                        }
                    });
                } else {
                    //startGameButton is only for the room creator
                    if (startGameButton) {
                        Swal.fire(`Pemain Kurang!`, `Pemain saat ini berjumlah ${payload.playerLength} dan belum cukup untuk memulai permainan (min. 5 player)`, "warning");
                    }
                }
            })

            // return () => {
            //     socket.disconnect()
            // }
        // }
    }, [socket]);

    const searchRoom = () => {
        if (search === '') {
            Swal.fire(`Keyword Kosong!`, "Mohon masukkan nama room!", "warning");
            return;
        }
        socket.emit('search:room', { search, authorization: `Bearer ${localStorage.getItem('access_token')}` });
        socket.on('search:room', (payload) => {
            if (payload.data !== 'notExist') {
                Swal.fire({
                    title: `Room ${payload.data.name} sudah tersedia, ingin join?`,
                    showCancelButton: true,
                    confirmButtonText: "Join",
                    cancelButtonText: `Tidak`
                }).then((result) => {
                    if (result.isConfirmed) {
                        socket.emit('join:room', { RoomId: payload.data.id, authorization: `Bearer ${localStorage.getItem('access_token')}` });
                        socket.on("join:room", async (payload) => {
                            if (payload.data === 'hasExist') {
                                Swal.fire(`Anda sudah join di room ${search} sebelumnya`, "", "warning");
                            } else if (payload.data === 'hasFull') {
                                Swal.fire(`Room ${search} sudah full, mohon untuk mencari room lain`, "", "warning");
                            } else {
                                setRoom(search);
                                localStorage.setItem('isCreator', false);
                                Swal.fire(`Sukses join ke room ${search}`, "", "success").then(() => {
                                    setLoadingGame(true);
                                });
                            }
                        });

                    }
                });
            } else {
                Swal.fire({
                    title: `Room ${search} belum ada, ingin membuat room?`,
                    showCancelButton: true,
                    confirmButtonText: "Buat Room",
                    cancelButtonText: `Tidak`
                }).then((result) => {
                    if (result.isConfirmed) {
                        socket.emit('create:room', { search, authorization: `Bearer ${localStorage.getItem('access_token')}` });
                        socket.on("create:room", async (payload) => {
                            setRoom(payload.data.name);
                            localStorage.setItem('isCreator', true);
                            Swal.fire(`Sukses membuat room ${search}`, "", "success").then(() => {
                                setStartGameButton(true);
                            });
                        });
                    }
                });
            }
        })
    }

    const startGame = () => {
        socket.emit('start:game', { room, authorization: `Bearer ${localStorage.getItem('access_token')}` }, room);

    }

    const handleOnSubmitRoom = (e) => {
        e.preventDefault();

        searchRoom();
    }

    useEffect(() => {
        console.log(room);
    }, [room]);


    if (loadingGame) {
        Swal.fire({
            title: 'Mohon tunggu game akan segera dimulai',
            showConfirmButton: false,
            allowOutsideClick: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });
    }


    const logout = () => {
        localStorage.clear();
        navigate('/login');
    }

    return (
        <>
            <div className="h-screen w-screen flex items-center justify-center relative bg-cover " style={{ backgroundImage: 'url(https://wallpapers.com/images/hd/cartoons-animated-village-nl20v6jcsabr5swl.jpg)' }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="flex  flex-col w-5/6 h-4/6  z-10">
                    <div className="grid grid-rows-3 grid-flow-col gap-4  h-full">

                        {/* Section profile */}
                        <div className="row-span-2 bg-indigo-500 rounded-2xl p-4 shadow-lg">
                            <div className="grid grid-rows-5 grid-flow-col h-full content-center">
                                <div className="row-span-1  rounded-2xl flex items-center justify-center ">
                                    <div className="mb-6 font-bold text-xl text-white">Welcome!</div>
                                </div>
                                <div className="row-span-2  rounded-2xl flex items-center justify-center">
                                    <img src="https://static.vecteezy.com/system/resources/previews/011/490/381/original/happy-smiling-young-man-avatar-3d-portrait-of-a-man-cartoon-character-people-illustration-isolated-on-white-background-vector.jpg" className="rounded-full w-28 h-28 shadow-lg" alt="" srcSet="" />
                                </div>
                                <div className="row-span-2 rounded-2xl flex items-center justify-center mt-2">
                                    <div className="flex flex-col h-full content-center">
                                        <div className="rounded-2xl flex justify-center h-6">
                                            <div className="font-bold text-white">{userProfile.name}</div>
                                        </div>
                                        <div className=" rounded-2xl flex justify-center h-6">
                                            <div className="text-sm text-white font-light">{userProfile.email}</div>
                                        </div>
                                        <div className="flex flex-row h-full content-center justify-center my-3 px-3 cursor-pointer bg-red-700 hover:bg-red-800 pt-1 rounded-xl" onClick={logout}>
                                            <span className="text-white font-semibold">Logout</span>
                                            {/* <div className=" rounded-full flex justify-center h-6">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/2048px-Facebook_f_logo_%282019%29.svg.png" alt="" srcSet="" className="shadow-2xl" />
                                            </div>
                                            <div className=" rounded-full flex justify-center h-6">
                                                <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="" srcSet="" className="shadow-2xl" />
                                            </div> */}

                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Section ads */}
                        <div className="row-span-1 bg-indigo-500 rounded-2xl p-2 flex justify-center items-center w-full">
                            <div className="row justify-center items-center w-full">
                                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgU-2QCyFewaHJ2o_y7BjcIfC2P-P9yUtm-_MBBG9v6hlFc69OZI1rb2f8TCQpoOu-jkBCWVGHFyQ-GGsa78utQGTCXdIxMN_3euDAhk4eD48PoMpXecHsIe8YwlwjGFQU7-gecuzO2hH5-FhAakhvYTr8h4p9b85uKDEcTgXVEEKp6K7eK54x-sHVk/w0/spesifikasi%20hogwarts%20legacy.webp" alt="" className="w-full h-32 rounded-xl mx-auto" />
                            </div>
                        </div>

                        {/* Section join room */}
                        <div className="row-span-2 col-span-2 bg-indigo-600 rounded-2xl p-4">
                            <div className="grid grid-rows-3 grid-flow-col h-full content-center">
                                <div className="row-span-1  rounded-2xl flex items-center justify-center ">
                                    <div className="flex flex-col h-full content-center">
                                        <div className="mb-1 font-bold text-xl text-white flex justify-center">
                                            <span className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                    <path d="M15.75 8.25a.75.75 0 01.75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 11-.992-1.124A2.243 2.243 0 0015 9a.75.75 0 01.75-.75z" />
                                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM4.575 15.6a8.25 8.25 0 009.348 4.425 1.966 1.966 0 00-1.84-1.275.983.983 0 01-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 012.328-.377L16.5 15h.628a2.25 2.25 0 011.983 1.186 8.25 8.25 0 00-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.575 15.6z" clipRule="evenodd" />
                                                </svg>
                                                <span className="ml-2">PARTY</span>
                                            </span>
                                        </div>
                                        <div className="mb-6 text-white">Play with your friends!</div>
                                    </div>
                                </div>
                                <form onSubmit={handleOnSubmitRoom}>
                                    <div className="row-span-1 rounded-2xl flex items-center justify-center ">
                                        <div className="flex flex-row h-full w-full content-center">
                                            <input
                                                type="text"
                                                className="w-5/6 rounded-3xl shadow-xl h-10 pl-4 pr-2 text-neutral-900 border-2 border-neutral-300 focus:outline-none focus:border-primary-500"
                                                placeholder="Cari atau buat room ..."
                                                value={search}
                                                onChange={(e) => { setSearch(e.target.value) }}
                                            />
                                            <button
                                                type="submit"
                                                className="w-1/6 bg-indigo-500 shadow-xl hover:bg-indigo-800 rounded-3xl h-10 ml-2 justify-center content-center items-center flex"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                                                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {startGameButton && (
                                    <div className="row-span-1 flex justify-center cursor-pointer">
                                        <div onClick={startGame}
                                            className="w-1/2 bg-lime-500 shadow-xl hover:bg-lime-700 rounded-3xl h-10 ml-2 justify-center content-center items-center flex"
                                        >
                                            <span className="text-white font-bold">Mulai Permainan</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section online users */}
                        <div className="row-span-2 bg-indigo-500 rounded-2xl p-4 shadow-lg">
                            <div className="grid grid-rows-5 grid-flow-col h-full content-center">
                                <div className="row-span-1  rounded-2xl flex items-center justify-center ">
                                    <div className="mb-6 font-bold text-xl text-white">Online Players</div>
                                </div>
                                <div className="row-span-2 rounded-2xl ">
                                    <table className="w-full text-white">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Nama</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-center">
                                            <tr>
                                                <td>1</td>
                                                <td>Fauzan</td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>Beni</td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>Arvi</td>
                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>Oka</td>
                                            </tr>
                                            <tr>
                                                <td>5</td>
                                                <td>Daffa</td>
                                            </tr>
                                            <tr>
                                                <td>6</td>
                                                <td>Patra</td>
                                            </tr>
                                            <tr>
                                                <td>7</td>
                                                <td>Angga</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>

                        {/* Section ads */}
                        <div className="row-span-1 bg-indigo-500 rounded-2xl p-2 flex justify-center items-center w-full">
                            <div className="row justify-center items-center w-full">
                                <img src="https://pulsadollar.files.wordpress.com/2019/06/rise-of-kingdoms-lost-crusade-android-full-version-free-download.jpg" alt="" className="w-full h-32 rounded-xl mx-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}