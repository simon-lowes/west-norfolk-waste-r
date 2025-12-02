import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash } from '@phosphor-icons/react'
import type { ServiceAlert } from '@/lib/types'

interface AdminScreenProps {
  alerts: ServiceAlert[]
  onCreateAlert: (alert: Omit<ServiceAlert, 'id'>) => void
  onDeleteAlert: (id: string) => void
}

export function AdminScreen({ alerts, onCreateAlert, onDeleteAlert }: AdminScreenProps) {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<ServiceAlert['severity']>('info')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [postcodes, setPostcodes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !message || !startDate || !endDate) {
      alert('Please fill in all required fields')
      return
    }

    onCreateAlert({
      title,
      message,
      severity,
      startDate,
      endDate,
      affectedPostcodes: postcodes ? postcodes.split(',').map(p => p.trim()) : [],
    })

    setTitle('')
    setMessage('')
    setSeverity('info')
    setStartDate('')
    setEndDate('')
    setPostcodes('')
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB')
  }

  const isActive = (alert: ServiceAlert) => {
    const now = new Date()
    const start = new Date(alert.startDate)
    const end = new Date(alert.endDate)
    return now >= start && now <= end
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin - Service Alerts</h1>
        <p className="text-lg text-muted-foreground">
          Create and manage service alerts for residents
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Create new alert</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="alert-title" className="text-base font-medium mb-2 block">
              Alert title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="alert-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Christmas collection changes"
            />
          </div>

          <div>
            <Label htmlFor="alert-message" className="text-base font-medium mb-2 block">
              Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="alert-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide details about the service alert..."
              rows={4}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="alert-severity" className="text-base font-medium mb-2 block">
                Severity <span className="text-destructive">*</span>
              </Label>
              <Select value={severity} onValueChange={(value) => setSeverity(value as ServiceAlert['severity'])}>
                <SelectTrigger id="alert-severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Information</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="alert-postcodes" className="text-base font-medium mb-2 block">
                Affected postcodes (optional)
              </Label>
              <Input
                id="alert-postcodes"
                value={postcodes}
                onChange={(e) => setPostcodes(e.target.value)}
                placeholder="PE30 1XX, PE31 6YY (comma separated)"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="alert-start" className="text-base font-medium mb-2 block">
                Start date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="alert-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="alert-end" className="text-base font-medium mb-2 block">
                End date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="alert-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Plus size={18} className="mr-2" />
            Create alert
          </Button>
        </form>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Existing alerts</h2>
        {alerts.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No alerts created yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Card key={alert.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{alert.title}</h3>
                      {isActive(alert) ? (
                        <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs font-medium rounded">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-medium rounded">
                          Inactive
                        </span>
                      )}
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        alert.severity === 'urgent' ? 'bg-destructive text-destructive-foreground' :
                        alert.severity === 'warning' ? 'bg-orange-500 text-white' :
                        'bg-primary text-primary-foreground'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(alert.startDate)} - {formatDate(alert.endDate)}
                      {alert.affectedPostcodes.length > 0 && ` • ${alert.affectedPostcodes.join(', ')}`}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteAlert(alert.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
