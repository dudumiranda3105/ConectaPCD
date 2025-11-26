import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

class SocketClient {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('[SOCKET] Conectado ao servidor');
    });

    this.socket.on('disconnect', () => {
      console.log('[SOCKET] Desconectado do servidor');
    });

    this.socket.on('notification', (data) => {
      this.emit('notification', data);
    });

    this.socket.on('new_message', (data) => {
      this.emit('new_message', data);
    });

    this.socket.on('user_typing', (data) => {
      this.emit('user_typing', data);
    });

    this.socket.on('authenticated', (data) => {
      this.emit('authenticated', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  authenticate(userId: number, userType: 'candidato' | 'empresa') {
    if (!this.socket) this.connect();
    this.socket?.emit('authenticate', { userId, userType });
  }

  joinConversation(conversaId: number) {
    this.socket?.emit('join_conversation', conversaId);
  }

  leaveConversation(conversaId: number) {
    this.socket?.emit('leave_conversation', conversaId);
  }

  setTyping(conversaId: number, isTyping: boolean) {
    this.socket?.emit('typing', { conversaId, isTyping });
  }

  // Event emitter pattern
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketClient = new SocketClient();
