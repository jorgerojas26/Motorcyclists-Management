import socketIOClient from 'socket.io-client';

const socketIOEndpoint = 'http://127.0.0.1:8080';

const socket = socketIOClient(socketIOEndpoint);

export default socket;
