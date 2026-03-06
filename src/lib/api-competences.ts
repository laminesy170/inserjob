import type { CompetenceResult } from '@/types'

export async function rechercherCompetences(
  query: string,
  langue = 'fr'
): Promise<CompetenceResult[]> {
  if (query.length < 2) return []

  try {
    const res = await fetch(
      `https://ec.europa.eu/esco/api/search?text=${encodeURIComponent(query)}&type=skill&language=${langue}&full=false`
    )

    if (!res.ok) return []

    const data = await res.json()
    return (
      data._embedded?.results?.map((r: Record<string, string>) => ({
        uri: r.uri,
        titre: r.title,
        type: r.className,
      })) ?? []
    )
  } catch {
    return []
  }
}
