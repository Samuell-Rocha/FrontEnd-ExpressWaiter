//lado aplicação web
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://192.168.1.18:8081';

class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(SOCKET_SERVER_URL);

    this.socket.on('connect', () => {
      console.log('Aplicação Web Conectada ao servidor Socket.IO');
    });

    this.socket.on('disconnect', () => {
      console.log('Aplicação Web Desconectada do servidor Socket.IO');
    });
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket.on(event, callback);
  }

  off(event: string, callback: (...args: any[]) => void) {
    this.socket.off(event, callback);
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

const socketService = new SocketService();

socketService.on('customEvent', (data) => {
  console.log('Received custom event:', data);
});

export default socketService;
