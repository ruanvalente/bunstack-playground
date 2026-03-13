import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { useLanguage } from '@shared/hooks/use-language';

import { LoginForm } from '../ui/login-form.component';
import { RegisterForm } from '../ui/register-form.component';

export function AuthPage() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
      title: t.auth.heroTitle1,
      subtitle: t.auth.heroSubtitle1,
    },
    {
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
      title: t.auth.heroTitle2,
      subtitle: t.auth.heroSubtitle2,
    },
    {
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
      title: t.auth.heroTitle3,
      subtitle: t.auth.heroSubtitle3,
    },
  ];

  const currentHero = heroImages[currentSlide]!;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen flex">
      {/* Coluna Esquerda - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden">
        {/* Imagem de fundo */}
        <div className="absolute inset-0">
          <img
            src={currentHero.url}
            alt="Hero"
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-primary/80" />
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-4xl font-bold mb-4">{currentHero.title}</h1>
              <p className="text-lg text-white/80">{currentHero.subtitle}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicador de slides */}
        <div className="absolute bottom-8 left-12 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Coluna Direita - Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-soft px-6 py-12">
        {/* Toggle Login/Register no topo */}
        <div className="w-full max-w-md mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                mode === 'login'
                  ? 'bg-primary text-white'
                  : 'bg-transparent text-muted hover:text-primary'
              }`}
            >
              {t.auth.signIn}
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                mode === 'register'
                  ? 'bg-primary text-white'
                  : 'bg-transparent text-muted hover:text-primary'
              }`}
            >
              {t.auth.signUp}
            </button>
          </div>
        </div>

        {/* Formulário */}
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {mode === 'login' ? <LoginForm /> : <RegisterForm />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
