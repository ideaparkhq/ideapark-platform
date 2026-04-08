'use client'

import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

export default function PrivacyPage() {
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
              <Shield className="w-3.5 h-3.5" />
              Legal
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Privacy Policy</h1>
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
          className="prose-dark space-y-8"
        >
          <section>
            <p className="text-dark-300 leading-relaxed">
              IdeaPark (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the IdeaPark platform at ideaparkhq.com 
              (the &quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you use our Service. By accessing or using the Service, you agree to this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <h3 className="text-lg font-medium text-white mb-2">1.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li><span className="text-white font-medium">Account Information:</span> Name, email address, and password when you create an account.</li>
              <li><span className="text-white font-medium">Profile Information:</span> Bio, skills, interests, avatar, and role preferences you choose to share.</li>
              <li><span className="text-white font-medium">Content:</span> Ideas, messages, comments, upvotes, and other content you post or share on the platform.</li>
              <li><span className="text-white font-medium">Payment Information:</span> Billing address and payment details processed securely through Stripe. We do not store your full card number.</li>
              <li><span className="text-white font-medium">Communications:</span> Messages you send to other users through our platform and communications with our support team.</li>
            </ul>

            <h3 className="text-lg font-medium text-white mb-2 mt-4">1.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li><span className="text-white font-medium">Usage Data:</span> Pages visited, features used, time spent, clicks, and navigation patterns.</li>
              <li><span className="text-white font-medium">Device Information:</span> Browser type, operating system, device type, screen resolution, and language preferences.</li>
              <li><span className="text-white font-medium">Log Data:</span> IP address, access times, referring URLs, and error logs.</li>
              <li><span className="text-white font-medium">Cookies and Similar Technologies:</span> As described in our <Link href="/cookies" className="text-brand-400 hover:underline">Cookie Policy</Link>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p className="text-dark-300 mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li>Provide, maintain, and improve the Service</li>
              <li>Create and manage your account</li>
              <li>Match idea holders with builders based on skills, interests, and preferences</li>
              <li>Process payments and manage subscriptions</li>
              <li>Provide AI-powered features including idea validation and business plan generation</li>
              <li>Calculate trust scores based on platform activity and collaboration history</li>
              <li>Send transactional emails (account verification, password resets, subscription updates)</li>
              <li>Send optional marketing communications (with your consent, which you can withdraw at any time)</li>
              <li>Detect, prevent, and address fraud, abuse, and technical issues</li>
              <li>Analyze usage patterns to improve the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Third-Party Services</h2>
            <p className="text-dark-300 mb-3">We use the following third-party services to operate the platform:</p>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li><span className="text-white font-medium">Supabase:</span> Database hosting, authentication, and real-time data infrastructure. Supabase processes your account data and content. <Link href="https://supabase.com/privacy" className="text-brand-400 hover:underline">Supabase Privacy Policy</Link></li>
              <li><span className="text-white font-medium">Stripe:</span> Payment processing for subscriptions and product purchases. Stripe processes your payment information. <Link href="https://stripe.com/privacy" className="text-brand-400 hover:underline">Stripe Privacy Policy</Link></li>
              <li><span className="text-white font-medium">OpenAI:</span> AI-powered features including idea validation and business plan generation. Prompts you submit to AI tools are sent to OpenAI for processing. We do not share your personal information with OpenAI. <Link href="https://openai.com/privacy" className="text-brand-400 hover:underline">OpenAI Privacy Policy</Link></li>
              <li><span className="text-white font-medium">Vercel:</span> Application hosting and deployment infrastructure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Data Sharing and Disclosure</h2>
            <p className="text-dark-300 mb-3">We do not sell your personal information. We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li><span className="text-white font-medium">Public Profile:</span> Your name, bio, skills, trust score, and public ideas are visible to other users.</li>
              <li><span className="text-white font-medium">NDA-Gated Content:</span> Idea details marked as NDA-gated are only shared with users who accept the NDA agreement.</li>
              <li><span className="text-white font-medium">Service Providers:</span> Third-party services listed above that help us operate the platform.</li>
              <li><span className="text-white font-medium">Legal Requirements:</span> When required by law, regulation, legal process, or governmental request.</li>
              <li><span className="text-white font-medium">Business Transfers:</span> In connection with a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Data Retention</h2>
            <p className="text-dark-300">
              We retain your personal information for as long as your account is active or as needed to provide the Service. 
              When you delete your account, we will delete or anonymize your personal information within 30 days, except where 
              retention is required by law or for legitimate business purposes (such as resolving disputes or enforcing agreements).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Data Security</h2>
            <p className="text-dark-300">
              We implement industry-standard security measures to protect your information, including encryption in transit (TLS) 
              and at rest, secure authentication protocols, and regular security audits. However, no method of transmission over 
              the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Your Rights</h2>
            <p className="text-dark-300 mb-3">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li><span className="text-white font-medium">Access:</span> Request a copy of the personal information we hold about you.</li>
              <li><span className="text-white font-medium">Correction:</span> Request correction of inaccurate or incomplete information.</li>
              <li><span className="text-white font-medium">Deletion:</span> Request deletion of your personal information.</li>
              <li><span className="text-white font-medium">Portability:</span> Request a machine-readable copy of your data.</li>
              <li><span className="text-white font-medium">Objection:</span> Object to processing of your personal information for certain purposes.</li>
              <li><span className="text-white font-medium">Withdraw Consent:</span> Withdraw consent where processing is based on consent.</li>
            </ul>
            <p className="text-dark-300 mt-3">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:legal@ideaparkhq.com" className="text-brand-400 hover:underline">legal@ideaparkhq.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Children&apos;s Privacy</h2>
            <p className="text-dark-300">
              The Service is not intended for individuals under the age of 16. We do not knowingly collect personal 
              information from children under 16. If we become aware that we have collected such information, we will 
              take steps to delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. International Data Transfers</h2>
            <p className="text-dark-300">
              Your information may be transferred to and processed in countries other than your country of residence. 
              These countries may have data protection laws that are different from the laws of your country. We take 
              appropriate safeguards to ensure that your information remains protected in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Changes to This Policy</h2>
            <p className="text-dark-300">
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting 
              the updated policy on this page and updating the &quot;Effective Date&quot; at the top. Your continued use of the 
              Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Contact Us</h2>
            <p className="text-dark-300">
              If you have questions about this Privacy Policy or our data practices, contact us at:
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
            <Link href="/terms" className="text-sm text-brand-400 hover:underline">Terms of Service</Link>
            <Link href="/cookies" className="text-sm text-brand-400 hover:underline">Cookie Policy</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
