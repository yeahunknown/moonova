import Navigation from "@/components/Navigation";
import { useFadeInAnimation } from "@/hooks/useFadeInAnimation";

const Privacy = () => {
  const { setSectionRef, isVisible } = useFadeInAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 
          ref={setSectionRef('header')}
          className={`text-4xl font-bold mb-8 text-foreground transition-all duration-700 ${
            isVisible('header') ? 'animate-fade-in' : 'opacity-0 translate-y-10'
          }`}
        >
          Privacy Policy
        </h1>
        
        <div 
          ref={setSectionRef('content')}
          className={`prose prose-neutral dark:prose-invert max-w-none space-y-8 transition-all duration-700 ${
            isVisible('content') ? 'animate-fade-in' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-destructive mb-4">DEMONSTRATION PRIVACY POLICY</h2>
            <p className="text-sm font-medium">
              THIS IS A DEMO WEBSITE. NO ACTUAL DATA COLLECTION, PROCESSING, OR STORAGE OCCURS. 
              THIS PRIVACY POLICY IS FOR DEMONSTRATION PURPOSES ONLY. DO NOT ENTER REAL PERSONAL 
              INFORMATION ON THIS SITE.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
            <p>This Privacy Policy explains how information is handled on this demonstration website. Since this is a non-functional demo platform created for visual and educational purposes only, no actual data collection or processing occurs.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Demo Website Disclaimer</h2>
            <p><strong>IMPORTANT:</strong> This website is a demonstration platform only. Any forms, input fields, or apparent data collection mechanisms are:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Non-functional visual mockups</li>
              <li>Not connected to any databases or storage systems</li>
              <li>Unable to process or retain actual information</li>
              <li>Designed purely for demonstration purposes</li>
            </ul>
            <p className="mt-4 font-semibold text-destructive">DO NOT ENTER REAL PERSONAL, FINANCIAL, OR SENSITIVE INFORMATION.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Information We Do NOT Collect</h2>
            <p>Since this is a demonstration website, we do NOT collect, process, store, or have access to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal identification information (names, addresses, phone numbers)</li>
              <li>Email addresses or contact information</li>
              <li>Financial information (credit cards, bank accounts, crypto wallets)</li>
              <li>Biometric or identity verification data</li>
              <li>Location or tracking data</li>
              <li>Browsing history or behavioral analytics</li>
              <li>Cookies for tracking purposes</li>
              <li>Device information or technical specifications</li>
              <li>Communication logs or messages</li>
              <li>Any user-generated content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Cookies and Tracking</h2>
            <p>This demonstration website may use minimal technical cookies solely for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Basic website functionality and navigation</li>
              <li>Remembering theme preferences (dark/light mode)</li>
              <li>Session management for demo purposes</li>
            </ul>
            <p className="mt-4">We do NOT use cookies for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>User tracking or profiling</li>
              <li>Advertising or marketing purposes</li>
              <li>Analytics or data collection</li>
              <li>Cross-site tracking</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
            <p>Any apparent integrations with third-party services (payment processors, blockchain networks, analytics platforms) are:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Non-functional visual representations</li>
              <li>Not actually connected to real services</li>
              <li>Unable to transmit data to external systems</li>
              <li>Included only for demonstration purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <p>Since no actual data is collected or stored:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>There are no databases to secure</li>
              <li>No encryption of user data is necessary</li>
              <li>No data breaches are possible</li>
              <li>No personal information is at risk</li>
            </ul>
            <p className="mt-4 font-semibold">However, we still recommend never entering real personal information on demonstration websites.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. User Rights</h2>
            <p>Since no personal data is collected, traditional data protection rights (access, rectification, erasure, portability) do not apply. However, users have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Understand the demo nature of this website</li>
              <li>Not be misled about data collection practices</li>
              <li>Contact us with questions about this policy</li>
              <li>Report any concerns about the demo website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p>This demonstration website is not directed at children under 13. Since no data is collected, there are no specific children's privacy concerns. However, we recommend parental supervision when children access any demonstration websites.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. International Users</h2>
            <p>This demo website may be accessed globally. Since no data processing occurs, international data transfer regulations do not apply. This includes compliance considerations for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>GDPR (European Union)</li>
              <li>CCPA (California)</li>
              <li>PIPEDA (Canada)</li>
              <li>Other regional privacy laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p>Since this is a demonstration website, this privacy policy may be updated to reflect changes in demo functionality or legal requirements. Any updates will be posted on this page with a new "last updated" date.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Legal Compliance</h2>
            <p>While this is a demo website, we acknowledge the importance of privacy laws including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>General Data Protection Regulation (GDPR)</li>
              <li>California Consumer Privacy Act (CCPA)</li>
              <li>Children's Online Privacy Protection Act (COPPA)</li>
              <li>Health Insurance Portability and Accountability Act (HIPAA)</li>
              <li>Other applicable privacy regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
            <p>For questions about this Privacy Policy or the demo website, contact:</p>
            <div className="bg-muted p-4 rounded">
              <p>Privacy Officer (Demo Contact)<br/>
              Moonova LLC<br/>
              Email: privacy@moonova.demo<br/>
              <em className="text-sm text-muted-foreground">Note: This is a demonstration email address and is not monitored.</em></p>
            </div>
          </section>

          <div className="bg-muted p-6 rounded-lg mt-8">
            <p className="text-sm text-muted-foreground">
              Last updated: January 2025<br/>
              This is a demonstration privacy policy for a demo website. No actual data collection or processing occurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy