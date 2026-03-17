import { Link } from 'react-router';

import { motion } from 'motion/react';

import { useLanguage } from '@/web/shared/hooks/use-language';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};

const fadeInRight = {
  initial: { opacity: 0, x: 50 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.7, delay: 0.2 },
  viewport: { once: true },
};

function HeroIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <svg viewBox="0 0 400 280" fill="none" className="w-full h-auto">
        <rect
          x="20"
          y="40"
          width="170"
          height="200"
          rx="12"
          stroke="#1F2937"
          strokeWidth="2"
          fill="white"
        />
        <rect x="20" y="40" width="170" height="32" rx="12" fill="#F3F4F6" />
        <circle cx="40" cy="56" r="6" fill="#EF4444" />
        <circle cx="54" cy="56" r="6" fill="#F59E0B" />
        <circle cx="68" cy="56" r="6" fill="#10B981" />

        <rect
          x="35"
          y="85"
          width="140"
          height="28"
          rx="6"
          stroke="#1F2937"
          strokeWidth="1.5"
          fill="#F9FAFB"
        />
        <circle cx="50" cy="99" r="5" fill="#6B7280" />
        <rect x="65" y="96" width="80" height="6" rx="3" fill="#D1D5DB" />

        <rect
          x="35"
          y="120"
          width="140"
          height="28"
          rx="6"
          stroke="#1F2937"
          strokeWidth="1.5"
          fill="#F9FAFB"
        />
        <circle cx="50" cy="134" r="5" fill="#10B981" />
        <rect x="65" y="131" width="60" height="6" rx="3" fill="#D1D5DB" />

        <rect
          x="35"
          y="155"
          width="140"
          height="28"
          rx="6"
          stroke="#1F2937"
          strokeWidth="1.5"
          fill="#F9FAFB"
        />
        <circle cx="50" cy="169" r="5" fill="#F59E0B" />
        <rect x="65" y="166" width="90" height="6" rx="3" fill="#D1D5DB" />

        <rect
          x="35"
          y="185"
          width="140"
          height="28"
          rx="6"
          stroke="#1F2937"
          strokeWidth="1.5"
          fill="#F9FAFB"
        />
        <circle cx="50" cy="199" r="5" fill="#6B7280" />
        <rect x="65" y="196" width="70" height="6" rx="3" fill="#D1D5DB" />

        <rect
          x="210"
          y="40"
          width="170"
          height="200"
          rx="12"
          stroke="#1F2937"
          strokeWidth="2"
          fill="white"
        />
        <rect x="210" y="40" width="170" height="32" rx="12" fill="#F3F4F6" />
        <circle cx="230" cy="56" r="6" fill="#EF4444" />
        <circle cx="244" cy="56" r="6" fill="#F59E0B" />
        <circle cx="258" cy="56" r="6" fill="#10B981" />

        <rect
          x="225"
          y="85"
          width="140"
          height="28"
          rx="6"
          stroke="#1F2937"
          strokeWidth="1.5"
          fill="#F9FAFB"
        />
        <circle cx="240" cy="99" r="5" fill="#6B7280" />
        <rect x="255" y="96" width="80" height="6" rx="3" fill="#D1D5DB" />

        <rect
          x="225"
          y="120"
          width="140"
          height="28"
          rx="6"
          stroke="#1F2937"
          strokeWidth="1.5"
          fill="#F9FAFB"
        />
        <circle cx="240" cy="134" r="5" fill="#10B981" />
        <rect x="255" y="131" width="60" height="6" rx="3" fill="#D1D5DB" />

        <circle
          cx="320"
          cy="180"
          r="25"
          stroke="#1F2937"
          strokeWidth="1.5"
          fill="white"
        />
        <path
          d="M310 180 L318 188 L332 172"
          stroke="#10B981"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  );
}

export function HeroSection() {
  const { t } = useLanguage();
  const hero = t.landing.hero;

  return (
    <section className="py-20 bg-[#F5F6F8]" id="home">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeInUp} className="space-y-6">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              {hero.title}
              <br />
              <span className="text-primary">{hero.titleHighlight}</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-lg">{hero.subtitle}</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/auth"
                className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors inline-block"
              >
                {hero.cta}
              </Link>
            </div>
          </motion.div>

          <motion.div
            {...fadeInRight}
            className="flex justify-center lg:justify-end"
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
