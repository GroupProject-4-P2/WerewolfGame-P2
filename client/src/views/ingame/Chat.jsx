import { useState, useEffect, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Swal from 'sweetalert2';
import socketContext from '../../socketContext';

export const Chat = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  // const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState(localStorage.getItem('RoomId'));
  const [isCreator, setIsCreator] = useState(localStorage.getItem('isCreator'));
  const [myRole, setMyRole] = useState('');
  const [round, setRound] = useState(1);
  const [session, setSession] = useState(1);
  const [isStart, setIsStart] = useState(false);
  const [key, setKey] = useState(0);
  const [turn, setTurn] = useState('night');
  const [isVote, setIsVote] = useState(true);
  const [recentPlayers, setrecentPlayers] = useState([]);
  const [userProfile, setUserProfile] = useState({ name: 'User', email: '123' });
  const { socket } = useContext(socketContext);

  useEffect(() => {

    if (localStorage.getItem('isCreator')) {
      socket.emit('assign:role', { authorization: `Bearer ${localStorage.getItem('access_token')}`, RoomId: roomId });
    }
    socket.emit('get:myRole', { authorization: `Bearer ${localStorage.getItem('access_token')}`, RoomId: roomId });
    socket.emit('getinfo:user', { authorization: `Bearer ${localStorage.getItem('access_token')}` });
    socket.emit('getRecent:Player', { authorization: `Bearer ${localStorage.getItem('access_token')}`, RoomId: roomId });
  }, []);


  useEffect(() => {


    if (socket) {
      socket.emit('authenticate', userId);
    }
  }, [userId]);

  useEffect(() => {
    socket.on('getRecent:Player', ({ data }) => {
      setrecentPlayers(data);
      console.log(data)
    });
  }, [isStart])

  useEffect(() => {
    if (socket) {
      socket.on('private message', ({ sender, text }) => {
        setMessages((prevMessages) => [...prevMessages, { sender, text, timestamp: new Date() }]);
      });

      socket.on('getinfo:user', (payload) => {
        setUserProfile({ name: payload.data.name, email: payload.data.email });
      });

      socket.on('get:myRole', (payload) => {
        setMyRole(payload.role);
        localStorage.setItem('role', payload.role);
        // setUserProfile({ name: payload.data.name, email: payload.data.email });
      });
    }
  }, [socket]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    if (socket) {
      socket.emit('private message', { recipient: 'recipientUserId', text: newMessage });
    }
    const updatedMessages = [...messages, { sender: 'You', text: newMessage, timestamp: new Date() }];
    setMessages(updatedMessages);
    setNewMessage('');
  };

  const changeStage = () => {
    if (turn === 'night') {
      setTurn('morning');
      setRound((prevRound) => prevRound + 1);
      setKey((prevKey) => prevKey + 1);
    } else {
      setTurn('night');
      setRound((prevRound) => prevRound + 1);
      setKey((prevKey) => prevKey + 1);
    }
  };

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className="timer text-white">Round {round}</div>;
    }

    return (
      <div className="timer">
        <div className="text-center text-white">{turn}</div>
        <div className="text-center font-bold text-3xl text-white">{remainingTime}</div>
        <div className="text-center text-white">detik</div>
      </div>
    );
  };


  const fetchPlayer = () => {
    console.log('tes')
    console.log(isCreator);
    // socket.emit('get:myRole', { authorization: `Bearer ${localStorage.getItem('access_token')}`, RoomId: roomId });
    // socket.emit('fetch:player', { authorization: `Bearer ${localStorage.getItem('access_token')}`, RoomId: roomId });
  }

  const postTarget = (TargetId) => {
    console.log(TargetId);
    socket.emit('choose:target', { authorization: `Bearer ${localStorage.getItem('access_token')}`, TargetId, RoomId: roomId });
  }

  useEffect(() => {
    // setKey((prevKey) => prevKey + 1);
  }, [round]);



  return (
    <div className="grid grid-flow-row-dense grid-cols-4 grid-rows-3 h-screen w-screen bg-cover" style={{ backgroundImage: 'url(https://wallpapers.com/images/hd/cartoons-animated-village-nl20v6jcsabr5swl.jpg)' }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="col-span-1 row-span-3 justify-center items-center flex z-10">


        <div className='flex h-5/6 w-5/6 bg-indigo-500 rounded-xl'>
          <div className='flex flex-col h-full w-full'>
            <div className='flex w-full h-20 justify-center items-center mt-4'>
              <img src="https://static.vecteezy.com/system/resources/previews/011/490/381/original/happy-smiling-young-man-avatar-3d-portrait-of-a-man-cartoon-character-people-illustration-isolated-on-white-background-vector.jpg" className='w-20 h-20 rounded-full' alt="" srcSet="" />
            </div>
            <div className='flex w-full pt-3 justify-center items-center '>
              <span className='font-semibold'>{userProfile.name}</span>
            </div>
            <div className='flex w-full h-auto justify-center'>
              <span className='italic'>{myRole}</span>
            </div>
            <div className='flex w-auto h-auto justify-center mt-4 py-2 rounded-xl bg-indigo-800 '>

              <CountdownCircleTimer
                key={key}
                isPlaying
                size={120}
                duration={turn === 'night' ? 5 : 5}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[7, 5, 2, 0]}
                onComplete={changeStage}
              >
                {renderTime}
              </CountdownCircleTimer>
            </div>

            {isCreator && (
              <div className='flex w-auto h-auto justify-center items-center mt-2'>
                <div
                  className='bg-orange-700 rounded-xl cursor-pointer h-8 w-1/2 flex items-center justify-center'
                  onClick={fetchPlayer}
                >
                  <span className='text-center text-white'>Fetch</span>
                </div>
              </div>
            )
            }





            <div className='flex w-auto h-auto justify-center items-center mt-2'>

              <span className='text-center text-white text-xl font-bold underline mb-4'>Vote</span>

            </div>
            <div className="grid grid-cols-2 gap-4 mx-4 mt-4">

              {
                recentPlayers.length > 0 ? (
                  recentPlayers.map((el) => (

                    <button key={el.id} className="bg-blue-400 hover:bg-blue-700 rounded-xl cursor-pointer h-8 w-full text-white" onClick={() => { postTarget(el.id) }}>{el.User.name}</button>
                  ))
                ) : (
                  <h1 className="col-span-8 text-center">Anda sudah memilih</h1>
                )
              }
            </div>

          </div>

        </div>


      </div>

      <div className="col-span-3 row-span-3 justify-center items-center flex">

        <div className='flex h-5/6 w-5/6 bg-lime-300 rounded-xl'>

        </div>


      </div>

    </div>
    // <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 p-10">
    //   <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
    //     <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
    //       {messages.map((message, index) => (
    //         <div key={index} className={`flex w-full mt-2 ${index % 2 === 0 ? 'ml-auto justify-end' : ''}`}>
    //           <div className={index % 2 === 0 ? 'flex-shrink-0 h-10 w-10 rounded-full bg-gray-300' : ''}></div>
    //           <div className={index % 2 === 0 ? 'ml-auto justify-end' : ''}>
    //             <div className={index % 2 === 0 ? 'bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg' : 'bg-gray-300 p-3 rounded-r-lg rounded-bl-lg'}>
    //               <p className="text-sm">{message.text}</p>
    //             </div>
    //             <span className="text-xs text-gray-500 leading-none">{message.sender}</span>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //     <div className="bg-gray-300 p-4">
    //       <input
    //         className="flex items-center h-10 w-full rounded px-3 text-sm"
    //         type="text"
    //         placeholder="Type your message…"
    //         value={newMessage}
    //         onChange={(e) => setNewMessage(e.target.value)}
    //         onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
    //       />
    //     </div>
    //   </div>
    // </div>
  );
};