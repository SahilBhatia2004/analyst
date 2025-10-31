import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, MessageSquare, Zap, Crown } from 'lucide-react';

const Pricing = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: '',
      description: 'Perfect for trying out',
      dashboards: 3,
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-500/50',
      bgColor: 'from-blue-500/10 to-blue-500/10',
      features: [
        '3 AI Dashboards',
        'CSV & Excel upload',
        'Interactive visualizations',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 1500,
      period: 'per month',
      description: 'For regular users',
      dashboards: 10,
      icon: Zap,
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-500/50',
      bgColor: 'from-green-500/10 to-emerald-500/10',
      popular: true,
      features: [
        '10 AI Dashboards per month',
        'CSV & Excel upload',
        'Interactive visualizations',
        'Priority support',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 2500,
      period: 'per month',
      description: 'For power users',
      dashboards: 20,
      icon: Crown,
      color: 'from-purple-500 to-purple-600',
      borderColor: 'border-purple-500/50',
      bgColor: 'from-purple-500/10 to-purple-500/10',
      features: [
        '20 AI Dashboards per month',
        'Priority support',
        'CSV & Excel upload',
        'Interactive visualizations',
      ],
    },
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    if (plan.id === 'free') {
      // For free plan, go directly to signup
      navigate('/signup', { state: { plan: plan.id } });
    } else {
      // For paid plans, show payment modal
      setShowPayment(true);
    }
  };

  const handlePaymentComplete = () => {
    // For paid plans, require payment proof
    if (selectedPlan.id !== 'free') {
      const transactionId = prompt('Please enter your UPI Transaction ID (12 digits):');
      
      if (!transactionId || transactionId.length < 10) {
        alert('⚠️ Transaction ID is required to proceed. Please check your payment app for the transaction ID.');
        return;
      }
      
      // Store transaction ID with the plan
      navigate('/signup', { 
        state: { 
          plan: selectedPlan.id,
          transactionId: transactionId,
          amount: selectedPlan.price,
          pendingVerification: true
        } 
      });
    } else {
      // Free plan doesn't need verification
      navigate('/signup', { state: { plan: selectedPlan.id } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-2 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">AI Analyst</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Pricing Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Simple, Transparent Pricing</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Start with our free plan or upgrade for more messages and advanced features
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.id}
                  className={`relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border ${
                    plan.popular ? 'border-green-500 shadow-lg shadow-green-500/20' : 'border-gray-700'
                  } hover:border-opacity-100 transition-all`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`bg-gradient-to-r ${plan.color} p-3 rounded-xl w-fit mb-6`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-white">
                        {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                      </span>
                      {plan.period && (
                        <span className="text-gray-400 text-sm">{plan.period}</span>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className={`bg-gradient-to-r ${plan.bgColor} border ${plan.borderColor} rounded-lg p-4 mb-6`}>
                    <div className="flex items-center justify-center gap-2">
                      <MessageSquare className="w-5 h-5 text-white" />
                      <span className="text-white font-semibold">
                        {plan.dashboards} AI Dashboards {plan.period && '/ month'}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {plan.id === 'free' ? 'Get Started Free' : 'Choose Premium'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-4">
              All plans include secure data storage and basic support
            </p>
            <p className="text-sm text-gray-500">
              Need more messages? Contact us for custom enterprise plans
            </p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
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
                <span className="text-gray-400">Dashboards</span>
                <span className="text-white">{selectedPlan.dashboards} / month</span>
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
                onClick={() => setShowPayment(false)}
                className="flex-1 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentComplete}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/50 animate-pulse"
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

export default Pricing;
