import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { EmptyState } from '@/components/UI/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { useMessages, envoyerMessage, useConversation } from '@/hooks/useMessages'
import type { Message, Profile } from '@/types'

function ConversationList({
  messages,
  userId,
  onSelectConversation,
}: {
  messages: Message[]
  userId: string
  onSelectConversation: (otherUser: Profile) => void
}) {
  // Group messages by conversation partner
  const conversations = new Map<string, { profile: Profile; lastMessage: Message; unread: number }>()

  for (const msg of messages) {
    const otherId = msg.expediteur_id === userId ? msg.destinataire_id : msg.expediteur_id
    const otherProfile = msg.expediteur_id === userId ? msg.destinataire : msg.expediteur

    if (!otherProfile) continue

    const existing = conversations.get(otherId)
    if (!existing || new Date(msg.created_at) > new Date(existing.lastMessage.created_at)) {
      conversations.set(otherId, {
        profile: otherProfile,
        lastMessage: msg,
        unread: (existing?.unread ?? 0) + (!msg.lu && msg.destinataire_id === userId ? 1 : 0),
      })
    }
  }

  if (conversations.size === 0) {
    return <EmptyState title="Aucun message" description="Vos conversations apparaîtront ici" />
  }

  return (
    <div className="space-y-2">
      {Array.from(conversations.values()).map(({ profile, lastMessage, unread }) => (
        <Card
          key={profile.id}
          className="p-3 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelectConversation(profile)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-700 font-medium text-sm">
                {(profile.prenom?.[0] ?? '').toUpperCase()}{(profile.nom?.[0] ?? '').toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {profile.prenom} {profile.nom}
                </p>
                <time className="text-xs text-gray-400">
                  {new Date(lastMessage.created_at).toLocaleDateString('fr-FR')}
                </time>
              </div>
              <p className="text-xs text-gray-500 truncate">{lastMessage.contenu}</p>
            </div>
            {unread > 0 && (
              <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                {unread}
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}

function ConversationView({
  userId,
  otherUser,
  onBack,
}: {
  userId: string
  otherUser: Profile
  onBack: () => void
}) {
  const { messages, refetch } = useConversation(userId, otherUser.id)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async (e: FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    setSending(true)

    const { error } = await envoyerMessage(userId, otherUser.id, newMessage.trim())
    if (!error) {
      setNewMessage('')
      refetch()
    }
    setSending(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <button onClick={onBack} className="text-sm text-primary-500 hover:text-primary-700">
          Retour
        </button>
        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span className="text-primary-700 font-medium text-xs">
            {(otherUser.prenom?.[0] ?? '').toUpperCase()}{(otherUser.nom?.[0] ?? '').toUpperCase()}
          </span>
        </div>
        <p className="font-medium text-gray-900 text-sm">{otherUser.prenom} {otherUser.nom}</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.expediteur_id === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                msg.expediteur_id === userId
                  ? 'bg-primary-500 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-900 rounded-bl-md'
              }`}
            >
              <p>{msg.contenu}</p>
              <time className={`text-[10px] mt-1 block ${
                msg.expediteur_id === userId ? 'text-primary-200' : 'text-gray-400'
              }`}>
                {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </time>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 pt-3 border-t border-gray-100">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez un message..."
          className="flex-1 rounded-full border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500"
          aria-label="Message"
        />
        <Button type="submit" loading={sending} className="rounded-full" aria-label="Envoyer">
          <Send size={18} aria-hidden="true" />
        </Button>
      </form>
    </div>
  )
}

export function MessagesPage() {
  const { user } = useAuth()
  const { messages, loading } = useMessages(user?.id)
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)

  if (!user) return null

  if (selectedUser) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <ConversationView
          userId={user.id}
          otherUser={selectedUser}
          onBack={() => setSelectedUser(null)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : (
        <ConversationList
          messages={messages}
          userId={user.id}
          onSelectConversation={setSelectedUser}
        />
      )}
    </div>
  )
}
