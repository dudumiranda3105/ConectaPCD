import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { mockActivities } from '@/lib/admin-mock-data'

export const RecentActivities = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>
          Acompanhe as últimas ações na plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockActivities.map((activity, index) => (
          <div key={index} className="flex items-center">
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">{activity.user}</span>{' '}
                {activity.action}
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
