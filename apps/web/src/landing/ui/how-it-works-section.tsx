import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

import { useLanguage } from '@/web/shared/hooks/use-language';

const steps = [
  {
    num: 1,
    getTitle: (t: ReturnType<typeof useLanguage>['t']) =>
      t.landing.howItWorks.step1.title,
    getDescription: (t: ReturnType<typeof useLanguage>['t']) =>
      t.landing.howItWorks.step1.description,
  },
  {
    num: 2,
    getTitle: (t: ReturnType<typeof useLanguage>['t']) =>
      t.landing.howItWorks.step2.title,
    getDescription: (t: ReturnType<typeof useLanguage>['t']) =>
      t.landing.howItWorks.step2.description,
  },
  {
    num: 3,
    getTitle: (t: ReturnType<typeof useLanguage>['t']) =>
      t.landing.howItWorks.step3.title,
    getDescription: (t: ReturnType<typeof useLanguage>['t']) =>
      t.landing.howItWorks.step3.description,
  },
];

export function HowItWorksSection() {
  const { t } = useLanguage();
  const howItWorks = t.landing.howItWorks;

  return (
    <section className="py-20 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            {howItWorks.title}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative p-8 bg-[#F5F6F8] rounded-2xl"
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                {step.num}
              </div>
              {index < steps.length - 1 && (
                <ArrowRight
                  className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-gray-300"
                  size={24}
                />
              )}
              <h3 className="font-semibold text-gray-900 mb-3 mt-2">
                {step.getTitle(t)}
              </h3>
              <p className="text-sm text-gray-500">{step.getDescription(t)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
