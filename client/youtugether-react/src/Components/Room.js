import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import YouTube from 'react-youtube';

function Room({ socket, username, room, socketID, color }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [video, setVideo] = useState("");
  const [videoQueue, setVideoQueue] = useState([]);

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
        // add to videoQueue
        await socket.emit("send_video", {videoID, room});
        setVideoQueue((list) => [...list, {videoID, room}]);
        setVideo("");
    }
    else {
      alert("Invalid Link")
    }
  }

  useEffect(() => {
    socket.off("receive_video").on("receive_video", (data) => {
      setVideoQueue((list) => [...list, data]);
    });
  }, [socket]);

  // const getTitle = async (videoID) => {
  //   const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoID}&key=${API_KEY}&fields=items(snippet(title))&part=snippet`;
  //   const obj = await (await fetch(url)).json();
  //   console.log(JSON.stringify(obj.items[0].snippet.title));
      
  // };
  const opts = {
    height: '500',
    width: '700',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  }

  return (
    <div class="justify-center flex flex-col w-full">
      <div class="mt-5 text-xl font-semibold">
        You are in Room: {room}
      </div>
      <div class="mt-5 justify-around flex flex-row w-full h-96">
        <div class="flex flex-col w-2/5">
          <div class="bg-gray-800 py-2 rounded-t-3xl text-white">
          YouTube Video Queue
          </div>
          <div class="bg-gray-700 text-white overflow-y-auto h-full">
            <ScrollToBottom>
              {videoQueue.map((videoData, index) => {
                return (
                  <div key={index}>
                    <div class="justify-around flex flex-row px-4 py-1 border-b border-gray-500 min-w-full min-h-fit overflow-hidden inline"> 
                      <p class="text-left inline break-words">https://www.youtube.com/watch?v={videoData.videoID}</p>
                    </div>
                  </div>
                );
              })}
            </ScrollToBottom>
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
      <div class="flex self-center mt-5 align-center">
        <YouTube videoId={videoQueue[0]} opts={opts}/>
      </div>
    </div>
  );
}

export default Room;