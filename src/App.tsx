import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { 
  House, 
  MagnifyingGlass, 
  Trash, 
  MapPin, 
  Warning, 
  PencilSimple,
  Gear,
  ShieldWarning,
  List
} from '@phosphor-icons/react'
import { HomeScreen } from '@/components/HomeScreen'
import { FindBinDayScreen } from '@/components/FindBinDayScreen'
import { WhatGoesWhereScreen } from '@/components/WhatGoesWhereScreen'
import { RecyclingCentresScreen } from '@/components/RecyclingCentresScreen'
import { ServiceAlertsScreen } from '@/components/ServiceAlertsScreen'
import { ReportIssueScreen } from '@/components/ReportIssueScreen'
import { SettingsScreen } from '@/components/SettingsScreen'
import { AdminScreen } from '@/components/AdminScreen'
import { AddressSelector } from '@/components/AddressSelector'
import type { Property, WasteItem, RecyclingCentre, ServiceAlert, Report } from '@/lib/types'

type Screen = 'home' | 'find-bin-day' | 'what-goes-where' | 'recycling-centres' | 'service-alerts' | 'report-issue' | 'settings' | 'admin'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  
  const [properties] = useKV<Property[]>('properties', [])
  const [wasteItems] = useKV<WasteItem[]>('waste_items', [])
  const [recyclingCentres] = useKV<RecyclingCentre[]>('recycling_centres', [])
  const [alerts, setAlerts] = useKV<ServiceAlert[]>('service_alerts', [])
  const [reports, setReports] = useKV<Report[]>('reports', [])
  const [savedPropertyId, setSavedPropertyId] = useKV<string | null>('saved_property_id', null)

  useEffect(() => {
    if (savedPropertyId && properties && properties.length > 0) {
      const property = properties.find(p => p.id === savedPropertyId)
      if (property) {
        setSelectedProperty(property)
      }
    }
  }, [savedPropertyId, properties])

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property)
    setSavedPropertyId(property.id)
  }

  const handleClearAddress = () => {
    setSelectedProperty(null)
    setSavedPropertyId(null)
  }

  const handleCreateAlert = (alert: Omit<ServiceAlert, 'id'>) => {
    const newAlert: ServiceAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
    }
    setAlerts(current => [...(current || []), newAlert])
  }

  const handleDeleteAlert = (id: string) => {
    setAlerts(current => (current || []).filter(a => a.id !== id))
  }

  const handleSubmitReport = (report: Omit<Report, 'id' | 'createdAt' | 'referenceNumber'>) => {
    const newReport: Report = {
      ...report,
      id: `report-${Date.now()}`,
      createdAt: new Date().toISOString(),
      referenceNumber: `WN${Date.now().toString().slice(-8)}`,
    }
    setReports(current => [...(current || []), newReport])
  }

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: House },
    { id: 'find-bin-day' as const, label: 'Find bin day', icon: MagnifyingGlass },
    { id: 'what-goes-where' as const, label: 'What goes where', icon: Trash },
    { id: 'recycling-centres' as const, label: 'Recycling centres', icon: MapPin },
    { id: 'service-alerts' as const, label: 'Alerts', icon: Warning },
    { id: 'report-issue' as const, label: 'Report issue', icon: PencilSimple },
  ]

  const renderScreen = () => {
    const safeProperties = properties ?? []
    const safeAlerts = alerts ?? []
    const safeWasteItems = wasteItems ?? []
    const safeRecyclingCentres = recyclingCentres ?? []
    
    if (!selectedProperty && currentScreen !== 'settings' && currentScreen !== 'admin') {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to West Norfolk Waste & Recycling</h1>
            <p className="text-lg text-muted-foreground">
              Find your bin collection days, learn what goes in each bin, and more
            </p>
          </div>
          <AddressSelector
            properties={safeProperties}
            onAddressSelected={handlePropertySelect}
          />
        </div>
      )
    }

    switch (currentScreen) {
      case 'home':
        return selectedProperty ? (
          <HomeScreen
            property={selectedProperty}
            alerts={safeAlerts}
            onNavigate={(screen) => setCurrentScreen(screen as Screen)}
          />
        ) : null

      case 'find-bin-day':
        return (
          <FindBinDayScreen
            properties={safeProperties}
            selectedProperty={selectedProperty || undefined}
            onPropertySelect={handlePropertySelect}
          />
        )

      case 'what-goes-where':
        return <WhatGoesWhereScreen wasteItems={safeWasteItems} />

      case 'recycling-centres':
        return <RecyclingCentresScreen centres={safeRecyclingCentres} />

      case 'service-alerts':
        return (
          <ServiceAlertsScreen
            alerts={safeAlerts}
            userPostcode={selectedProperty?.postcode}
          />
        )

      case 'report-issue':
        return (
          <ReportIssueScreen
            onSubmitReport={handleSubmitReport}
            userPostcode={selectedProperty?.postcode}
            userAddress={selectedProperty?.address}
          />
        )

      case 'settings':
        return (
          <SettingsScreen
            properties={safeProperties}
            currentProperty={selectedProperty || undefined}
            onPropertySelect={handlePropertySelect}
            onClearAddress={handleClearAddress}
          />
        )

      case 'admin':
        return (
          <AdminScreen
            alerts={safeAlerts}
            onCreateAlert={handleCreateAlert}
            onDeleteAlert={handleDeleteAlert}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-primary text-primary-foreground sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">West Norfolk Waste & Recycling</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentScreen('settings')}
              >
                <Gear size={18} />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentScreen('admin')}
                title="Admin"
              >
                <ShieldWarning size={18} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="border-b bg-card sticky top-[68px] z-40 overflow-x-auto">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 py-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={currentScreen === id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentScreen(id)}
                className="flex-shrink-0"
              >
                <Icon size={18} className="mr-1.5" />
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {renderScreen()}
      </main>

      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Borough Council of King's Lynn & West Norfolk
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App