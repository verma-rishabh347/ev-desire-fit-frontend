import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const PHONE = '919999992951';
const WA_URL = `https://wa.me/${PHONE}?text=Hi%2C%20I%27m%20interested%20in%20DESIREFIT%20EV%20charging%20solutions.`;

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="fixed bottom-8 right-8 z-50 flex items-center justify-end"
      style={{ pointerEvents: 'none' }}
    >
      {/* Expanded label */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, x: 12, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.92 }}
            transition={{ duration: 0.2, ease: 'easeOut' as const }}
            className="mr-3 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg whitespace-nowrap"
            style={{
              background: 'hsl(var(--whatsapp))',
              pointerEvents: 'none',
              boxShadow: '0 4px 20px hsl(var(--whatsapp) / 0.45)',
            }}
          >
            Chat on WhatsApp
          </motion.span>
        )}
      </AnimatePresence>

      {/* Circle button */}
      <motion.a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative flex items-center justify-center rounded-full shadow-xl"
        style={{
          width: 56,
          height: 56,
          background: 'hsl(var(--whatsapp))',
          boxShadow: '0 4px 24px hsl(var(--whatsapp) / 0.5)',
          pointerEvents: 'auto',
          flexShrink: 0,
        }}
      >
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ background: 'hsl(var(--whatsapp) / 0.35)' }}
          aria-hidden="true"
        />
        {/* WhatsApp SVG logo */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="28"
          height="28"
          fill="white"
          aria-hidden="true"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.648 4.83 1.782 6.862L2 30l7.338-1.762A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.83-1.594l-.418-.248-4.354 1.046 1.066-4.24-.272-.434A11.46 11.46 0 0 1 4.5 16C4.5 9.596 9.596 4.5 16 4.5S27.5 9.596 27.5 16 22.404 27.5 16 27.5zm6.29-8.61c-.344-.172-2.036-1.004-2.352-1.118-.316-.114-.546-.172-.776.172-.23.344-.89 1.118-1.09 1.348-.2.23-.4.258-.744.086-.344-.172-1.452-.536-2.766-1.708-1.022-.912-1.712-2.038-1.912-2.382-.2-.344-.022-.53.15-.702.154-.154.344-.4.516-.6.172-.2.23-.344.344-.574.114-.23.058-.43-.028-.602-.086-.172-.776-1.872-1.064-2.562-.28-.672-.564-.58-.776-.59l-.66-.012c-.23 0-.602.086-.918.43-.316.344-1.204 1.176-1.204 2.868s1.232 3.326 1.404 3.556c.172.23 2.426 3.706 5.878 5.196.822.354 1.464.566 1.964.724.824.262 1.574.224 2.168.136.66-.098 2.036-.832 2.322-1.636.286-.804.286-1.492.2-1.636-.086-.144-.316-.23-.66-.4z" />
        </svg>
      </motion.a>
    </div>
  );
}
