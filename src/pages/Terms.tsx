import Navigation from "@/components/Navigation"

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Terms of Service</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-destructive mb-4">IMPORTANT DISCLAIMER</h2>
            <p className="text-sm font-medium">
              THIS WEBSITE IS A DEMONSTRATION PLATFORM FOR VISUAL AND EDUCATIONAL PURPOSES ONLY. 
              NO ACTUAL SERVICES, TOKENS, OR FINANCIAL INSTRUMENTS ARE PROVIDED. ANY APPARENT 
              FUNCTIONALITY IS SIMULATED AND NON-OPERATIONAL.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using this website ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Demo Platform Disclaimer</h2>
            <p><strong>THIS IS A DEMONSTRATION WEBSITE ONLY.</strong> This platform is designed solely for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Visual demonstration of user interface concepts</li>
              <li>Educational purposes regarding cryptocurrency and token creation interfaces</li>
              <li>Portfolio showcase of web development capabilities</li>
              <li>Design and user experience testing</li>
            </ul>
            <p className="mt-4"><strong>NO ACTUAL SERVICES ARE PROVIDED.</strong> Any forms, buttons, payment interfaces, or transaction simulations are non-functional mockups that do not connect to real blockchain networks, payment processors, or financial systems.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. No Financial Services</h2>
            <p>This website does NOT:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create, mint, or deploy actual cryptocurrency tokens</li>
              <li>Process real payments or financial transactions</li>
              <li>Provide investment advice or financial services</li>
              <li>Facilitate actual trading or exchange of digital assets</li>
              <li>Store, manage, or secure real cryptocurrency wallets</li>
              <li>Connect to any live blockchain networks</li>
              <li>Offer legal financial instruments or securities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. No Warranties or Guarantees</h2>
            <p>We provide this demonstration website "as is" without any express or implied warranties, including but not limited to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Warranties of merchantability or fitness for a particular purpose</li>
              <li>Guarantees of accuracy, completeness, or reliability</li>
              <li>Promises of uninterrupted or error-free service</li>
              <li>Security or protection of any data entered</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
            <p>Under no circumstances shall Moonova LLC, its officers, directors, employees, or agents be liable for any direct, indirect, punitive, incidental, special, or consequential damages arising from:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use or inability to use this demonstration website</li>
              <li>Any perceived loss of data, time, or opportunity</li>
              <li>Reliance on information presented on this demo site</li>
              <li>Technical failures or interruptions</li>
              <li>Any misunderstanding regarding the nature of this demo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p>All content, design, graphics, and code on this website are the property of Moonova LLC and are protected by copyright and other intellectual property laws. This content is provided for demonstration purposes only.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. User Conduct</h2>
            <p>Users agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Attempt to exploit or abuse the demonstration features</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Use this demo to mislead others about actual services</li>
              <li>Input sensitive or personal information</li>
              <li>Attempt to circumvent security measures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Third-Party Content</h2>
            <p>Any third-party content, links, or references are included for demonstration purposes only and do not constitute endorsements. We are not responsible for the content or practices of external sites.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Modifications</h2>
            <p>We reserve the right to modify these terms at any time without notice. Continued use of the demo website constitutes acceptance of any changes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of Delaware, United States, without regard to conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
            <p>For questions about these Terms of Service, please contact us at legal@moonova.demo (Note: This is a demonstration email and is not monitored).</p>
          </section>

          <div className="bg-muted p-6 rounded-lg mt-8">
            <p className="text-sm text-muted-foreground">
              Last updated: January 2025<br/>
              This is a demonstration document for a demo website. No actual legal obligations are created.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terms