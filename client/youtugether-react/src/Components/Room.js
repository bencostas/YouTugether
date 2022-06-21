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
          <div className="bg-gray-700 text-white overflow-auto">
              
            <div className="overflow-auto">
              <div className="overflow-auto ">
                <ScrollToBottom className="overflow-auto">
                  {messageList.map((messageContent) => {
                    return (
                      <div
                        className="message"
                        id={socketID === messageContent.socketID ? "you" : "other"}
                      >
                        <div>
                          <div className="message-content">
                            <p>{messageContent.message}</p>
                          </div>
                          <div className="message-meta">
                            <p id="time">{messageContent.time}</p>
                            <p id="author">{messageContent.author}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </ScrollToBottom>
              </div>
            </div>
          </div>
            <div class="flex flex-row justify-around bg-gray-800 rounded-b-3xl p-2">
              <input
                type="text"
                value={currentMessage}
                placeholder="Hey..."
                onChange={(event) => {
                  setCurrentMessage(event.target.value);
                }}
                onKeyPress={(event) => {
                  event.key === "Enter" && sendMessage();
                }}
              />
              <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Room;