import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import { AnimatePresence, motion } from 'motion/react';

export function AnimatedOutlet() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
