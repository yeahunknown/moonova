import Navigation from "@/components/Navigation";
import { useFadeInAnimation } from "@/hooks/useFadeInAnimation";

const Security = () => {
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
          Security Information
        </h1>
        
        <div 
          ref={setSectionRef('content')}
          className={`prose prose-neutral dark:prose-invert max-w-none space-y-8 transition-all duration-700 ${
            isVisible('content') ? 'animate-fade-in' : 'opacity-100'
          }`}
        >
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Our Security Commitment</h2>
            <p>We are committed to maintaining the highest standards of security to protect our users and their data. Our security measures are designed to ensure the safety and integrity of all platform operations.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Data Protection</h2>
            <p>Our platform implements industry-standard security practices:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>End-to-end encryption for all sensitive data</li>
              <li>Secure data transmission using TLS/SSL protocols</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Secure backup and disaster recovery procedures</li>
              <li>Access controls and permission management</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Financial Security</h2>
            <p>For all financial operations, we maintain:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>PCI DSS compliance for payment processing</li>
              <li>Secure integration with trusted payment processors</li>
              <li>Fraud detection and prevention systems</li>
              <li>Transaction monitoring and audit trails</li>
              <li>Multi-signature wallet security for cryptocurrency operations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. User Account Security</h2>
            <p>We protect user accounts through:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Strong password requirements and policies</li>
              <li>Multi-factor authentication options</li>
              <li>Session management and timeout controls</li>
              <li>Account lockout protection against brute force attacks</li>
              <li>Secure password recovery processes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Infrastructure Security</h2>
            <p>Our technical infrastructure includes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Network security monitoring and intrusion detection</li>
              <li>Regular security updates and patch management</li>
              <li>Secure hosting with enterprise-grade protection</li>
              <li>DDoS protection and load balancing</li>
              <li>Automated threat detection and response</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Compliance and Certifications</h2>
            <p>We maintain compliance with relevant security standards and regulations:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>SOC 2 Type II security controls</li>
              <li>ISO 27001 information security management</li>
              <li>GDPR compliance for data protection</li>
              <li>Regular third-party security assessments</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Incident Response</h2>
            <p>In the event of any security concerns, we have:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>24/7 security monitoring and response team</li>
              <li>Established incident response procedures</li>
              <li>Transparent communication with affected users</li>
              <li>Continuous improvement of security measures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Reporting Security Issues</h2>
            <p>If you discover any security vulnerabilities or have concerns, please contact us immediately:</p>
            <div className="bg-muted p-4 rounded">
              <p>Security Team<br/>
              Moonova LLC<br/>
              Email: security@moonova.com<br/>
              Response time: 24 hours for critical issues</p>
            </div>
          </section>

          <div className="bg-muted p-6 rounded-lg mt-8">
            <p className="text-sm text-muted-foreground">
              Last updated: January 2025<br/>
              Our security practices are continuously updated to address emerging threats and maintain the highest standards of protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Security