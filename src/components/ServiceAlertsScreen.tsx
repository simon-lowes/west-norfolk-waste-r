import { Card } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Warning, Info } from '@phosphor-icons/react'
import type { ServiceAlert } from '@/lib/types'

interface ServiceAlertsScreenProps {
  alerts: ServiceAlert[]
  userPostcode?: string
}

export function ServiceAlertsScreen({ alerts, userPostcode }: ServiceAlertsScreenProps) {
  const now = new Date()
  
  const activeAlerts = alerts.filter(alert => {
    const start = new Date(alert.startDate)
    const end = new Date(alert.endDate)
    
    const isActive = now >= start && now <= end
    const affectsUser = !userPostcode || alert.affectedPostcodes.length === 0 || 
                        alert.affectedPostcodes.includes(userPostcode)
    
    return isActive && affectsUser
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Service alerts</h1>
        <p className="text-lg text-muted-foreground">
          Current service updates and important information
        </p>
      </div>

      {activeAlerts.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-3">
            <Info size={48} className="text-muted-foreground" weight="duotone" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No active alerts</h3>
          <p className="text-muted-foreground">
            All services are running normally
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {activeAlerts.map((alert) => (
            <Alert 
              key={alert.id} 
              variant={alert.severity === 'urgent' ? 'destructive' : 'default'}
              className="border-l-4"
            >
              <Warning size={20} />
              <AlertTitle className="font-semibold text-lg">{alert.title}</AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <p>{alert.message}</p>
                <p className="text-sm opacity-80">
                  {formatDate(alert.startDate)} - {formatDate(alert.endDate)}
                </p>
                {alert.affectedPostcodes.length > 0 && (
                  <p className="text-sm opacity-80">
                    Affected postcodes: {alert.affectedPostcodes.join(', ')}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  )
}
