let clientID = null;

let ws = new WebSocket('ws://localhost:3030');

ws.onmessage = message => {
    const response = JSON.parse(message.data);

    // connect to server
    if (response.method === 'connect') {
        clientID = response.clientID;
        console.log(`client ${clientID} joined!`)
    }
}