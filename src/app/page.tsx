'use client';

import ButtonNigtmode from '@/components/partial/ButtonNigtmode';
import { Button } from '@nextui-org/react';
import { ArrowRight, Check, FileSignature, Github, Layers, Lock, Sparkles, Upload, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-tertiary-light via-white to-blue-50 dark:from-tertiary-dark dark:via-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileSignature className="w-8 h-8 text-primary-light dark:text-primary-dark" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Signlys</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="https://github.com/rifqiagniamubarok/pdf-editor" target="_blank">
              <Button size="sm" variant="light" startContent={<Github size={18} />}>
                GitHub
              </Button>
            </Link>
            <ButtonNigtmode />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-light/10 dark:bg-secondary-dark/10 rounded-full border border-secondary-light/20 dark:border-secondary-dark/20">
              <Sparkles className="w-4 h-4 text-secondary-light dark:text-secondary-dark" />
              <span className="text-sm font-medium text-secondary-light dark:text-secondary-dark">100% Free & Open Source</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Sign PDFs with
              <br />
              <span className="bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark bg-clip-text text-transparent">
                Effortless Precision
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Add digital signatures to your PDF documents in seconds. Draw, upload, or type your signature - it&apos;s that simple.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/editor">
                <Button
                  size="lg"
                  className="bg-primary-light dark:bg-primary-dark text-white font-semibold px-8 hover:opacity-90 transition-opacity"
                  endContent={<ArrowRight size={20} />}
                >
                  Start Signing Now
                </Button>
              </Link>
              <Link href="https://github.com/rifqiagniamubarok/pdf-editor" target="_blank">
                <Button size="lg" variant="bordered" className="border-2 font-semibold" startContent={<Github size={20} />}>
                  View on GitHub
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-secondary-light dark:text-secondary-dark" />
                <span>No Registration</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-secondary-light dark:text-secondary-dark" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-secondary-light dark:text-secondary-dark" />
                <span>Works Offline</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Everything You Need to Sign PDFs</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Powerful features designed for simplicity and efficiency</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-tertiary-light to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary-light/10 dark:bg-primary-dark/10 rounded-bl-full" />
              <div className="relative">
                <div className="w-14 h-14 bg-primary-light/10 dark:bg-primary-dark/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7 text-primary-light dark:text-primary-dark" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Multiple Signature Options</h3>
                <p className="text-gray-600 dark:text-gray-300">Draw your signature with a mouse or touchscreen, or upload an existing signature image (PNG/JPG).</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-tertiary-light to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-secondary-light/10 dark:bg-secondary-dark/10 rounded-bl-full" />
              <div className="relative">
                <div className="w-14 h-14 bg-secondary-light/10 dark:bg-secondary-dark/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Layers className="w-7 h-7 text-secondary-light dark:text-secondary-dark" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Multi-Page Support</h3>
                <p className="text-gray-600 dark:text-gray-300">Add signatures to multiple pages at once. Duplicate your signature across all pages with one click.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-tertiary-light to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary-light/10 dark:bg-primary-dark/10 rounded-bl-full" />
              <div className="relative">
                <div className="w-14 h-14 bg-primary-light/10 dark:bg-primary-dark/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Lock className="w-7 h-7 text-primary-light dark:text-primary-dark" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Privacy First</h3>
                <p className="text-gray-600 dark:text-gray-300">Your documents never leave your device. All processing happens locally in your browser for maximum security.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Sign in Three Simple Steps</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">No account needed, no learning curve</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Your PDF', desc: 'Drag and drop or select your PDF document from your device' },
              { step: '02', title: 'Add Signature', desc: 'Draw, upload, or type your signature and position it anywhere' },
              { step: '03', title: 'Download & Done', desc: 'Save your signed document and use it immediately' },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-8xl font-black text-primary-light/10 dark:text-primary-dark/10 absolute -top-8 left-0">{item.step}</div>
                <div className="relative pt-16">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <Zap className="w-8 h-8 text-secondary-light dark:text-secondary-dark" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/editor">
              <Button
                size="lg"
                className="bg-secondary-light dark:bg-secondary-dark text-white font-semibold px-10 hover:opacity-90 transition-opacity"
                endContent={<ArrowRight size={20} />}
              >
                Try It Now - It&apos;s Free!
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <FileSignature className="w-6 h-6 text-primary-light dark:text-primary-dark" />
              <span className="font-bold text-gray-900 dark:text-white">Signlys</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} Signlys. Open source PDF signature tool.</p>
            <div className="flex gap-4">
              <Link
                href="https://github.com/rifqiagniamubarok/pdf-editor"
                target="_blank"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary-dark transition-colors"
              >
                <Github size={20} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
