import { Bell, CheckCircle2, Clock, Layers, Share2, Tag } from 'lucide-react';
import { motion } from 'motion/react';

import { useLanguage } from '@/web/shared/hooks/use-language';

const featuresList = [
  {
    icon: Layers,
    getTitle: (f: ReturnType<typeof useLanguage>['t']['landing']['features']) =>
      f.boards.title,
    getDescription: (
      f: ReturnType<typeof useLanguage>['t']['landing']['features']
    ) => f.boards.description,
  },
  {
    icon: Tag,
    getTitle: (f: ReturnType<typeof useLanguage>['t']['landing']['features']) =>
      f.tags.title,
    getDescription: (
      f: ReturnType<typeof useLanguage>['t']['landing']['features']
    ) => f.tags.description,
  },
  {
    icon: Clock,
    getTitle: (f: ReturnType<typeof useLanguage>['t']['landing']['features']) =>
      f.dueDates.title,
    getDescription: (
      f: ReturnType<typeof useLanguage>['t']['landing']['features']
    ) => f.dueDates.description,
  },
  {
    icon: Share2,
    getTitle: (f: ReturnType<typeof useLanguage>['t']['landing']['features']) =>
      f.collaboration.title,
    getDescription: (
      f: ReturnType<typeof useLanguage>['t']['landing']['features']
    ) => f.collaboration.description,
  },
  {
    icon: CheckCircle2,
    getTitle: (f: ReturnType<typeof useLanguage>['t']['landing']['features']) =>
      f.progress.title,
    getDescription: (
      f: ReturnType<typeof useLanguage>['t']['landing']['features']
    ) => f.progress.description,
  },
  {
    icon: Bell,
    getTitle: (f: ReturnType<typeof useLanguage>['t']['landing']['features']) =>
      f.notifications.title,
    getDescription: (
      f: ReturnType<typeof useLanguage>['t']['landing']['features']
    ) => f.notifications.description,
  },
];

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </motion.div>
  );
}

export function FeaturesSection() {
  const { t } = useLanguage();
  const features = t.landing.features;

  return (
    <section className="py-20 bg-[#F5F6F8]" id="features">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            {features.title}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{features.subtitle}</p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featuresList.map((feature) => (
            <FeatureCard
              key={feature.getTitle(features)}
              icon={feature.icon}
              title={feature.getTitle(features)}
              description={feature.getDescription(features)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
