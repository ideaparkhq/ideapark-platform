'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, MessageSquare, ArrowLeft, Search, Lock, ChevronLeft
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import type { Message, User } from '@/types'
import { formatRelativeTime, cn } from '@/lib/utils'

interface ConversationItem {
  other_user_id: string
  other_user_name: string
  other_user_avatar: string | null
  other_user_founding: boolean
  last_message_content: string
  last_message_at: string
  last_message_sender: string
  unread_count: number
}

export default function MessagesPage() {
  const searchParams = useSearchParams()
  const { user, loading: userLoading } = useUser()
  const supabase = createClient()

  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedPartner, setSelectedPartner] = useState<string | null>(
    searchParams.get('to') || null
  )
  const [partnerProfile, setPartnerProfile] = useState<User | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileList, setShowMobileList] = useState(!searchParams.get('to'))
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!user) return
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()
      if (res.ok) {
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Fetch messages for selected partner
  const fetchMessages = useCallback(async () => {
    if (!user || !selectedPartner) return
    try {
      const res = await fetch(`/api/messages?partner=${selectedPartner}`)
      const data = await res.json()
      if (res.ok) {
        setMessages(data.messages || [])
        setTimeout(scrollToBottom, 100)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }, [user, selectedPartner])

  // Fetch partner profile
  const fetchPartnerProfile = useCallback(async () => {
    if (!selectedPartner) return
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', selectedPartner)
      .single()
    setPartnerProfile(data)
  }, [selectedPartner])

  useEffect(() => {
    if (user) fetchConversations()
  }, [user, fetchConversations])

  useEffect(() => {
    if (selectedPartner) {
      fetchMessages()
      fetchPartnerProfile()
      setShowMobileList(false)
    }
  }, [selectedPartner, fetchMessages, fetchPartnerProfile])

  // Real-time messages subscription
  useEffect(() => {
    if (!user || !selectedPartner) return

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user!.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          if (
            newMsg.sender_id === selectedPartner ||
            newMsg.receiver_id === selectedPartner
          ) {
            setMessages((prev) => [...prev, newMsg])
            setTimeout(scrollToBottom, 100)

            // Mark as read
            supabase
              .from('messages')
              .update({ read: true })
              .eq('id', newMsg.id)
              .then()
          }
          fetchConversations()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, selectedPartner])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedPartner || !user || sending) return

    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiver_id: selectedPartner,
          content: newMessage.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        // Show upgrade prompt for free users
        if (res.status === 403) {
          // Don't use toast here, show inline
        }
        return
      }

      setMessages((prev) => [...prev, data])
      setNewMessage('')
      setTimeout(scrollToBottom, 100)
      fetchConversations()
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  const selectConversation = (partnerId: string) => {
    setSelectedPartner(partnerId)
  }

  const filteredConversations = conversations.filter(
    (c) => c.other_user_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (userLoading) return <PageLoader />

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <EmptyState
          icon={<Lock className="w-12 h-12" />}
          title="Sign in to access messages"
          description="You need an account to send and receive messages."
          action={
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          }
        />
      </div>
    )
  }

  if (user.plan === 'free') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <EmptyState
          icon={<Lock className="w-12 h-12" />}
          title="Messaging requires Basic plan or higher"
          description="Upgrade your plan to connect directly with idea holders and builders."
          action={
            <Link href="/settings/billing">
              <Button>Upgrade Plan</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversation List */}
      <div
        className={cn(
          'w-full md:w-80 lg:w-96 border-r border-dark-800 flex flex-col bg-dark-950',
          !showMobileList ? 'hidden md:flex' : ''
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-dark-800">
          <h1 className="text-xl font-bold text-white mb-3">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-dark-700 bg-dark-900 text-sm text-white placeholder-dark-500 focus:border-brand-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full w-6 h-6 border-2 border-dark-700 border-t-brand-500" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <MessageSquare className="w-10 h-10 text-dark-600 mx-auto mb-3" />
              <p className="text-dark-400 text-sm">No conversations yet</p>
              <p className="text-dark-500 text-xs mt-1">
                Apply to ideas or message builders to start chatting
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.other_user_id}
                onClick={() => selectConversation(conv.other_user_id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-900 transition-colors text-left',
                  selectedPartner === conv.other_user_id ? 'bg-dark-900 border-l-2 border-brand-500' : ''
                )}
              >
                <Avatar
                  src={conv.other_user_avatar}
                  name={conv.other_user_name || 'User'}
                  size="md"
                  foundingMember={conv.other_user_founding}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white truncate">
                      {conv.other_user_name || 'User'}
                    </span>
                    <span className="text-xs text-dark-500 flex-shrink-0">
                      {conv.last_message_at && formatRelativeTime(conv.last_message_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-dark-400 truncate flex-1">
                      {conv.last_message_sender === user!.id && (
                        <span className="text-dark-500">You: </span>
                      )}
                      {conv.last_message_content || 'No messages yet'}
                    </p>
                    {conv.unread_count > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-medium">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div
        className={cn(
          'flex-1 flex flex-col bg-dark-950',
          showMobileList ? 'hidden md:flex' : ''
        )}
      >
        {selectedPartner && partnerProfile ? (
          <>
            {/* Thread Header */}
            <div className="px-4 py-3 border-b border-dark-800 flex items-center gap-3">
              <button
                onClick={() => { setShowMobileList(true); setSelectedPartner(null) }}
                className="md:hidden p-1 text-dark-400 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <Link href={`/profile/${partnerProfile.id}`} className="flex items-center gap-3 group">
                <Avatar
                  src={partnerProfile.avatar_url}
                  name={partnerProfile.name}
                  size="sm"
                  foundingMember={partnerProfile.is_founding_member}
                />
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-brand-400 transition-colors">
                    {partnerProfile.name}
                  </p>
                  <p className="text-xs text-dark-500 capitalize">{partnerProfile.role.replace('_', ' ')}</p>
                </div>
              </Link>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-dark-400 text-sm">
                    No messages yet. Start the conversation.
                  </p>
                </div>
              )}
              {messages.map((msg, i) => {
                const isOwn = msg.sender_id === user!.id
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
                        isOwn
                          ? 'bg-brand-600 text-white rounded-br-md'
                          : 'bg-dark-800 text-dark-200 rounded-bl-md'
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      <p className={cn(
                        'text-xs mt-1',
                        isOwn ? 'text-brand-200' : 'text-dark-500'
                      )}>
                        {formatRelativeTime(msg.created_at)}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="px-4 py-3 border-t border-dark-800 flex items-center gap-3"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-dark-700 bg-dark-900 px-4 py-2.5 text-sm text-white placeholder-dark-500 focus:border-brand-500 focus:outline-none transition-all"
                maxLength={2000}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!newMessage.trim() || sending}
                loading={sending}
                className="rounded-xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-dark-600 mx-auto mb-3" />
              <p className="text-dark-400">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
