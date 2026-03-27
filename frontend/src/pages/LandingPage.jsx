
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRightIcon,
  BoltIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const { user } = useAuth();

  const features = [
    {
      name: 'Lightning Fast Generation',
      description:
        'Generate highly custom cold emails in seconds using advanced AI.',
      icon: BoltIcon,
    },
    {
      name: 'Omnichannel Outreach',
      description:
        'Email, follow-ups, and LinkedIn DMs perfectly aligned.',
      icon: DocumentTextIcon,
    },
    {
      name: 'Higher Conversion Rates',
      description:
        'Personalized copy that drives replies and closes deals.',
      icon: ChartBarIcon,
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-green-300 selection:text-black">

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            MailGen AI
          </span>

          <div className="flex items-center space-x-4">
            {user ? (
              <Link
                to="/dashboard"
                className="px-6 py-2.5 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 transition"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-40 pb-28 text-center overflow-hidden">

        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-green-500/20 blur-[120px] rounded-full"></div>

        <div className="max-w-5xl mx-auto px-6 relative">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Write Cold Emails That <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              Actually Convert
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Stop wasting hours writing outreach. Generate high-converting email
            sequences instantly with AI.
          </p>

          <div className="mt-10 flex justify-center gap-6">
            <Link
              to={user ? '/dashboard' : '/signup'}
              className="group px-8 py-4 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 transition"
            >
              Start Free
              <ArrowRightIcon className="inline ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-bold">
            Everything you need to scale outreach
          </h2>
          <p className="text-gray-400 mt-4">
            Built for modern sales teams
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto px-6">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition"
            >
              <div className="h-12 w-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-green-400" />
              </div>

              <h3 className="text-xl font-semibold mb-3">
                {feature.name}
              </h3>

              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-gradient-to-br from-black via-gray-900 to-green-900/20 text-center">
        <h2 className="text-4xl font-bold">
          Ready to scale your outreach?
        </h2>

        <p className="text-gray-400 mt-4 max-w-xl mx-auto">
          Join sales professionals using MailGen AI to grow faster.
        </p>

        <div className="mt-10">
          <Link
            to="/signup"
            className="px-8 py-4 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400 hover:scale-105 transition"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 text-center">
        <p className="text-gray-500">
          © {new Date().getFullYear()} MailGen AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;

