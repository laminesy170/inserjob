import { useEffect, useState } from 'react'

interface WidgetOffre {
  id: string
  titre: string
  type_contrat: string
  ville: string
}

interface WidgetProps {
  token: string
  maxOffres?: number
  couleurPrimaire?: string
}

export function InserJobWidget({ token, maxOffres = 10, couleurPrimaire = '#2E86DE' }: WidgetProps) {
  const [offres, setOffres] = useState<WidgetOffre[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/offres?statut=eq.publiee&limit=${maxOffres}&select=id,titre,type_contrat,ville&order=created_at.desc`, {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    })
      .then(r => r.json())
      .then(data => { setOffres(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token, maxOffres])

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Chargement des offres...</div>

  return (
    <div style={{ fontFamily: '-apple-system, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem',
      }}>
        {offres.map((offre) => (
          <div
            key={offre.id}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1rem',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <span style={{
              display: 'inline-block',
              background: `${couleurPrimaire}15`,
              color: couleurPrimaire,
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '8px',
            }}>
              {offre.type_contrat}
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', margin: '0 0 4px' }}>
              {offre.titre}
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 12px' }}>
              {offre.ville}
            </p>
            <a
              href={`${window.location.origin}/offres/${offre.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: couleurPrimaire,
                color: '#fff',
                padding: '6px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Voir l'offre
            </a>
          </div>
        ))}
      </div>
      <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '1rem' }}>
        Powered by <a href="https://inserjob.fr" style={{ color: couleurPrimaire, textDecoration: 'none' }}>InserJob</a>
      </p>
    </div>
  )
}
