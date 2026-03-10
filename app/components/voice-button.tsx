import { motion } from "framer-motion";
import { Mic } from "lucide-react";

export function VoiceButton({ listening, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      animate={{
        scale: listening ? 1.2 : 1,
      }}
      transition={{ duration: 0.3 }}
      className={`flex items-center justify-center w-24 h-24 rounded-full cursor-pointer ${listening ? "bg-blue-500" : "bg-zinc-700"}`}
    >
      <Mic size={36} color="white" />
    </motion.button>
  );
}
