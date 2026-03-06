import { Card } from '@/components/UI/Card'
import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  trend?: { value: number; positive: boolean }
  color?: string
}

export function KpiCard({ label, value, icon: Icon, trend, color = 'text-primary-500' }: KpiCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.positive ? 'text-success' : 'text-danger'}`}>
              {trend.positive ? '+' : ''}{trend.value}% vs sem. dern.
            </p>
          )}
        </div>
        <div className={`p-2 rounded-lg bg-primary-50 ${color}`}>
          <Icon size={24} aria-hidden="true" />
        </div>
      </div>
    </Card>
  )
}
