import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Room from "./Components/Room";
import Logo from "./Components/logo.svg"

const socket = io.connect("http://localhost:3001");

function createID() {
  let code = [];
  let hex = "0123456789";
  for (let i = 0; i < 5; i++) {
    code[i] = hex[Math.floor(Math.random() * 10)];
  }
  return code.join("");
}

function randomHSL(){
  // eslint-disable-next-line
  return "hsla(" + ~~(360 * Math.random()) + "," + "70%,"+ "80%,0.9)";
}

const randomColor = randomHSL();

const id = createID();

function App() {

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState(id);
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== id) {
      socket.emit("join_room", {room, username});
      setShowChat(true);
    }
    else {
      alert("Username and Room ID must be filled to join a room!")
    }
  };

  const createRoom = () => {
    if (username !== "") {
      socket.emit("create_room", {room, username});
      setShowChat(true);
    }
    else {
      alert("Username must be filled to create a room!")
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
              <button class="self-center w-36 bg-red-500 text-white py-3 px-2 rounded-full" onClick={createRoom}>Create Room</button>
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
        <Room socket={socket} username={username} room={room} socketID={socket.id} color={randomColor} />
      )}
    </div>
  );
}

export default App;