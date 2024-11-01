import io from 'socket.io-client';

const socket = io('http://localhost:29400');

export const websocket = () => {

    
        socket.on('message2', (data) => {
            console.log("Recieved from SERVER ::", data)
            // Execute any command
        })
   
    }