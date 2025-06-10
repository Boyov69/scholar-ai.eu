import React from 'react';
import { Helmet } from 'react-helmet-async';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Helmet>
        <title>Cookie Policy - Scholar-AI</title>
        <meta name="description" content="Scholar-AI Cookie Policy - Learn how we use cookies" />
      </Helmet>
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h1 className="text-4xl font-bold text-white mb-8">Cookie Policy</h1>
            <p className="text-gray-300 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="space-y-6 text-gray-200">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">What are Cookies?</h2>
                <p>
                  Cookies are small text files stored on your device when you visit our website. 
                  They help us provide you with a better experience and understand how you use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Types of Cookies We Use</h2>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">🔒 Essential Cookies</h3>
                    <p className="text-sm">
                      Required for the platform to function properly. These cookies enable core functionality 
                      such as security, authentication, and accessibility. Cannot be disabled.
                    </p>
                    <ul className="mt-2 text-sm list-disc list-inside text-gray-300">
                      <li>Authentication tokens</li>
                      <li>Session management</li>
                      <li>Security preferences</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">📊 Analytics Cookies</h3>
                    <p className="text-sm">
                      Help us understand how you use Scholar-AI to improve our services. These cookies 
                      collect anonymous information about your interactions with our platform.
                    </p>
                    <ul className="mt-2 text-sm list-disc list-inside text-gray-300">
                      <li>Page views and navigation patterns</li>
                      <li>Feature usage statistics</li>
                      <li>Performance metrics</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">⚙️ Functional Cookies</h3>
                    <p className="text-sm">
                      Remember your preferences and settings to provide a personalized experience.
                    </p>
                    <ul className="mt-2 text-sm list-disc list-inside text-gray-300">
                      <li>Language preferences</li>
                      <li>Theme settings (dark/light mode)</li>
                      <li>Research preferences</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">🎯 Marketing Cookies</h3>
                    <p className="text-sm">
                      Used to deliver relevant advertisements and track the effectiveness of our marketing campaigns.
                    </p>
                    <ul className="mt-2 text-sm list-disc list-inside text-gray-300">
                      <li>Ad personalization</li>
                      <li>Campaign tracking</li>
                      <li>Conversion tracking</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Cookie Duration</h2>
                <div className="space-y-2">
                  <p><strong>Session Cookies:</strong> Deleted when you close your browser</p>
                  <p><strong>Persistent Cookies:</strong> Remain on your device for a set period (up to 1 year)</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Managing Cookies</h2>
                <p className="mb-4">
                  You can control cookies through:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Cookie Banner:</strong> Choose your preferences when you first visit our site</li>
                  <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies</li>
                  <li><strong>Platform Settings:</strong> Manage your preferences in your Scholar-AI account settings</li>
                </ul>
                <p className="mt-4 text-sm text-gray-400">
                  Note: Disabling certain cookies may limit platform functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Cookies</h2>
                <p>
                  We use services from third parties that may set their own cookies:
                </p>
                <ul className="mt-2 list-disc list-inside">
                  <li>Google Analytics (analytics)</li>
                  <li>Stripe (payment processing)</li>
                  <li>Supabase (authentication)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Updates to This Policy</h2>
                <p>
                  We may update this Cookie Policy from time to time. We will notify you of any 
                  significant changes through our platform or via email.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
                <p>
                  If you have questions about our use of cookies, please contact us at:
                  <br />
                  <br />
                  Email: privacy@scholarai.eu
                  <br />
                  Website: www.scholarai.eu
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;