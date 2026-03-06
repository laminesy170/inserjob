import type { EntrepriseSiret } from '@/types'

export async function getEntrepriseParSiret(siret: string): Promise<EntrepriseSiret | null> {
  const token = import.meta.env.VITE_INSEE_TOKEN as string
  if (!token) {
    console.warn('INSEE token not configured')
    return null
  }

  try {
    const res = await fetch(
      `https://api.insee.fr/entreprises/sirene/V3.11/siret/${siret}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (!res.ok) return null

    const data = await res.json()
    const etab = data.etablissement
    const unite = etab?.uniteLegale
    const adresse = etab?.adresseEtablissement

    return {
      nom: unite?.denominationUniteLegale ?? null,
      adresse: adresse?.libelleVoieEtablissement ?? null,
      ville: adresse?.libelleCommuneEtablissement ?? null,
      codePostal: adresse?.codePostalEtablissement ?? null,
      activite: unite?.activitePrincipaleUniteLegale ?? null,
    }
  } catch {
    return null
  }
}
