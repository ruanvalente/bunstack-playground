import { Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'motion/react';

import { useLanguage } from '@/web/shared/hooks/use-language';

export function AboutSection() {
  const { language } = useLanguage();

  const isEnglish = language === 'en';

  const aboutContent = {
    title: isEnglish ? 'About' : 'Sobre',
    subtitle: isEnglish
      ? 'Learn more about our project and the developer'
      : 'Saiba mais sobre nosso projeto e o desenvolvedor',
    projectTitle: isEnglish ? 'About My System' : 'Sobre o My System',
    projectDescription: isEnglish
      ? 'My System is a modern, free task management tool designed to help individuals and teams organize their work efficiently. Built with cutting-edge technologies, it offers an intuitive interface, real-time collaboration, and powerful features to boost productivity.'
      : 'My System é uma ferramenta moderna e gratuita de gerenciamento de tarefas, projetada para ajudar indivíduos e equipes a organizar seu trabalho de forma eficiente. Construído com tecnologias de ponta, oferece uma interface intuitiva, colaboração em tempo real e recursos poderosos para aumentar a produtividade.',
    developerTitle: isEnglish ? 'About the Developer' : 'Sobre o Desenvolvedor',
    developerDescription: isEnglish
      ? 'Ruan Valente - Passionate frontend developer with 5+ years of experience creating modern, scalable, and high-performance web interfaces. Focused on delivering clean, accessible code and exceptional digital experiences.'
      : 'Desenvolvedor frontend apaixonado com mais de 5 anos de experiência criando interfaces web modernas, escaláveis e de alta performance. Focado em entregar código limpo, acessível e experiências digitais excepcionais.',
  };

  return (
    <section className="py-20 bg-white" id="about">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            {aboutContent.title}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {aboutContent.subtitle}
          </p>
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
              {aboutContent.projectTitle}
            </h3>
            <p className="text-gray-600">{aboutContent.projectDescription}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 bg-[#F5F6F8] rounded-2xl"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {aboutContent.developerTitle}
            </h3>
            <p className="text-gray-600 mb-4">
              {aboutContent.developerDescription}
            </p>
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
