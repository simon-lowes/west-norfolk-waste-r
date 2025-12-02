import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Camera, MapTrifold, CheckCircle } from '@phosphor-icons/react'
import type { Report } from '@/lib/types'

interface ReportIssueScreenProps {
  onSubmitReport: (report: Omit<Report, 'id' | 'createdAt' | 'referenceNumber'>) => void
  userPostcode?: string
  userAddress?: string
}

export function ReportIssueScreen({ onSubmitReport, userPostcode, userAddress }: ReportIssueScreenProps) {
  const [type, setType] = useState<Report['type'] | ''>('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState<string>('')
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | undefined>()
  const [isLocating, setIsLocating] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState('')

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be smaller than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPhoto(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleGetLocation = () => {
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setIsLocating(false)
      },
      (error) => {
        console.error('Location error:', error)
        alert('Unable to get your location. Please check your browser permissions.')
        setIsLocating(false)
      }
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!type || !description) {
      alert('Please fill in all required fields')
      return
    }

    const ref = `WN${Date.now().toString().slice(-8)}`
    setReferenceNumber(ref)

    onSubmitReport({
      type: type as Report['type'],
      description,
      photo: photo || undefined,
      location,
      postcode: userPostcode,
      address: userAddress,
    })

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-accent/10 rounded-full">
              <CheckCircle size={48} className="text-accent" weight="duotone" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Report submitted</h2>
          <p className="text-muted-foreground mb-4">
            Thank you for reporting this issue. We've recorded your report.
          </p>
          <div className="bg-muted p-4 rounded-lg mb-6">
            <p className="text-sm font-medium mb-1">Your reference number</p>
            <p className="text-2xl font-bold">{referenceNumber}</p>
          </div>
          <Button onClick={() => {
            setSubmitted(false)
            setType('')
            setDescription('')
            setPhoto('')
            setLocation(undefined)
          }}>
            Report another issue
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Report an issue</h1>
        <p className="text-lg text-muted-foreground">
          Let us know about missed collections or other problems
        </p>
      </div>

      <Alert>
        <AlertDescription>
          This is a demonstration feature. Reports are stored locally and not sent to the council.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <div>
            <Label htmlFor="issue-type" className="text-base font-medium mb-2 block">
              What type of issue? <span className="text-destructive">*</span>
            </Label>
            <Select value={type} onValueChange={(value) => setType(value as Report['type'])}>
              <SelectTrigger id="issue-type">
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="missed-bin">Missed bin collection</SelectItem>
                <SelectItem value="fly-tipping">Fly-tipping</SelectItem>
                <SelectItem value="street-lighting">Street lighting problem</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-base font-medium mb-2 block">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Please provide details about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="text-base"
            />
          </div>

          <div>
            <Label htmlFor="photo" className="text-base font-medium mb-2 block">
              Photo (optional)
            </Label>
            <div className="space-y-3">
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="text-base"
              />
              {photo && (
                <div className="relative">
                  <img src={photo} alt="Upload preview" className="rounded-lg max-h-64 object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setPhoto('')}
                    className="absolute top-2 right-2"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-2 block">
              Location (optional)
            </Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGetLocation}
                disabled={isLocating}
              >
                <MapTrifold size={18} className="mr-2" />
                {isLocating ? 'Getting location...' : location ? 'Update location' : 'Use my location'}
              </Button>
              {location && (
                <span className="text-sm text-accent font-medium">
                  Location captured
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Adding your location helps the council respond faster
            </p>
          </div>
        </Card>

        <Button type="submit" size="lg" className="w-full">
          Submit report
        </Button>
      </form>
    </div>
  )
}
