import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Candidature } from '@/types'

export function useMesCandidatures(userId: string | undefined) {
  const [candidatures, setCandidatures] = useState<Candidature[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCandidatures = useCallback(async () => {
    if (!userId) return
    setLoading(true)

    const { data } = await supabase
      .from('candidatures')
      .select('*, offre:offres(*)')
      .eq('candidat_id', userId)
      .order('created_at', { ascending: false })

    setCandidatures((data ?? []) as Candidature[])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchCandidatures()
  }, [fetchCandidatures])

  return { candidatures, loading, refetch: fetchCandidatures }
}

export function useCandidaturesGestionnaire(structureId: string | undefined | null) {
  const [candidatures, setCandidatures] = useState<Candidature[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCandidatures = useCallback(async () => {
    if (!structureId) return
    setLoading(true)

    const { data } = await supabase
      .from('candidatures')
      .select(`
        *,
        offre:offres!inner(*),
        candidat:candidats(*, profile:profiles(*))
      `)
      .eq('offre.structure_id', structureId)
      .order('created_at', { ascending: false })

    setCandidatures((data ?? []) as Candidature[])
    setLoading(false)
  }, [structureId])

  useEffect(() => {
    fetchCandidatures()
  }, [fetchCandidatures])

  return { candidatures, loading, refetch: fetchCandidatures }
}

export async function postuler(offreId: string, candidatId: string, cvUrl?: string, lettreMotivation?: string) {
  const { data, error } = await supabase
    .from('candidatures')
    .insert({
      offre_id: offreId,
      candidat_id: candidatId,
      cv_url: cvUrl,
      lettre_motivation: lettreMotivation,
    })
    .select()
    .single()

  return { data: data as Candidature | null, error }
}
