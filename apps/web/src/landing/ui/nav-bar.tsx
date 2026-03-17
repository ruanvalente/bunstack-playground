import { useState } from 'react';
import { Link } from 'react-router';

import { Menu, X } from 'lucide-react';

import { LanguageSelector } from '@shared/ui/language-selector';
import { useLanguage } from '@/web/shared/hooks/use-language';

const navLinks = [
  { key: 'home', href: '#home' },
  { key: 'features', href: '#features' },
  { key: 'howItWorks', href: '#how-it-works' },
  { key: 'about', href: '#about' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const nav = t.landing.nav;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">My</span>
            </div>
            <span className="font-semibold text-gray-900 text-lg">System</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {nav[link.key as keyof typeof nav]}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <LanguageSelector />
            <Link
              to="/auth"
              className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {nav.login}
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="block py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                {nav[link.key as keyof typeof nav]}
              </a>
            ))}
            <div className="flex items-center gap-4 mt-4">
              <LanguageSelector />
              <Link
                to="/auth"
                className="flex-1 text-center px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700"
              >
                {nav.login}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
