import React from "react";
import {
  ShieldCheck,
  FileText,
  CreditCard,
  Clock,
  Lock,
  AlertTriangle,
  CheckCircle,
  Globe
} from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-gray-300">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <ShieldCheck className="w-16 h-16 mx-auto text-red-400 mb-4 animate-bounce" />
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-red-400 to-white pb-3">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Welcome to <span className="text-red-400 font-semibold">Global IT Zone</span>.  
            Please read these terms carefully before making any pre-bookings.
          </p>
          <div className="mt-8 h-1 w-32 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 mx-auto rounded-full"></div>
        </div>

        {/* Terms Section */}
        <div className="space-y-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* 1. General */}
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-3">
              <Globe className="text-red-400 w-6 h-6" /> 1. General
            </h2>
            <p className="text-gray-400 leading-relaxed">
              By using the Global IT Zone application, you agree to comply with these Terms
              & Conditions. Our platform provides users the ability to pre-book upcoming and
              trending technology products before their official release or availability.
            </p>
          </section>

          {/* 2. Pre-Booking System */}
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-3">
              <Clock className="text-orange-400 w-6 h-6" /> 2. Pre-Booking System
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Global IT Zone allows users to reserve or pre-book technology products by paying
              an advance booking amount. This advance confirms your interest in the product but
              does not guarantee immediate availability or delivery through the app.
            </p>
          </section>

          {/* 3. Payment Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-3">
              <CreditCard className="text-yellow-400 w-6 h-6" /> 3. Payment Terms
            </h2>
            <p className="text-gray-400 leading-relaxed">
              All pre-bookings require advance payment via the listed payment methods.
              Payments made are considered booking confirmations. Users are advised to verify
              product details and availability before proceeding with payment.
            </p>
          </section>

          {/* 4. Confirmation & Availability */}
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-3">
              <CheckCircle className="text-green-400 w-6 h-6" /> 4. Confirmation & Availability
            </h2>
            <p className="text-gray-400 leading-relaxed">
              After successful payment, you will receive a confirmation message or email.
              Product allocation and availability depend on the manufacturer's or supplier’s
              release schedule. Global IT Zone does not handle shipping or delivery.
            </p>
          </section>

          {/* 5. Cancellation Policy */}
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-500 w-6 h-6" /> 5. Cancellation Policy
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Users can cancel their pre-booking before the final confirmation phase from the
              manufacturer or partner store. Once the product is locked for you, cancellation
              may not be possible. Refund policies (if applicable) depend on our partner’s
              terms and will be communicated case-by-case.
            </p>
          </section>

          {/* 6. Data Privacy & Security */}
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-3">
              <Lock className="text-blue-400 w-6 h-6" /> 6. Data Privacy & Security
            </h2>
            <p className="text-gray-400 leading-relaxed">
              We value your privacy. All personal information provided during registration or
              booking is securely stored and processed in accordance with our Privacy Policy.
              We do not share user data with third parties without consent.
            </p>
          </section>

          {/* 7. Platform Usage Rules */}
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-3">
              <FileText className="text-purple-400 w-6 h-6" /> 7. Platform Usage Rules
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Users must not misuse the Global IT Zone platform, including but not limited to
              creating fake accounts, making false pre-bookings, or attempting fraudulent
              payments. Such activities will result in immediate suspension and legal action.
            </p>
          </section>

          {/* 8. Modification of Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-3">
              <FileText className="text-orange-400 w-6 h-6" /> 8. Modification of Terms
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Global IT Zone reserves the right to modify or update these Terms & Conditions
              at any time without prior notice. Continued use of the platform after changes
              implies acceptance of the updated terms.
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

export default TermsAndConditions;
