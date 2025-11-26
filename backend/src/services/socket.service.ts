import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

interface ConnectedUser {
  odId: number;
  odType: 'candidato' | 'empresa';
  socket: Socket;
}

class SocketService {
  private io: Server | null = null;
  private connectedUsers: Map<string, ConnectedUser> = new Map();

  initialize(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`[SOCKET] Nova conexão: ${socket.id}`);

      // Autenticar usuário
      socket.on('authenticate', (data: { userId: number; userType: 'candidato' | 'empresa' }) => {
        const { userId, userType } = data;
        const roomId = `${userType}_${userId}`;
        
        socket.join(roomId);
        this.connectedUsers.set(socket.id, {
          odId: userId,
          odType: userType,
          socket,
        });
        
        console.log(`[SOCKET] Usuário autenticado: ${roomId}`);
        socket.emit('authenticated', { success: true });
      });

      // Entrar em sala de conversa
      socket.on('join_conversation', (conversaId: number) => {
        socket.join(`conversa_${conversaId}`);
        console.log(`[SOCKET] Entrou na conversa: ${conversaId}`);
      });

      // Sair de sala de conversa
      socket.on('leave_conversation', (conversaId: number) => {
        socket.leave(`conversa_${conversaId}`);
        console.log(`[SOCKET] Saiu da conversa: ${conversaId}`);
      });

      // Mensagem sendo digitada
      socket.on('typing', (data: { conversaId: number; isTyping: boolean }) => {
        socket.to(`conversa_${data.conversaId}`).emit('user_typing', {
          conversaId: data.conversaId,
          isTyping: data.isTyping,
        });
      });

      // Desconexão
      socket.on('disconnect', () => {
        this.connectedUsers.delete(socket.id);
        console.log(`[SOCKET] Desconectado: ${socket.id}`);
      });
    });

    console.log('[SOCKET] Socket.io inicializado');
  }

  // Enviar notificação para um usuário específico
  sendNotification(userId: number, userType: 'candidato' | 'empresa', notification: {
    type: 'new_message' | 'new_application' | 'application_update' | 'hired' | 'match';
    title: string;
    message: string;
    data?: any;
  }) {
    if (!this.io) return;
    
    const roomId = `${userType}_${userId}`;
    this.io.to(roomId).emit('notification', {
      ...notification,
      timestamp: new Date().toISOString(),
    });
    
    console.log(`[SOCKET] Notificação enviada para ${roomId}:`, notification.type);
  }

  // Enviar nova mensagem para conversa
  sendMessage(conversaId: number, message: {
    id: number;
    conteudo: string;
    remetenteId: number;
    remetenteTipo: 'candidato' | 'empresa';
    createdAt: Date;
  }) {
    if (!this.io) return;
    
    this.io.to(`conversa_${conversaId}`).emit('new_message', message);
    console.log(`[SOCKET] Mensagem enviada para conversa ${conversaId}`);
  }

  // Notificar nova candidatura
  notifyNewApplication(empresaId: number, data: {
    candidatoNome: string;
    vagaTitulo: string;
    candidaturaId: number;
  }) {
    this.sendNotification(empresaId, 'empresa', {
      type: 'new_application',
      title: 'Nova Candidatura!',
      message: `${data.candidatoNome} se candidatou para ${data.vagaTitulo}`,
      data,
    });
  }

  // Notificar atualização de candidatura
  notifyApplicationUpdate(candidatoId: number, data: {
    status: string;
    vagaTitulo: string;
    empresaNome: string;
  }) {
    const statusMessages: Record<string, string> = {
      em_analise: 'Sua candidatura está sendo analisada',
      aprovado: 'Parabéns! Sua candidatura foi aprovada',
      rejeitado: 'Sua candidatura não foi selecionada',
      contratado: '🎉 Parabéns! Você foi contratado!',
    };

    this.sendNotification(candidatoId, 'candidato', {
      type: data.status === 'contratado' ? 'hired' : 'application_update',
      title: data.status === 'contratado' ? 'Você foi contratado!' : 'Atualização de Candidatura',
      message: `${statusMessages[data.status] || 'Status atualizado'} - ${data.vagaTitulo} (${data.empresaNome})`,
      data,
    });
  }

  // Notificar novo match
  notifyNewMatch(candidatoId: number, data: {
    vagaTitulo: string;
    empresaNome: string;
    matchScore: number;
  }) {
    this.sendNotification(candidatoId, 'candidato', {
      type: 'match',
      title: 'Nova Vaga Compatível!',
      message: `${data.vagaTitulo} em ${data.empresaNome} tem ${data.matchScore}% de compatibilidade`,
      data,
    });
  }

  // Verificar se usuário está online
  isUserOnline(userId: number, userType: 'candidato' | 'empresa'): boolean {
    for (const [_, user] of this.connectedUsers) {
      if (user.odId === userId && user.odType === userType) {
        return true;
      }
    }
    return false;
  }

  // Obter contagem de usuários online
  getOnlineCount(): { candidatos: number; empresas: number } {
    let candidatos = 0;
    let empresas = 0;
    
    const uniqueUsers = new Set<string>();
    for (const [_, user] of this.connectedUsers) {
      const key = `${user.odType}_${user.odId}`;
      if (!uniqueUsers.has(key)) {
        uniqueUsers.add(key);
        if (user.odType === 'candidato') candidatos++;
        else empresas++;
      }
    }
    
    return { candidatos, empresas };
  }
}

export const socketService = new SocketService();
