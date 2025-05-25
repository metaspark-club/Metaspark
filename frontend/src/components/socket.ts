import { io } from 'socket.io-client';

let socket: any = null;

export const connectSocket = (token: string) => {
  socket = io('http://localhost:5000', {
    auth: { token },
  });
  return socket;
};

export const getSocket = () => socket;
