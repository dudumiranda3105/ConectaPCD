import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { socketClient } from '@/services/socket';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/use-toast';

export interface Notification {
  id: string;
  type: 'new_message' | 'new_application' | 'application_update' | 'hired' | 'match';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Conectar socket quando usuário estiver logado
  useEffect(() => {
    if (user?.id) {
      socketClient.connect();
      
      const userType = user.role === 'company' ? 'empresa' : 'candidato';
      const userId = user.role === 'company' ? user.empresaId : user.candidatoId;
      
      if (userId) {
        socketClient.authenticate(Number(userId), userType);
      }

      // Listener de conexão
      const unsubAuth = socketClient.on('authenticated', () => {
        setIsConnected(true);
      });

      // Listener de notificações
      const unsubNotif = socketClient.on('notification', (data: any) => {
        const notification: Notification = {
          id: `${Date.now()}-${Math.random()}`,
          ...data,
          read: false,
        };
        
        setNotifications(prev => [notification, ...prev].slice(0, 50)); // Manter últimas 50
        
        // Mostrar toast
        toast({
          title: data.title,
          description: data.message,
          duration: 5000,
        });

        // Tocar som de notificação (se permitido)
        playNotificationSound();
      });

      return () => {
        unsubAuth();
        unsubNotif();
        socketClient.disconnect();
        setIsConnected(false);
      };
    }
  }, [user?.id, user?.role, user?.empresaId, user?.candidatoId, toast]);

  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignorar erros de autoplay
    } catch {
      // Audio não suportado
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isConnected,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
