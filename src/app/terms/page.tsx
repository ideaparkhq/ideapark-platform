'use client'
import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

export default function TermsPage() {
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
              <FileText className="w-3.5 h-3.5" />
              Legal
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Terms of Service</h1>
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
              Welcome to IdeaPark. These Terms of Service (&quot;Terms&quot;) govern your access to and use of the 
              IdeaPark platform at ideaparkhq.com (the &quot;Service&quot;), operated by IdeaPark (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). 
              By creating an account or using the Service, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Account Registration</h2>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li>You must be at least 16 years old to create an account.</li>
              <li>You must provide accurate, current, and complete information during registration.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>You may not create multiple accounts, impersonate others, or use a false identity.</li>
              <li>You must notify us immediately of any unauthorized use of your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Acceptable Use</h2>
            <p className="text-dark-300 mb-3">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li>Post content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.</li>
              <li>Use the Service to spam, phish, or send unsolicited communications.</li>
              <li>Upload malware, viruses, or other harmful code.</li>
              <li>Attempt to gain unauthorized access to other users&apos; accounts or our systems.</li>
              <li>Scrape, crawl, or use automated tools to extract data from the Service without permission.</li>
              <li>Interfere with or disrupt the Service or its infrastructure.</li>
              <li>Use the Service for any purpose that violates applicable law.</li>
              <li>Circumvent or manipulate trust scores, matching algorithms, or other platform systems.</li>
              <li>Post ideas or content primarily for the purpose of advertising or commercial promotion unrelated to collaboration.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Intellectual Property</h2>
            <h3 className="text-lg font-medium text-white mb-2">3.1 Your Content</h3>
            <p className="text-dark-300 mb-3">
              You retain ownership of the ideas, content, and intellectual property you post on IdeaPark. By posting 
              content, you grant us a non-exclusive, worldwide, royalty-free license to display, distribute, and promote 
              your content within the Service for the purpose of operating and improving the platform.
            </p>
            <h3 className="text-lg font-medium text-white mb-2">3.2 NDA-Gated Content</h3>
            <p className="text-dark-300 mb-3">
              Content marked as NDA-gated is subject to the NDA agreement between you and the accessing user. IdeaPark 
              facilitates NDA agreements but is not a party to them. We are not responsible for enforcing NDA terms 
              between users.
            </p>
            <h3 className="text-lg font-medium text-white mb-2">3.3 IdeaPark IP</h3>
            <p className="text-dark-300">
              The Service, including its design, features, code, and branding, is owned by IdeaPark and protected by 
              intellectual property laws. You may not copy, modify, distribute, or create derivative works based on the 
              Service without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Subscriptions and Payments</h2>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li>IdeaPark offers free and paid subscription plans. Paid plans are billed monthly through Stripe.</li>
              <li>Subscription fees are non-refundable except as required by applicable law.</li>
              <li>You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period.</li>
              <li>We reserve the right to change pricing with 30 days&apos; notice. Existing subscribers will be notified before price changes apply to their accounts.</li>
              <li>AI credit packs are one-time purchases and do not expire. Credits are non-transferable and non-refundable.</li>
              <li>Founding Member benefits are subject to the terms in effect at the time of enrollment and remain valid as long as your account is active.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. AI-Powered Features</h2>
            <p className="text-dark-300 mb-3">
              IdeaPark provides AI-powered features including idea validation and business plan generation. By using these features:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li>You acknowledge that AI-generated content is provided for informational purposes only and does not constitute professional advice.</li>
              <li>You understand that AI outputs may contain errors and should be verified independently.</li>
              <li>You retain ownership of any AI-generated content produced from your inputs.</li>
              <li>Your inputs may be processed by third-party AI providers (currently OpenAI) as described in our Privacy Policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Trust Scores and Matching</h2>
            <p className="text-dark-300">
              Trust scores are calculated based on platform activity, collaboration history, and community feedback. 
              Trust scores are intended as a helpful signal, not a guarantee of reliability. We do not guarantee the 
              accuracy of trust scores or the quality of matches. You are responsible for conducting your own due 
              diligence before entering into any collaboration.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Limitation of Liability</h2>
            <p className="text-dark-300 mb-3">
              To the maximum extent permitted by applicable law:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li>The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied.</li>
              <li>We do not guarantee uninterrupted, secure, or error-free operation of the Service.</li>
              <li>We are not liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities.</li>
              <li>Our total liability to you for any claims arising from your use of the Service is limited to the amount you paid us in the 12 months preceding the claim.</li>
              <li>We are not responsible for the actions, content, or conduct of other users on the platform.</li>
              <li>We are not a party to any collaboration, agreement, or business relationship between users.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Indemnification</h2>
            <p className="text-dark-300">
              You agree to indemnify and hold harmless IdeaPark, its officers, directors, employees, and agents from any 
              claims, damages, losses, or expenses (including reasonable legal fees) arising from your use of the Service, 
              your violation of these Terms, or your violation of any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Termination</h2>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li>You may delete your account at any time through your account settings.</li>
              <li>We may suspend or terminate your account at our discretion if you violate these Terms or engage in conduct that is harmful to other users or the platform.</li>
              <li>Upon termination, your right to use the Service ceases immediately.</li>
              <li>We will delete or anonymize your personal data within 30 days of account deletion, except where retention is required by law.</li>
              <li>Sections relating to intellectual property, limitation of liability, indemnification, and dispute resolution survive termination.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Dispute Resolution</h2>
            <p className="text-dark-300">
              Any disputes arising from these Terms or your use of the Service will be resolved through binding 
              arbitration in accordance with the rules of the American Arbitration Association. You agree to waive 
              any right to participate in a class action lawsuit or class-wide arbitration. This arbitration clause 
              does not prevent you from filing a complaint with a government agency.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Changes to These Terms</h2>
            <p className="text-dark-300">
              We may update these Terms from time to time. Material changes will be communicated by email or a 
              prominent notice within the Service at least 30 days before they take effect. Your continued use 
              of the Service after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Contact</h2>
            <p className="text-dark-300">
              For questions about these Terms, contact us at:
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
            <Link href="/cookies" className="text-sm text-brand-400 hover:underline">Cookie Policy</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
