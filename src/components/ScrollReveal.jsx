import { motion } from "motion/react";
function ScrollReveal({ children, className, delay = 0, direction = "up" }) {
  const offsets = {
    up: {
      y: 32,
      x: 0,
    },
    down: {
      y: -32,
      x: 0,
    },
    left: {
      y: 0,
      x: 32,
    },
    right: {
      y: 0,
      x: -32,
    },
    none: {
      y: 0,
      x: 0,
    },
  };
  const { x, y } = offsets[direction];
  return (
    /* @__PURE__ */ <motion.div
      className={className}
      initial={{
        opacity: 0,
        x,
        y,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-60px",
      }}
      transition={{
        duration: 0.55,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
export { ScrollReveal as default };
