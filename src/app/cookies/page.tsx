'use client'
import { motion } from 'framer-motion'
import { Cookie } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

const cookieTypes = [
  {
    category: 'Essential Cookies',
    required: true,
    description: 'These cookies are strictly necessary for the Service to function. They enable core features like authentication, security, and account management. You cannot disable these cookies.',
    cookies: [
      { name: 'sb-access-token', purpose: 'Supabase authentication session', duration: '1 hour' },
      { name: 'sb-refresh-token', purpose: 'Supabase session refresh', duration: '7 days' },
      { name: '__stripe_mid', purpose: 'Stripe fraud prevention', duration: '1 year' },
      { name: '__stripe_sid', purpose: 'Stripe checkout session', duration: '30 minutes' },
      { name: 'cookie-consent', purpose: 'Stores your cookie preferences', duration: '1 year' },
    ],
  },
  {
    category: 'Analytics Cookies',
    required: false,
    description: 'These cookies help us understand how visitors interact with the Service. They collect aggregated, anonymized data about page views, feature usage, and navigation patterns to help us improve the platform.',
    cookies: [
      { name: '_ga', purpose: 'Google Analytics visitor identification', duration: '2 years' },
      { name: '_ga_*', purpose: 'Google Analytics session tracking', duration: '2 years' },
      { name: '_gid', purpose: 'Google Analytics daily visitor distinction', duration: '24 hours' },
    ],
  },
  {
    category: 'Preference Cookies',
    required: false,
    description: 'These cookies remember your settings and preferences to provide a more personalized experience. They store choices like theme preference, language, and display settings.',
    cookies: [
      { name: 'theme', purpose: 'Stores your theme preference (dark/light)', duration: '1 year' },
      { name: 'locale', purpose: 'Stores your language preference', duration: '1 year' },
      { name: 'sidebar-state', purpose: 'Remembers sidebar open/closed state', duration: '30 days' },
    ],
  },
]

export default function CookiesPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-dark-800 bg-dark-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Badge variant="default" size="md" className="mb-4 inline-flex items-center gap-2">
              <Cookie className="w-3.5 h-3.5" />
              Legal
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Cookie Policy</h1>
            <p className="mt-2 text-dark-400">Effective Date: April 1, 2026</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-8"
        >
          <section>
            <p className="text-dark-300 leading-relaxed">
              IdeaPark (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) uses cookies and similar technologies on our platform 
              at ideaparkhq.com (the &quot;Service&quot;). This Cookie Policy explains what cookies are, how we use them, 
              and how you can manage your preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">What Are Cookies?</h2>
            <p className="text-dark-300 leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They serve various 
              purposes including remembering your preferences, enabling features, and helping us understand 
              how the Service is used. Cookies can be &quot;session&quot; cookies (deleted when you close your browser) 
              or &quot;persistent&quot; cookies (remain on your device until they expire or you delete them).
            </p>
          </section>

          {/* Cookie Categories */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Cookies We Use</h2>
            <div className="space-y-6">
              {cookieTypes.map((type) => (
                <Card key={type.category} className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{type.category}</h3>
                    {type.required ? (
                      <Badge variant="warning" size="sm">Required</Badge>
                    ) : (
                      <Badge variant="default" size="sm">Optional</Badge>
                    )}
                  </div>
                  <p className="text-dark-400 text-sm mb-4 leading-relaxed">{type.description}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-dark-700">
                          <th className="text-left py-2 pr-4 text-dark-300 font-medium">Cookie</th>
                          <th className="text-left py-2 pr-4 text-dark-300 font-medium">Purpose</th>
                          <th className="text-left py-2 text-dark-300 font-medium">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {type.cookies.map((cookie) => (
                          <tr key={cookie.name} className="border-b border-dark-800 last:border-0">
                            <td className="py-2 pr-4 text-white font-mono text-xs">{cookie.name}</td>
                            <td className="py-2 pr-4 text-dark-400">{cookie.purpose}</td>
                            <td className="py-2 text-dark-400 whitespace-nowrap">{cookie.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">How to Manage Cookies</h2>
            <p className="text-dark-300 mb-4 leading-relaxed">
              You can control and manage cookies in several ways:
            </p>

            <div className="space-y-4">
              <Card className="p-5">
                <h3 className="text-base font-semibold text-white mb-2">Browser Settings</h3>
                <p className="text-dark-400 text-sm leading-relaxed">
                  Most browsers allow you to view, manage, and delete cookies through their settings. 
                  You can configure your browser to block all cookies, accept all cookies, or notify you 
                  when a cookie is set. Note that blocking essential cookies may prevent the Service from 
                  functioning properly.
                </p>
                <div className="mt-3 space-y-1 text-sm">
                  <p className="text-dark-400">
                    <span className="text-white">Chrome:</span> Settings → Privacy and security → Cookies
                  </p>
                  <p className="text-dark-400">
                    <span className="text-white">Firefox:</span> Settings → Privacy &amp; Security → Cookies
                  </p>
                  <p className="text-dark-400">
                    <span className="text-white">Safari:</span> Settings → Privacy → Manage Website Data
                  </p>
                  <p className="text-dark-400">
                    <span className="text-white">Edge:</span> Settings → Cookies and site permissions
                  </p>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-base font-semibold text-white mb-2">Opt-Out Tools</h3>
                <p className="text-dark-400 text-sm leading-relaxed">
                  For analytics cookies, you can opt out of Google Analytics by installing the{' '}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-400 hover:underline"
                  >
                    Google Analytics Opt-out Browser Add-on
                  </a>.
                </p>
              </Card>

              <Card className="p-5">
                <h3 className="text-base font-semibold text-white mb-2">Do Not Track</h3>
                <p className="text-dark-400 text-sm leading-relaxed">
                  Some browsers send a &quot;Do Not Track&quot; (DNT) signal. There is no universal standard for how 
                  websites should respond to DNT signals. We currently do not change our data collection 
                  practices in response to DNT signals, but we respect your browser&apos;s cookie settings.
                </p>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Updates to This Policy</h2>
            <p className="text-dark-300 leading-relaxed">
              We may update this Cookie Policy to reflect changes in our practices or for operational, legal, 
              or regulatory reasons. We will post the updated policy on this page and update the effective date. 
              Material changes will be communicated through a notice within the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact Us</h2>
            <p className="text-dark-300">
              For questions about our use of cookies, contact us at:
            </p>
            <div className="mt-3 p-4 rounded-xl bg-dark-900/50 border border-dark-800">
              <p className="text-dark-300">
                <span className="text-white font-medium">IdeaPark</span><br />
                Email:{' '}
                <a href="mailto:legal@ideaparkhq.com" className="text-brand-400 hover:underline">legal@ideaparkhq.com</a>
              </p>
            </div>
          </section>

          {/* Related Links */}
          <div className="pt-8 border-t border-dark-800 flex flex-wrap gap-4">
            <Link href="/privacy" className="text-sm text-brand-400 hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-brand-400 hover:underline">Terms of Service</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
