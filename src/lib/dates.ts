const BANK_HOLIDAYS_2024_2025 = [
  '2024-12-25',
  '2024-12-26',
  '2025-01-01',
  '2025-04-18',
  '2025-04-21',
  '2025-05-05',
  '2025-05-26',
  '2025-08-25',
  '2025-12-25',
  '2025-12-26',
]

export function isBankHoliday(date: Date): boolean {
  const dateStr = date.toISOString().split('T')[0]
  return BANK_HOLIDAYS_2024_2025.includes(dateStr)
}

export function getNextCollectionDate(dayOfWeek: number, fromDate: Date = new Date()): Date {
  const result = new Date(fromDate)
  result.setHours(0, 0, 0, 0)
  
  const currentDay = result.getDay()
  let daysUntilCollection = (dayOfWeek - currentDay + 7) % 7
  
  if (daysUntilCollection === 0) {
    daysUntilCollection = 7
  }
  
  result.setDate(result.getDate() + daysUntilCollection)
  
  if (isBankHoliday(result)) {
    result.setDate(result.getDate() + 1)
  }
  
  return result
}

export function formatDate(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  const dayName = days[date.getDay()]
  const day = date.getDate()
  const month = months[date.getMonth()]
  
  return `${dayName} ${day} ${month}`
}

export function getDayName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[dayOfWeek]
}

export function getDaysUntil(date: Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  
  const diffTime = target.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}
