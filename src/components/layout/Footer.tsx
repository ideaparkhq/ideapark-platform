import Link from 'next/link'
import { Lightbulb } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Ideas', href: '/ideas' },
    { label: 'Store', href: '/store' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Partners', href: '/partners' },
    { label: 'Careers', href: '/about' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
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
    <footer className="border-t border-dark-800 bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Idea<span className="text-brand-400">Park</span>
              </span>
            </Link>
            <p className="text-sm text-dark-400 leading-relaxed">
              The execution layer for the world&apos;s ideas. Where ambitious people go to build.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-dark-400 hover:text-brand-400 transition-colors"
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

        <div className="border-t border-dark-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-dark-500">
            © {new Date().getFullYear()} IdeaPark. All rights reserved.
          </p>
          <p className="text-sm text-dark-600">
            Stop consuming. Start building. 🚀
          </p>
        </div>
      </div>
    </footer>
  )
}
