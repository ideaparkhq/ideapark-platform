'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lightbulb, LayoutDashboard, Search, MessageSquare, Sparkles,
  Store, Settings, Menu, X, LogOut, User, CreditCard, ChevronDown,
  Zap
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/ideas', label: 'Ideas', icon: Search },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/ai', label: 'AI Assistant', icon: Sparkles },
  { href: '/store', label: 'Store', icon: Store },
]

export function Navbar() {
  const { user, loading } = useUser()
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isLandingPage = pathname === '/'

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300',
      isLandingPage
        ? 'bg-dark-950/80 backdrop-blur-xl border-transparent'
        : 'bg-dark-950/95 backdrop-blur-xl border-dark-800'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-brand-500/25 transition-all">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Idea<span className="text-brand-400">Park</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-brand-600/10 text-brand-400'
                        : 'text-dark-400 hover:text-white hover:bg-dark-800'
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                    {link.href === '/messages' && (
                      <span className="w-2 h-2 rounded-full bg-brand-500" />
                    )}
                  </Link>
                )
              })}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* AI Credits */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-800 border border-dark-700">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-medium text-dark-200">{user.ai_credits}</span>
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-dark-800 transition-colors"
                  >
                    <Avatar
                      src={user.avatar_url}
                      name={user.name || user.email}
                      size="sm"
                      foundingMember={user.is_founding_member}
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-dark-400 hidden sm:block" />
                  </button>

                  <AnimatePresence>
                    {profileMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setProfileMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-56 rounded-xl border border-dark-800 bg-dark-950 shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-dark-800">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-dark-400 truncate">{user.email}</p>
                            {user.is_founding_member && (
                              <Badge variant="brand" className="mt-1">⭐ Founding Member</Badge>
                            )}
                          </div>
                          <div className="py-1">
                            <Link
                              href={`/profile/${user.id}`}
                              onClick={() => setProfileMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-dark-300 hover:bg-dark-800 hover:text-white transition-colors"
                            >
                              <User className="w-4 h-4" />
                              Your Profile
                            </Link>
                            <Link
                              href="/settings/billing"
                              onClick={() => setProfileMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-dark-300 hover:bg-dark-800 hover:text-white transition-colors"
                            >
                              <CreditCard className="w-4 h-4" />
                              Billing
                            </Link>
                            <Link
                              href="/settings/billing"
                              onClick={() => setProfileMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-dark-300 hover:bg-dark-800 hover:text-white transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                              Settings
                            </Link>
                          </div>
                          <div className="border-t border-dark-800 py-1">
                            <button
                              onClick={handleSignOut}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-dark-800 w-full transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              !loading && (
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Log In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </div>
              )
            )}

            {/* Mobile menu button */}
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-dark-400 hover:bg-dark-800 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-dark-800 bg-dark-950"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive ? 'bg-brand-600/10 text-brand-400' : 'text-dark-400 hover:text-white hover:bg-dark-800'
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
