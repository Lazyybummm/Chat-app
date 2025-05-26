const { WebSocketServer } = require("ws");
const rooms=[]

function joinrooms(message,socket){
const roomId=message.payload.roomId;
if(rooms.push({
    roomId,socket
})){
    socket.send("you have joined room"+roomId+"succesfully");
    console.log("user joined room succesfully');")
}
else{
    console.log("some error happened")
}
}

function sendmessage(message,socket){
    const roomId=message.payload.roomId;
    const data=message.payload.data;
    const foundrooms=rooms.filter((x)=>x.roomId==roomId);
    for(let i=0;i<foundrooms.length;i++){
        const skt=foundrooms[i].socket;
        if(skt!=socket){
         skt.send(data)
        }
        
    }

}

function leaveroom(message, socket) {
    const roomId = message.payload.roomId;
    console.log("Attempting to leave room:", roomId);

  
    for (let i = 0; i < rooms.length; i++) {
      console.log("Checking room:", rooms[i].roomId);
      console.log("Is socket same?", rooms[i].socket === socket);
      console.log("RoomId match?", rooms[i].roomId === roomId);
  
      if (rooms[i].roomId === roomId && rooms[i].socket === socket) {
        socket.send("you exited the room");
        rooms.splice(i, 1);
        break;
      }
    }
  }
  


const wss=new WebSocketServer({port:8080});
console.log("server has started");
wss.on("connection",(socket)=>{;
    socket.on("message",(msg)=>{
        const parsedmessage=JSON.parse(msg);
        if(parsedmessage.type=="join"){
            joinrooms(parsedmessage,socket);
        }
        else if(parsedmessage.type=="chat"){
            sendmessage(parsedmessage,socket);
        }
        else if(parsedmessage.type=="leave-room"){
            leaveroom(parsedmessage,socket);
        }
        else if(parsedmessage.type=="media-selected"){
            const url=parsedmessage.payload.url;
            wss.clients.forEach((c)=>{
                c.send(JSON.stringify(parsedmessage));
            })
        }
        else{
            socket.send(rooms);
        }
    })
    })
    
