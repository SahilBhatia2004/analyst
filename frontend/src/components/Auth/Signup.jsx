import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { UserPlus, Mail, Lock, User, Sparkles } from 'lucide-react';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlan = location.state?.plan || 'free';
  const transactionId = location.state?.transactionId || null;
  const amount = location.state?.amount || 0;
  const pendingVerification = location.state?.pendingVerification || false;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            plan: selectedPlan,
          },
        },
      });

      if (error) throw error;
      
      // Create subscription in backend
      if (data.user) {
        try {
          const subscriptionData = {
            user_id: data.user.id,
            email: email,
            plan: pendingVerification ? 'free' : selectedPlan, // Start with free if pending verification
            transaction_id: transactionId,
            amount: amount,
            pending_verification: pendingVerification
          };
          
          await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/subscription/create/`, subscriptionData);
          
          if (pendingVerification) {
            alert(`✅ Account created successfully!\n\n⏳ Your ${selectedPlan.toUpperCase()} plan is pending verification.\n\nTransaction ID: ${transactionId}\n\nYou currently have FREE plan (3 messages) until payment is verified.\n\nWe will verify your payment and upgrade your account within 24 hours.`);
          }
        } catch (subError) {
          console.error('Error creating subscription:', subError);
          // Don't fail signup if subscription creation fails
        }
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-3 rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">AI Analyst</h1>
          <p className="text-gray-400">Transform data into insights with AI</p>
        </div>

        {/* Signup Form */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-2">Create account</h2>
          <div className="mb-6 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-400">
              Selected Plan: <span className="font-semibold capitalize">{selectedPlan}</span>
            </p>
            {pendingVerification && (
              <p className="text-xs text-yellow-400 mt-2">
                ⏳ Payment verification pending - Starting with Free plan (3 messages)
              </p>
            )}
            {transactionId && (
              <p className="text-xs text-gray-400 mt-1">
                Transaction ID: {transactionId}
              </p>
            )}
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-4">
              Account created successfully! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-green-400 hover:text-green-300 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-400 text-sm"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
