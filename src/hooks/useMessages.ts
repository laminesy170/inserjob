import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Message } from '@/types'

export function useMessages(userId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = useCallback(async () => {
    if (!userId) return
    setLoading(true)

    const { data } = await supabase
      .from('messages')
      .select('*, expediteur:profiles!expediteur_id(*), destinataire:profiles!destinataire_id(*)')
      .or(`expediteur_id.eq.${userId},destinataire_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    setMessages((data ?? []) as Message[])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  return { messages, loading, refetch: fetchMessages }
}

export function useConversation(userId: string | undefined, otherUserId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const fetchConversation = useCallback(async () => {
    if (!userId) return
    setLoading(true)

    const { data } = await supabase
      .from('messages')
      .select('*, expediteur:profiles!expediteur_id(*)')
      .or(
        `and(expediteur_id.eq.${userId},destinataire_id.eq.${otherUserId}),and(expediteur_id.eq.${otherUserId},destinataire_id.eq.${userId})`
      )
      .order('created_at', { ascending: true })

    setMessages((data ?? []) as Message[])
    setLoading(false)

    // Mark as read
    await supabase
      .from('messages')
      .update({ lu: true })
      .eq('destinataire_id', userId)
      .eq('expediteur_id', otherUserId)
      .eq('lu', false)
  }, [userId, otherUserId])

  useEffect(() => {
    fetchConversation()
  }, [fetchConversation])

  return { messages, loading, refetch: fetchConversation }
}

export async function envoyerMessage(
  expediteurId: string,
  destinataireId: string,
  contenu: string,
  offreId?: string,
  candidatureId?: string
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      expediteur_id: expediteurId,
      destinataire_id: destinataireId,
      contenu,
      offre_id: offreId,
      candidature_id: candidatureId,
    })
    .select()
    .single()

  return { data: data as Message | null, error }
}
