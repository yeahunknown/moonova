
import Navigation from "@/components/Navigation";
import { useFadeInAnimation } from "@/hooks/useFadeInAnimation";

const Terms = () => {
  const { setSectionRef, isVisible } = useFadeInAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 
          ref={setSectionRef('header')}
          className={`text-4xl font-bold mb-8 text-foreground transition-all duration-700 ${
            isVisible('header') ? 'animate-fade-in' : 'opacity-100'
          }`}
        >
          Terms of Service
        </h1>
        
        <div 
          ref={setSectionRef('content')}
          className={`prose prose-neutral dark:prose-invert max-w-none space-y-8 transition-all duration-700 ${
            isVisible('content') ? 'animate-fade-in' : 'opacity-100'
          }`}
        >
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-destructive mb-4">CRITICAL DISCLAIMER</h2>
            <p className="text-sm font-medium">
              BY USING THIS PLATFORM, YOU ACKNOWLEDGE AND ACCEPT ALL RISKS ASSOCIATED WITH TOKEN 
              CREATION AND BLOCKCHAIN TRANSACTIONS. NO REFUNDS WILL BE PROVIDED UNDER ANY CIRCUMSTANCES. 
              MOONOVA LLC DISCLAIMS ALL LIABILITY FOR FAILED TOKEN LAUNCHES, TECHNICAL ISSUES, OR ANY DAMAGES.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance and Binding Agreement</h2>
            <p>By accessing, using, or paying for any services on this platform ("Service"), you irrevocably accept and agree to be legally bound by all terms, conditions, disclaimers, and limitations set forth herein. Your use constitutes your electronic signature and binding acceptance. If you do not agree to ALL terms without exception, you are prohibited from using this Service and must immediately cease all access.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Platform Services</h2>
            <p>Moonova LLC operates a blockchain token creation and launch platform. Our services include but are not limited to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Token creation and deployment to blockchain networks</li>
              <li>Liquidity pool creation and management tools</li>
              <li>Token marketing and promotional services</li>
              <li>Trading interface and portfolio management</li>
              <li>Technical infrastructure for token operations</li>
            </ul>
            <p className="mt-4 font-bold">IMPORTANT: Payment does not guarantee successful token launch or functionality. Technical failures, blockchain network issues, user error, or market conditions may prevent or impair token deployment.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. No Refunds Policy</h2>
            <p className="font-bold text-destructive">ABSOLUTE NO REFUNDS POLICY:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>ALL payments are final and non-refundable under any circumstances</li>
              <li>No refunds for failed token launches, technical issues, or user dissatisfaction</li>
              <li>No refunds for changes in market conditions or regulatory environment</li>
              <li>No refunds for blockchain network failures or congestion</li>
              <li>No refunds for user error, including incorrect parameters or wallet issues</li>
              <li>No refunds for third-party service failures or interruptions</li>
              <li>No refunds due to loss of private keys or wallet access</li>
              <li>No chargebacks or payment disputes will be honored</li>
            </ul>
            <p className="mt-4">By proceeding with payment, you waive all rights to refunds, chargebacks, or payment reversals.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Complete Limitation of Liability</h2>
            <p className="font-bold">MOONOVA LLC, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, CONTRACTORS, AND AFFILIATES SHALL NOT BE LIABLE FOR:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Failed token launches or deployments for any reason</li>
              <li>Loss of funds, tokens, or digital assets</li>
              <li>Market losses, trading losses, or investment losses</li>
              <li>Technical failures, bugs, or system downtime</li>
              <li>Blockchain network issues, congestion, or failures</li>
              <li>Regulatory changes affecting token operations</li>
              <li>Third-party service failures or security breaches</li>
              <li>User errors, including incorrect wallet addresses or parameters</li>
              <li>Loss of private keys or wallet access</li>
              <li>Any direct, indirect, incidental, special, consequential, or punitive damages</li>
              <li>Lost profits, business interruption, or opportunity costs</li>
              <li>Data loss, corruption, or unauthorized access</li>
            </ul>
            <p className="mt-4">Total liability, if any, shall not exceed $1 USD regardless of the amount paid or damages claimed.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. User Responsibilities and Risks</h2>
            <p>You acknowledge and accept that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cryptocurrency and token operations involve substantial risk of loss</li>
              <li>You are solely responsible for all decisions and their consequences</li>
              <li>You must comply with all applicable laws and regulations</li>
              <li>You are responsible for your own wallet security and private key management</li>
              <li>Market conditions may result in token failure or loss of value</li>
              <li>Technical knowledge is required for safe blockchain operations</li>
              <li>No guarantee of token functionality, marketability, or value retention</li>
              <li>Platform availability is not guaranteed and may be interrupted</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Service Availability Disclaimer</h2>
            <p>Services are provided "AS IS" and "AS AVAILABLE" without any warranties:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>No guarantee of continuous, uninterrupted, or error-free operation</li>
              <li>No warranty of merchantability or fitness for particular purpose</li>
              <li>No guarantee that services will meet your requirements</li>
              <li>Platform may be unavailable due to maintenance, updates, or technical issues</li>
              <li>Third-party dependencies may affect service availability</li>
              <li>Blockchain network congestion may prevent or delay operations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Indemnification</h2>
            <p>You agree to indemnify, defend, and hold harmless Moonova LLC and all associated parties from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your use of the platform or services</li>
              <li>Your violation of these terms</li>
              <li>Your violation of any law or regulation</li>
              <li>Your token creation or trading activities</li>
              <li>Any third-party claims related to your tokens or activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Jurisdiction and Governing Law</h2>
            <p>These terms are governed by the laws of the British Virgin Islands, excluding conflict of law principles. Any disputes shall be resolved exclusively through binding arbitration administered by the BVI International Arbitration Centre under BVI Arbitration Rules. The arbitration shall be conducted in English in the British Virgin Islands. You waive all rights to jury trial and class action proceedings.</p>
            <p className="mt-4">If BVI jurisdiction is unavailable, disputes shall be governed by Cayman Islands law with arbitration in the Cayman Islands. As a final alternative, Singapore law shall apply with SIAC arbitration in Singapore.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Legal Compliance and Restrictions</h2>
            <p>You represent and warrant that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You have legal capacity to enter into these terms</li>
              <li>You are not located in or a citizen of any restricted jurisdiction</li>
              <li>You will comply with all applicable laws and regulations</li>
              <li>You are not subject to economic sanctions or prohibited person lists</li>
              <li>Your use does not violate any court orders or legal restrictions</li>
              <li>You have obtained all necessary regulatory approvals if required</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Modification and Termination Rights</h2>
            <p>Moonova LLC reserves the absolute right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify these terms at any time without notice</li>
              <li>Terminate services or user access immediately without cause</li>
              <li>Refuse service to any person or entity</li>
              <li>Change pricing, features, or service availability</li>
              <li>Suspend operations for maintenance, legal, or business reasons</li>
            </ul>
            <p className="mt-4">Continued use after any changes constitutes acceptance of modified terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Severability and Enforceability</h2>
            <p>If any provision of these terms is deemed invalid or unenforceable, the remaining provisions shall remain in full force and effect. Invalid provisions shall be modified to the minimum extent necessary to make them enforceable while preserving their intended effect.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact and Legal Notices</h2>
            <p>For legal notices or disputes, contact: legal@moonova.com</p>
            <p className="mt-2">All notices must be in writing and delivered via registered mail or email with delivery confirmation. Notices are deemed received 48 hours after transmission.</p>
          </section>

          <div className="bg-muted p-6 rounded-lg mt-8">
            <p className="text-sm text-muted-foreground font-bold">
              Last updated: January 2025<br/>
              By using this platform, you acknowledge that you have read, understood, and agree to be bound by these terms in their entirety. No oral modifications or representations are binding.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terms
