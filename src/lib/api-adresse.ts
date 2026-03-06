import type { AdresseResult } from '@/types'

export async function rechercherAdresse(query: string): Promise<AdresseResult[]> {
  if (query.length < 3) return []

  const res = await fetch(
    `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`
  )

  if (!res.ok) return []

  const data = await res.json()
  return (data.features ?? []).map((f: Record<string, unknown>) => {
    const props = f.properties as Record<string, string>
    const geom = f.geometry as { coordinates: number[] }
    return {
      label: props.label,
      ville: props.city,
      codePostal: props.postcode,
      lat: geom.coordinates[1],
      lon: geom.coordinates[0],
    }
  })
}
