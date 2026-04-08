'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lightbulb, LayoutDashboard, Rocket, Menu, X, LogOut,
  CreditCard, ChevronDown, Zap
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home', icon: Lightbulb },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pricing', label: 'Pricing', icon: CreditCard },
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
  const isBusinessPage = pathname.startsWith('/b/')

  if (isBusinessPage) return null

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      isLandingPage
        ? 'bg-black/60 backdrop-blur-2xl border-b border-white/[0.04]'
        : 'bg-black/80 backdrop-blur-2xl border-b border-white/[0.06]'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Idea<span className="text-blue-400">Park</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {user && navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
            {!user && !loading && (
              <Link
                href="/pricing"
                className="px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
              >
                Pricing
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Launch CTA */}
                <Link
                  href="/launch"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02]"
                >
                  <Rocket className="w-4 h-4" />
                  Launch Idea
                </Link>

                {/* Credits */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-medium text-white/70">{user.credits}</span>
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-white/5 transition-colors"
                  >
                    <Avatar
                      src={user.avatar_url}
                      name={user.name || user.email}
                      size="sm"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-white/40 hidden sm:block" />
                  </button>

                  <AnimatePresence>
                    {profileMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setProfileMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-gray-950 shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-white/10">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-white/40 truncate">{user.email}</p>
                            <p className="text-xs text-blue-400 mt-1 capitalize">{user.plan} Plan</p>
                          </div>
                          <div className="py-1">
                            <Link
                              href="/dashboard"
                              onClick={() => setProfileMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              Dashboard
                            </Link>
                            <Link
                              href="/settings/billing"
                              onClick={() => setProfileMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <CreditCard className="w-4 h-4" />
                              Billing
                            </Link>
                          </div>
                          <div className="border-t border-white/10 py-1">
                            <button
                              onClick={handleSignOut}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 w-full transition-colors"
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
                  <Link
                    href="/login"
                    className="px-3 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/launch"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02]"
                  >
                    Launch Idea →
                  </Link>
                </div>
              )
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white/40 hover:bg-white/5 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/[0.06] bg-black/95 backdrop-blur-2xl"
          >
            <div className="px-4 py-4 space-y-1">
              {user ? (
                <>
                  {navLinks.map((link) => {
                    const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                          isActive ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
                        )}
                      >
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </Link>
                    )
                  })}
                  <Link
                    href="/launch"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-blue-400 hover:bg-white/5 transition-colors"
                  >
                    <Rocket className="w-4 h-4" />
                    Launch Idea
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/pricing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/launch"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-blue-400 hover:bg-white/5 transition-colors"
                  >
                    <Rocket className="w-4 h-4" />
                    Launch Idea →
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
