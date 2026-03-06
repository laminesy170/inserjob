import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Offre, TypeContrat } from '@/types'

interface OffresFilters {
  search?: string
  typeContrat?: TypeContrat | ''
  ville?: string
}

export function useOffresPubliques(filters: OffresFilters = {}) {
  const [offres, setOffres] = useState<Offre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOffres = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('offres')
      .select('*')
      .eq('statut', 'publiee')
      .order('created_at', { ascending: false })

    if (filters.typeContrat) {
      query = query.eq('type_contrat', filters.typeContrat)
    }
    if (filters.ville) {
      query = query.ilike('ville', `%${filters.ville}%`)
    }
    if (filters.search) {
      query = query.or(`titre.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    const { data, error: err } = await query

    if (err) {
      setError(err.message)
    } else {
      setOffres((data ?? []) as Offre[])
    }
    setLoading(false)
  }, [filters.search, filters.typeContrat, filters.ville])

  useEffect(() => {
    fetchOffres()
  }, [fetchOffres])

  return { offres, loading, error, refetch: fetchOffres }
}

export function useOffreDetail(id: string | undefined) {
  const [offre, setOffre] = useState<Offre | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    supabase
      .from('offres')
      .select('*, structure:structures(*)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setOffre(data as Offre | null)
        setLoading(false)
      })
  }, [id])

  return { offre, loading }
}

export function useOffresGestionnaire(structureId: string | undefined | null) {
  const [offres, setOffres] = useState<Offre[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOffres = useCallback(async () => {
    if (!structureId) return
    setLoading(true)

    const { data } = await supabase
      .from('offres')
      .select('*, entreprise:entreprises(*)')
      .eq('structure_id', structureId)
      .order('created_at', { ascending: false })

    setOffres((data ?? []) as Offre[])
    setLoading(false)
  }, [structureId])

  useEffect(() => {
    fetchOffres()
  }, [fetchOffres])

  return { offres, loading, refetch: fetchOffres }
}
