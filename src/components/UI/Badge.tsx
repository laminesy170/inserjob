import type { StatutCandidature, TypeContrat } from '@/types'

type BadgeVariant = 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  gray: 'bg-gray-100 text-gray-700',
  purple: 'bg-purple-100 text-purple-800',
}

export function Badge({ children, variant = 'blue', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}

const contratVariants: Record<TypeContrat, BadgeVariant> = {
  CDI: 'green',
  CDD: 'blue',
  'Intérim': 'yellow',
  Stage: 'purple',
  Alternance: 'purple',
  'Bénévolat': 'gray',
}

export function BadgeContrat({ type }: { type: TypeContrat }) {
  return <Badge variant={contratVariants[type]}>{type}</Badge>
}

const candidatureVariants: Record<StatutCandidature, BadgeVariant> = {
  envoyee: 'blue',
  vue: 'yellow',
  preselectionee: 'purple',
  transmise: 'green',
  refusee: 'red',
  acceptee: 'green',
}

const candidatureLabels: Record<StatutCandidature, string> = {
  envoyee: 'Envoyée',
  vue: 'Vue',
  preselectionee: 'Présélectionnée',
  transmise: 'Transmise',
  refusee: 'Refusée',
  acceptee: 'Acceptée',
}

export function BadgeCandidature({ statut }: { statut: StatutCandidature }) {
  return <Badge variant={candidatureVariants[statut]}>{candidatureLabels[statut]}</Badge>
}
