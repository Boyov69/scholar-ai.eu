import React, { useState } from 'react';
import CookieConsent from 'react-cookie-consent';
import Cookies from 'js-cookie';

const ScholarAICookieConsent = () => {
  const [showDetails, setShowDetails] = useState(false);

  const handleAccept = () => {
    // Set analytics cookies
    Cookies.set('analytics-enabled', 'true', { expires: 365 });
    Cookies.set('marketing-enabled', 'true', { expires: 365 });
    
    // Enable Google Analytics if you have it
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      });
    }
  };

  const handleDecline = () => {
    // Set only essential cookies
    Cookies.set('analytics-enabled', 'false', { expires: 365 });
    Cookies.set('marketing-enabled', 'false', { expires: 365 });
  };

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All Cookies"
      declineButtonText="Essential Only"
      enableDeclineButton
      onAccept={handleAccept}
      onDecline={handleDecline}
      cookieName="scholarai-gdpr-consent"
      style={{
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        borderRadius: "12px",
        margin: "20px",
        padding: "20px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}
      buttonStyle={{
        background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
        color: "#fff",
        fontSize: "14px",
        borderRadius: "8px",
        border: "none",
        padding: "12px 24px",
        fontWeight: "600",
        cursor: "pointer",
      }}
      declineButtonStyle={{
        background: "transparent",
        color: "#94A3B8",
        fontSize: "14px",
        borderRadius: "8px",
        border: "1px solid #475569",
        padding: "12px 24px",
        fontWeight: "500",
        cursor: "pointer",
        marginRight: "12px",
      }}
      contentStyle={{
        color: "#E2E8F0",
        fontSize: "14px",
        lineHeight: "1.6",
        marginBottom: "16px",
      }}
      expires={365}
    >
      <div className="flex flex-col space-y-3">
        <h3 className="text-lg font-semibold text-white">
          🍪 We value your privacy
        </h3>
        <p className="text-sm">
          Scholar-AI uses cookies to enhance your research experience, analyze platform usage, 
          and provide personalized academic recommendations. We comply with GDPR and respect 
          your data rights.
        </p>
        <div className="text-xs text-gray-400">
          <a href="/privacy-policy" className="underline hover:text-blue-400">
            Privacy Policy
          </a>
          {" | "}
          <a href="/cookie-policy" className="underline hover:text-blue-400">
            Cookie Policy
          </a>
          {" | "}
          <span className="cursor-pointer underline hover:text-blue-400" 
                onClick={() => setShowDetails(!showDetails)}>
            Customize Settings
          </span>
        </div>
      </div>
    </CookieConsent>
  );
};

export default ScholarAICookieConsent;