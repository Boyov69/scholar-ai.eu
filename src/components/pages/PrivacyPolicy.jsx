import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Helmet>
        <title>Privacy Policy - Scholar-AI</title>
        <meta name="description" content="Scholar-AI Privacy Policy - GDPR Compliant" />
      </Helmet>
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
            <p className="text-gray-300 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="space-y-8 text-gray-200">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Data Controller</h2>
                <p>
                  Scholar-AI ("we", "our", or "us") is the data controller for the personal 
                  information collected through our platform. We are committed to protecting 
                  your privacy and complying with the General Data Protection Regulation (GDPR).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Account Information:</strong> Email, name, academic affiliation</li>
                  <li><strong>Research Data:</strong> Queries, citations, workspace content</li>
                  <li><strong>Usage Data:</strong> Platform interactions, performance metrics</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Legal Basis for Processing</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Contract Performance:</strong> Providing our research platform services</li>
                  <li><strong>Legitimate Interests:</strong> Platform improvement and analytics</li>
                  <li><strong>Consent:</strong> Marketing communications (opt-in basis)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Your Rights Under GDPR</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Right of Access:</strong> Request copies of your personal data</li>
                  <li><strong>Right to Rectification:</strong> Correct inaccurate personal data</li>
                  <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Right to Data Portability:</strong> Receive your data in machine-readable format</li>
                  <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Data Retention</h2>
                <p>
                  We retain personal data only as long as necessary for the purposes outlined 
                  in this policy. Account data is retained while your account is active. 
                  Research data is retained according to your workspace settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect 
                  your personal data against unauthorized access, alteration, disclosure, or 
                  destruction. This includes encryption, access controls, and regular security audits.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. International Data Transfers</h2>
                <p>
                  Your data may be transferred to and processed in countries outside the European 
                  Economic Area (EEA). We ensure appropriate safeguards are in place for such 
                  transfers in compliance with GDPR requirements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Information</h2>
                <p>
                  For privacy-related questions or to exercise your rights, contact us at:
                  <br />
                  <br />
                  Email: privacy@scholarai.eu
                  <br />
                  Data Protection Officer: dpo@scholarai.eu
                  <br />
                  Address: Scholar-AI B.V., Amsterdam, Netherlands
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Complaints</h2>
                <p>
                  If you have concerns about how we handle your personal data, you have the right 
                  to lodge a complaint with your local data protection authority. In the Netherlands, 
                  this is the Autoriteit Persoonsgegevens.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;