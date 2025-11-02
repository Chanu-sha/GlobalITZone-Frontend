import React from "react";
import {
  Shield,
  Lock,
  User,
  Globe,
  Database,
  Bell,
  FileText,
  ShieldCheck
} from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-gray-300">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 mx-auto text-red-400 mb-4 animate-bounce" />
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-red-400 to-white pb-3">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            At <span className="text-red-400 font-semibold">Global IT Zone</span>, we value your trust.  
            This Privacy Policy explains how we collect, use, and protect your information.
          </p>
          <div className="mt-8 h-1 w-32 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <div className="space-y-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* 1. Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-3">
              <Globe className="text-red-400 w-6 h-6" /> 1. Introduction
            </h2>
            <p className="text-gray-400 leading-relaxed">
              This Privacy Policy applies to all users of the Global IT Zone mobile and web applications.  
              By using our platform, you agree to the collection and use of information as described below.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-3">
              <User className="text-orange-400 w-6 h-6" /> 2. Information We Collect
            </h2>
            <p className="text-gray-400 leading-relaxed">
              We collect the following types of information when you interact with our platform:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-3 space-y-1">
              <li>Personal details such as your name, email address, and phone number.</li>
              <li>Account credentials used for login and authentication.</li>
              <li>Pre-booking and payment-related data (transaction IDs, timestamps, etc.).</li>
              <li>Device and usage data like browser type, IP address, and session logs.</li>
            </ul>
          </section>

          {/* 3. How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-3">
              <Database className="text-yellow-400 w-6 h-6" /> 3. How We Use Your Information
            </h2>
            <p className="text-gray-400 leading-relaxed">
              The data we collect helps us to:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-3 space-y-1">
              <li>Process and confirm your pre-bookings efficiently.</li>
              <li>Notify you about new products, updates, or offers.</li>
              <li>Enhance user experience and improve app performance.</li>
              <li>Ensure platform security and prevent fraudulent activities.</li>
            </ul>
          </section>

          {/* 4. Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-3">
              <Lock className="text-blue-400 w-6 h-6" /> 4. Data Security
            </h2>
            <p className="text-gray-400 leading-relaxed">
              We use industry-standard encryption and secure servers to protect your data from
              unauthorized access, alteration, or disclosure. However, no method of transmission
              over the Internet is 100% secure, and users share information at their own risk.
            </p>
          </section>

          {/* 5. Cookies & Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-3">
              <Bell className="text-green-400 w-6 h-6" /> 5. Cookies & Tracking
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Global IT Zone may use cookies or similar tracking technologies to enhance user
              experience, remember preferences, and collect analytics data. You can manage
              cookie preferences in your browser settings.
            </p>
          </section>

          {/* 6. Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-3">
              <ShieldCheck className="text-teal-400 w-6 h-6" /> 6. Third-Party Services
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Our app may use third-party services (like payment gateways or analytics tools)
              that have their own privacy policies. We recommend reviewing those policies to
              understand how your information is handled.
            </p>
          </section>

          {/* 7. User Rights */}
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-3">
              <FileText className="text-purple-400 w-6 h-6" /> 7. Your Rights
            </h2>
            <p className="text-gray-400 leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-3 space-y-1">
              <li>Access and update your personal information.</li>
              <li>Request deletion of your account or data (where legally permitted).</li>
              <li>Opt-out of marketing communications anytime.</li>
            </ul>
          </section>

          {/* 8. Policy Updates */}
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-3">
              <FileText className="text-orange-400 w-6 h-6" /> 8. Updates to This Policy
            </h2>
            <p className="text-gray-400 leading-relaxed">
              We may update this Privacy Policy periodically to reflect new practices or
              legal requirements. Any changes will be posted on this page with the updated date.
            </p>
          </section>

          {/* 9. Contact Us */}
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-3">
              <User className="text-red-400 w-6 h-6" /> 9. Contact Us
            </h2>
            <p className="text-gray-400 leading-relaxed">
              If you have any questions or concerns regarding this Privacy Policy, please
              contact us at:  
              <span className="block text-white font-semibold mt-2">
                support@globalitzone.com
              </span>
            </p>
          </section>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-white/10 mt-12">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Global IT Zone. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
