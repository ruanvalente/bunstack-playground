import { Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'motion/react';

import { useLanguage } from '@/web/shared/hooks/use-language';

export function AboutSection() {
  const { t } = useLanguage();
  const { about } = t.landing;

  return (
    <section className="py-20 bg-white" id="about">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            {about.title}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{about.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-[#F5F6F8] rounded-2xl"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {about.projectTitle}
            </h3>
            <p className="text-gray-600">{about.projectDescription}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 bg-[#F5F6F8] rounded-2xl"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {about.developerTitle}
            </h3>
            <p className="text-gray-600 mb-4">{about.developerDescription}</p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/ruanvalente"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/ruan-valente"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:contato.ruanvalente@gmail.com"
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
