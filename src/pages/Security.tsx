import Navigation from "@/components/Navigation"

const Security = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Security Information</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-destructive mb-4">DEMO SECURITY NOTICE</h2>
            <p className="text-sm font-medium">
              THIS IS A DEMONSTRATION WEBSITE WITH NO ACTUAL SECURITY INFRASTRUCTURE. 
              NO REAL TRANSACTIONS, DATA STORAGE, OR FINANCIAL OPERATIONS OCCUR. 
              ANY SECURITY FEATURES DISPLAYED ARE VISUAL MOCKUPS ONLY.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Demo Platform Security Disclaimer</h2>
            <p><strong>CRITICAL NOTICE:</strong> This website is a non-functional demonstration platform. Any security features, protocols, or safeguards mentioned or displayed are:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Visual representations only</li>
              <li>Not implemented or operational</li>
              <li>Cannot protect real data or transactions</li>
              <li>Designed solely for demonstration purposes</li>
            </ul>
            <p className="mt-4 font-semibold text-destructive">DO NOT RELY ON ANY APPARENT SECURITY MEASURES FOR REAL DATA PROTECTION.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. No Actual Security Infrastructure</h2>
            <p>This demonstration website does NOT provide:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of user data (no data is collected)</li>
              <li>Secure authentication systems</li>
              <li>Protected database storage</li>
              <li>Secure payment processing</li>
              <li>Blockchain security protocols</li>
              <li>Multi-factor authentication</li>
              <li>Intrusion detection systems</li>
              <li>Data backup and recovery</li>
              <li>Compliance with security standards</li>
              <li>Protection against cyber threats</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Financial Security Disclaimer</h2>
            <p><strong>NO FINANCIAL SECURITY EXISTS</strong> because no financial services are provided. This demo does NOT:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process real payments or transactions</li>
              <li>Store credit card or banking information</li>
              <li>Connect to actual payment processors</li>
              <li>Implement PCI DSS compliance</li>
              <li>Provide cryptocurrency wallet security</li>
              <li>Offer fraud protection or monitoring</li>
              <li>Maintain financial audit trails</li>
              <li>Comply with financial regulations (PCI, SOX, etc.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Blockchain Security Notice</h2>
            <p>Any references to blockchain or cryptocurrency security are purely demonstrative. This website does NOT:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Connect to actual blockchain networks</li>
              <li>Implement smart contract security</li>
              <li>Provide private key protection</li>
              <li>Offer wallet security features</li>
              <li>Implement consensus mechanisms</li>
              <li>Provide transaction validation</li>
              <li>Offer decentralized security protocols</li>
              <li>Protect against blockchain-specific attacks</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. User Account Security</h2>
            <p>Since no real user accounts exist on this demo:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>No password requirements or policies apply</li>
              <li>No account lockout mechanisms exist</li>
              <li>No session management security is implemented</li>
              <li>No access control measures are functional</li>
              <li>No user permission systems operate</li>
              <li>No account recovery processes exist</li>
            </ul>
            <p className="mt-4 font-semibold">Never use real passwords or credentials on this demo site.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Protection Measures (Non-Existent)</h2>
            <p>Since no data is collected or stored, the following security measures do NOT exist:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Data encryption at rest or in transit</li>
              <li>Access logging and monitoring</li>
              <li>Data loss prevention systems</li>
              <li>Backup and disaster recovery</li>
              <li>Database security controls</li>
              <li>Network security monitoring</li>
              <li>Vulnerability assessments</li>
              <li>Security incident response procedures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Compliance and Certifications</h2>
            <p>This demonstration website is NOT:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>SOC 2 Type II certified</li>
              <li>ISO 27001 compliant</li>
              <li>PCI DSS compliant</li>
              <li>FIPS 140-2 validated</li>
              <li>GDPR compliant (no data processing)</li>
              <li>HIPAA compliant</li>
              <li>Subject to financial regulatory oversight</li>
              <li>Audited by third-party security firms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Vulnerability Reporting</h2>
            <p>While this is a demo website, we acknowledge the importance of security in real applications. If you discover any issues with this demonstration:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Remember that no real data or systems are at risk</li>
              <li>Contact us for educational purposes only</li>
              <li>Do not attempt to exploit or abuse the demo</li>
              <li>Respect the demonstrative nature of the platform</li>
            </ul>
            <div className="bg-muted p-4 rounded mt-4">
              <p>Demo Security Contact: security@moonova.demo<br/>
              <em className="text-sm text-muted-foreground">Note: This is not a monitored security contact as this is a demo.</em></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Third-Party Security</h2>
            <p>Any apparent integrations with third-party security services are non-functional demonstrations that do NOT provide:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Real security scanning or monitoring</li>
              <li>Actual threat detection</li>
              <li>Live security updates or patches</li>
              <li>Authentic security certifications</li>
              <li>Working security APIs or connections</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. User Responsibilities</h2>
            <p>Users of this demonstration website should:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Never enter real personal or financial information</li>
              <li>Understand this is a non-functional demo</li>
              <li>Not rely on any apparent security features</li>
              <li>Use appropriate caution with any demo websites</li>
              <li>Maintain their own device and browser security</li>
              <li>Report any misunderstandings about the demo nature</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Security Best Practices (For Real Applications)</h2>
            <p>While this demo lacks security features, real applications should implement:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>End-to-end encryption for sensitive data</li>
              <li>Multi-factor authentication systems</li>
              <li>Regular security audits and penetration testing</li>
              <li>Secure coding practices and code reviews</li>
              <li>Incident response and disaster recovery plans</li>
              <li>Employee security training and awareness</li>
              <li>Compliance with relevant security standards</li>
              <li>Regular security updates and patch management</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Legal and Regulatory Considerations</h2>
            <p>In real applications (not this demo), security must address:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Financial services regulations (if applicable)</li>
              <li>Data protection laws (GDPR, CCPA, etc.)</li>
              <li>Industry-specific compliance requirements</li>
              <li>Cross-border data transfer restrictions</li>
              <li>Consumer protection regulations</li>
              <li>Cybersecurity framework requirements</li>
            </ul>
          </section>

          <div className="bg-muted p-6 rounded-lg mt-8">
            <p className="text-sm text-muted-foreground">
              Last updated: January 2025<br/>
              This security information applies to a demonstration website only. No actual security measures are implemented or operational.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Security