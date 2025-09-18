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
            isVisible('header') ? 'animate-fade-in' : 'opacity-100'
          }`}
        >
          Privacy Policy
        </h1>
        
        <div 
          ref={setSectionRef('content')}
          className={`prose prose-neutral dark:prose-invert max-w-none space-y-8 transition-all duration-700 ${
            isVisible('content') ? 'animate-fade-in' : 'opacity-100'
          }`}
        >
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
            <p>This Privacy Policy explains how information is handled on this website. We are committed to protecting your privacy and being transparent about our data practices.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Do NOT Collect</h2>
            <p>We do not collect IP addresses or any personally identifiable information from our users. Our platform operates without tracking or storing user identification data.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Website Functionality</h2>
            <p>This website is fully functional and operational. All features, forms, and services work as intended to provide users with our token creation and trading services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Contact Information</h2>
            <p>For questions about this Privacy Policy, contact:</p>
            <div className="bg-muted p-4 rounded">
              <p>Privacy Officer<br/>
              Moonova LLC<br/>
              Email: privacy@moonova.com</p>
            </div>
          </section>

          <div className="bg-muted p-6 rounded-lg mt-8">
            <p className="text-sm text-muted-foreground">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy