import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Room from "./Components/Room";
import Logo from "./Components/logo.svg"

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
    else {
      alert("Username and Room ID must be filled to enter a room!")
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div >
          <img src={Logo} alt="React Logo" class="self-center mb-9 mt-64 object-top"/>
          <div>
            <div className="flex flex-col gap-y-6 mb-6 mt-9">
              <text class="text-lg">Watch YouTube Together With Your Friends!</text>
              <input
              class="self-center w-48 placeholder:text-black placeholder:text-center py-3 px-2 rounded-full bg-gray-200 enabled:text-center"
              type="text"
              placeholder="Username"
              onChange={(event) => {
                setUsername(event.target.value);
              }}></input>
              <button class="self-center w-36 bg-red-500 text-white py-3 px-2 rounded-full">Create Room</button>
            </div>
            <div className="flex flex-row gap-x-4 justify-around">
              <input
                class="self-center w-36 placeholder:text-black placeholder:text-center py-3 px-2 rounded-full bg-gray-200 enabled:text-center"
                type="text"
                placeholder="Room ID"
                onChange={(event) => {
                  setRoom(event.target.value);
                }}
              />
              <button class="self-center w-36 bg-black text-white py-3 px-2 rounded-full" onClick={joinRoom}>Join Room</button>
            </div>
          </div>
        </div>
      ) : (
        <Room socket={socket} username={socket.id} room={room} />
      )}
    </div>
  );
}

export default App;