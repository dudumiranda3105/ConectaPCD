import { useState } from 'react';
import { Bell, Check, CheckCheck, Trash2, Briefcase, MessageSquare, Star, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications, Notification } from '@/providers/NotificationProvider';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const notificationIcons: Record<string, any> = {
  new_message: MessageSquare,
  new_application: Briefcase,
  application_update: UserCheck,
  hired: Star,
  match: Star,
};

const notificationColors: Record<string, string> = {
  new_message: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  new_application: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  application_update: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  hired: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  match: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
};

function NotificationItem({ notification, onRead }: { notification: Notification; onRead: () => void }) {
  const Icon = notificationIcons[notification.type] || Bell;
  const colorClass = notificationColors[notification.type] || 'bg-gray-100 text-gray-600';
  
  return (
    <div
      className={cn(
        "p-3 border-b last:border-b-0 cursor-pointer transition-colors hover:bg-muted/50",
        !notification.read && "bg-indigo-50/50 dark:bg-indigo-950/20"
      )}
      onClick={onRead}
    >
      <div className="flex gap-3">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", colorClass)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={cn(
              "text-sm font-medium truncate",
              !notification.read && "text-foreground",
              notification.read && "text-muted-foreground"
            )}>
              {notification.title}
            </p>
            {!notification.read && (
              <span className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1.5" />
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {notification.message}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(notification.timestamp), {
              addSuffix: true,
              locale: ptBR,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications, isConnected } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          {isConnected && (
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-background" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b flex items-center justify-between">
          <h4 className="font-semibold text-sm">Notificações</h4>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={markAllAsRead}
              >
                <CheckCheck className="w-3 h-3 mr-1" />
                Marcar lidas
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={clearNotifications}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">
                Nenhuma notificação
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={() => markAsRead(notification.id)}
              />
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
