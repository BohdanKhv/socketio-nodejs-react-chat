import { useState } from 'react';
import io from 'socket.io-client';
import Chat from './Chat';
import SignIn from './SignIn';
import './style.css'

const socket = io.connect('http://localhost:3001')

function App() {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')
  const [uID, setUID] = useState('')
  const [showChat, setShowChat] = useState(false)

  const joinRoom = async () => {
    if (username !== "" && room !== "") {
      await socket.emit('join_room', room)
      setShowChat(true)
      setUID(socket.id)
    }
  }

  return (
    <div className="App">
      {!showChat ? 
        <SignIn socket={socket} setUsername={setUsername} setRoom={setRoom} joinRoom={joinRoom}/>
        :
        <Chat socket={socket} username={username} room={room} uID={uID}/>
      }
    </div>
  );
}

export default App;
