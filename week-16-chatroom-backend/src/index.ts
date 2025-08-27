import { WebSocketServer, WebSocket } from 'ws';
const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    roomId: string;
}

let allSockets: User[] = [];

wss.on('connection', (socket)=>{
    socket.on('message', (message)=>{
        const parsedMessage = JSON.parse(message as unknown as string);
        // user wants to join a chat room
        if(parsedMessage.type === 'join'){
            allSockets.push({
                socket,
                roomId: parsedMessage.roomId
            });
        }
        // user wants to send a message in a joined chatroom
        else if(parsedMessage.type === 'chat'){
            const currentUserRoomId = allSockets.find(u => u.socket === socket)?.roomId;
            if(currentUserRoomId){
                allSockets.filter(u => u.roomId === currentUserRoomId).forEach(u => {
                    if(u.socket.readyState === WebSocket.OPEN){
                        u.socket.send(parsedMessage.message);
                    }
                });
            }
        }
    })
    // remove entry when user disconnects
    socket.on('close', ()=>{
        allSockets = allSockets.filter(u => u.socket !== socket);
    })
})