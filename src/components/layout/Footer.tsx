import Link from 'next/link'
import { Lightbulb } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Launch', href: '/launch' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/about' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
  Connect: [
    { label: 'Twitter / X', href: 'https://twitter.com/ideaparkhq' },
    { label: 'Instagram', href: 'https://instagram.com/ideaparkhq' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/ideaparkhq' },
    { label: 'TikTok', href: 'https://tiktok.com/@ideaparkhq' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Idea<span className="text-blue-400">Park</span>
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed">
              The world&apos;s first AI execution engine. Turn ideas into businesses.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white/70 mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/30 hover:text-blue-400 transition-colors duration-200"
                      {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.06] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/20">
            © {new Date().getFullYear()} IdeaPark. All rights reserved.
          </p>
          <p className="text-sm text-white/20">
            Everyone has ideas. We build them. ⚡
          </p>
        </div>
      </div>
    </footer>
  )
}
