import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Room({ socket, username, room, socketID }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        socketID: socketID,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div class="flex flex-col w-full">
      <div class="mt-10 justify-around flex flex-row w-full h-96">
        <div class="bg-gray-700 w-2/5 text-white rounded-3xl">
          <div class="bg-gray-800 py-2 rounded-t-3xl w-full ">
          YouTube Video Queue
          </div>
        </div>
        <div class="flex flex-col w-2/5">
          <div class="bg-gray-800 py-2 rounded-t-3xl text-white">
          Live Chat
          </div>
          <div class="bg-gray-700 text-white overflow-y-auto h-full">
            <ScrollToBottom>
              {messageList.map((messageContent) => {
                return (
                  <div>
                    <div class="flex flex-row px-4 py-1 border-b border-gray-500 min-w-full min-h-fit overflow-hidden inline">
                      <p class="text-left text-yellow-300">{messageContent.author} </p> 
                      <p class="text-left inline break-words">: {messageContent.message}</p>
                    </div>
                  </div>
                );
              })}
            </ScrollToBottom>
          </div>
            <div class="flex flex-row justify-around bg-gray-800 rounded-b-3xl p-2">
              <input
                class="bg-neutral-50 shadow appearance-none border rounded py-1 w-3/5 px-3 placeholder:text-black leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                value={currentMessage}
                placeholder="Type Here"
                onChange={(event) => {
                  setCurrentMessage(event.target.value);
                }}
                onKeyPress={(event) => {
                  event.key === "Enter" && sendMessage();
                }}
              />
              <button class="text-white bg-sky-600 px-4 rounded" onClick={sendMessage}>Send</button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Room;