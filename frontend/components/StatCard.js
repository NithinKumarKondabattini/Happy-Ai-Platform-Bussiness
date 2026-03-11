import { motion } from "framer-motion";

export default function StatCard({ title, value, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="glass-card w-full p-4 text-left shadow-glow"
    >
      <p className="text-sm text-slate-300">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-cyan-200">{value}</p>
    </motion.button>
  );
}

