import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import YouTube from 'react-youtube';

function Room({ socket, username, room, socketID, color }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [video, setVideo] = useState("");
  const [currentVideo, setCurrentVideo] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        socketID: socketID,
        color: color
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.off("receive_message").on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  const validateYouTubeUrl = async () => {    
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    var matches = video.match(p);
    if(matches){
        var videoID = matches[1];
        const messageData = {
          room: room,
          author: username,
          message: `Playing video: https://www.youtube.com/watch?v=`+ videoID,
          socketID: socketID,
          color: color
        }
        await socket.emit("send_message", messageData);
        setMessageList((list) => [...list, messageData]);
        await socket.emit("send_video", {videoID, room})
        setCurrentVideo(videoID);
        setVideo("");
    }
    else {
      alert("Invalid Link")
    }
  }

  const opts = {
    height: '500',
    width: '700',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      mute: 1,
    },
  }

  useEffect(() => {
    socket.off("receive_video").on("receive_video", (data) => {
      setCurrentVideo(data);
    });
  }, [socket]);

  return (
    <div class="justify-center flex flex-col w-full">
      <div class="mt-5 text-xl font-semibold">
        You are in Room: {room}
      </div>
      <div class="mt-5 justify-around flex flex-row w-full h-96">
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
                      <p class="text-left" style={{color: messageContent.color}}>{messageContent.author} </p> 
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
      <div class="self-center mt-5 mb-5 flex flex-col w-96">
        <div class="bg-gray-800 py-2 rounded-t-3xl text-white">
        Enter YouTube Video Link Here:
        </div>
        <div class="flex flex-row justify-around bg-gray-800 rounded-b-3xl p-2">
          <input
            class="text-black bg-neutral-50 shadow appearance-none border rounded py-1 w-3/5 px-3 placeholder:text-black leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={video}
            placeholder="Enter YouTube Link Here"
            onChange={(event) => {
              setVideo(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && validateYouTubeUrl();
            }}
          />
          <button class="text-white bg-red-600 px-4 rounded" onClick={validateYouTubeUrl}>Send</button>
        </div>
      </div>
        {currentVideo}
      <div class="flex self-center mt-5 align-center">
        <YouTube videoId={currentVideo} opts={opts}/>
      </div>
    </div>
  );
}

export default Room;