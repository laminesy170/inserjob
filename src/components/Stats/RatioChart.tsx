import { Card } from '@/components/UI/Card'

interface RatioChartProps {
  title: string
  data: { label: string; value: number; color: string }[]
}

export function RatioChart({ title, data }: RatioChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>

      <div className="flex rounded-full h-3 overflow-hidden bg-gray-100" role="img" aria-label={title}>
        {data.map((item, i) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0
          return (
            <div
              key={i}
              className="h-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: item.color }}
              title={`${item.label}: ${item.value} (${Math.round(pct)}%)`}
            />
          )
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            {item.label}: <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
