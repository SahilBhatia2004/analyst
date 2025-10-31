import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Crown, ArrowLeft } from 'lucide-react';

const UpgradePage = () => {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'premium',
      name: 'Premium',
      price: 1500,
      messages: 10,
      icon: Zap,
      color: 'from-blue-500 to-cyan-600',
      features: [
        'Advanced data analysis',
        'All file formats supported',
        'Interactive visualizations',
        'Priority support',
        'Custom themes',
        'Email notifications'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 2500,
      messages: 20,
      icon: Crown,
      color: 'from-purple-500 to-pink-600',
      popular: true,
      features: [
        'Everything in Premium',
        'Premium data analysis',
        'Unlimited file uploads',
        'Advanced visualizations',
        'Priority support',
        'All themes & customization',
        'Export capabilities',
        'API access'
      ]
    }
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 py-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Upgrade Your Plan
          </h1>
          <p className="text-xl text-gray-400">
            Unlock more messages and premium features
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.id}
              className={`relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border ${
                plan.popular ? 'border-green-500/50' : 'border-gray-700'
              } hover:border-green-500/50 transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div className={`bg-gradient-to-r ${plan.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <p className="text-gray-400">{plan.messages} messages/month</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">₹{plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full bg-gradient-to-r ${plan.color} text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all`}
              >
                Upgrade to {plan.name}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700 my-8">
            <h2 className="text-2xl font-bold text-white mb-3">Complete Payment</h2>
            <p className="text-gray-400 mb-4 text-sm">
              You've selected the <span className="text-white font-semibold">{selectedPlan.name}</span> plan
            </p>

            {/* Plan Details */}
            <div className="bg-gray-900 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-gray-400">Plan</span>
                <span className="text-white font-semibold">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-gray-400">Messages</span>
                <span className="text-white">{selectedPlan.messages} / month</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                <span className="text-white font-semibold">Total</span>
                <span className="text-xl font-bold text-green-400">₹{selectedPlan.price}</span>
              </div>
            </div>

            {/* QR Code - Your Actual Payment QR */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4 flex flex-col items-center">
              <div className="bg-gray-800 p-3 rounded-lg mb-3">
                <img 
                  src="/payment-qr.png" 
                  alt="Payment QR Code" 
                  className="w-48 h-48 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-48 h-48 flex-col items-center justify-center bg-gray-700 rounded-lg">
                  <p className="text-white text-center px-4 text-xs">
                    ⚠️ QR Code image not found<br/>
                    <span className="text-xs text-gray-400 mt-2 block">
                      Please save your QR code as 'payment-qr.png' in the frontend/public folder
                    </span>
                  </p>
                </div>
              </div>
              <p className="text-white text-sm font-semibold mb-1">Scan to pay with any UPI app</p>
              <p className="text-gray-400 text-xs">Google Pay, PhonePe, Paytm, etc.</p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
              <p className="text-blue-400 text-xs font-semibold mb-2">
                📱 How to Complete Payment:
              </p>
              <ol className="text-blue-300 text-xs space-y-1 list-decimal list-inside">
                <li>Open UPI app on phone</li>
                <li>Scan QR code above</li>
                <li>Pay ₹{selectedPlan.price}</li>
                <li>Click "I Have Paid" below</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Payment successful! Please contact support with your payment screenshot to activate your plan.');
                  setShowPaymentModal(false);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/50 animate-pulse"
              >
                ✓ I Have Paid
              </button>
            </div>

            <p className="text-xs text-yellow-400 text-center bg-yellow-400/10 border border-yellow-400/20 rounded px-2 py-2">
              ⚠️ Click "I Have Paid" after completing payment
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpgradePage;
