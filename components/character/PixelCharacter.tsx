"use client";
import { motion } from "framer-motion";
import type { CharacterState } from "@/types";

interface PixelCharacterProps {
  state: CharacterState;
  level: number;
  size?: number;
}

export function PixelCharacter({ state, level, size = 120 }: PixelCharacterProps) {
  const tier = level >= 31 ? "transformation" : level >= 21 ? "momentum" : level >= 11 ? "discipline" : "beginner";

  const colors = {
    beginner: { body: "#C4A882", clothes: "#8B6F47", accent: "#E8D4B0", face: "#F5E6C8" },
    discipline: { body: "#9DB8C4", clothes: "#4A7B8C", accent: "#B8D4E0", face: "#F5E6C8" },
    momentum: { body: "#A87CB8", clothes: "#6B4C8C", accent: "#D4B8E8", face: "#F5E6C8" },
    transformation: { body: "#C8A850", clothes: "#8B6B20", accent: "#F0D878", face: "#F5E6C8" },
  };

  const c = colors[tier];

  const animations = {
    idle: {
      body: { y: [0, -3, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
      arm: {},
    },
    happy: {
      body: { y: [0, -8, 0, -8, 0], rotate: [-2, 2, -2, 2, 0], transition: { duration: 1, repeat: Infinity } },
      arm: {},
    },
    work: {
      body: { rotate: [-1, 1, -1], transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" } },
      arm: {},
    },
    sleep: {
      body: { rotate: [0, 3], scale: [1, 0.98], transition: { duration: 3, repeat: Infinity, repeatType: "reverse" as const, ease: "easeInOut" } },
      arm: {},
    },
    workout: {
      body: { y: [0, -12, 0], transition: { duration: 0.5, repeat: Infinity } },
      arm: {},
    },
  };

  const scale = size / 100;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size * 1.2 }}>
      <motion.div
        animate={animations[state].body}
        style={{ transformOrigin: "bottom center" }}
        className="relative"
      >
        <svg
          width={80 * scale}
          height={96 * scale}
          viewBox="0 0 80 96"
          style={{ imageRendering: "pixelated" }}
        >
          {/* Shadow */}
          <ellipse cx="40" cy="93" rx="18" ry="4" fill="rgba(0,0,0,0.12)" />

          {/* Legs */}
          <rect x="24" y="68" width="12" height="20" rx="4" fill={c.clothes} />
          <rect x="44" y="68" width="12" height="20" rx="4" fill={c.clothes} />
          {/* Feet */}
          <rect x="20" y="82" width="16" height="8" rx="4" fill={c.body} />
          <rect x="44" y="82" width="16" height="8" rx="4" fill={c.body} />

          {/* Body */}
          <rect x="18" y="42" width="44" height="32" rx="10" fill={c.clothes} />
          {/* Body detail */}
          <rect x="26" y="50" width="28" height="2" rx="1" fill={c.accent} opacity="0.5" />
          <rect x="26" y="56" width="20" height="2" rx="1" fill={c.accent} opacity="0.4" />

          {/* Left arm */}
          <motion.g
            animate={state === "workout" ? { rotate: [-30, 30, -30] } : state === "happy" ? { rotate: [-20, 20, -20] } : {}}
            transition={{ duration: 0.4, repeat: Infinity }}
            style={{ transformOrigin: "20px 48px" }}
          >
            <rect x="6" y="44" width="12" height="22" rx="6" fill={c.clothes} />
            <rect x="4" y="62" width="14" height="10" rx="5" fill={c.body} />
          </motion.g>

          {/* Right arm */}
          <motion.g
            animate={state === "workout" ? { rotate: [30, -30, 30] } : state === "happy" ? { rotate: [20, -20, 20] } : {}}
            transition={{ duration: 0.4, repeat: Infinity }}
            style={{ transformOrigin: "60px 48px" }}
          >
            <rect x="62" y="44" width="12" height="22" rx="6" fill={c.clothes} />
            <rect x="62" y="62" width="14" height="10" rx="5" fill={c.body} />
          </motion.g>

          {/* Neck */}
          <rect x="34" y="36" width="12" height="10" rx="4" fill={c.face} />

          {/* Head */}
          <rect x="16" y="8" width="48" height="44" rx="16" fill={c.face} />

          {/* Hair */}
          <rect x="16" y="8" width="48" height="14" rx="12" fill={c.body} />
          <rect x="16" y="14" width="8" height="8" rx="2" fill={c.body} />
          <rect x="56" y="14" width="8" height="8" rx="2" fill={c.body} />

          {/* Eyes */}
          {state === "sleep" ? (
            <>
              <rect x="26" y="28" width="10" height="4" rx="2" fill={c.clothes} />
              <rect x="44" y="28" width="10" height="4" rx="2" fill={c.clothes} />
            </>
          ) : state === "happy" ? (
            <>
              <path d="M26 28 Q31 24 36 28" stroke={c.clothes} strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M44 28 Q49 24 54 28" stroke={c.clothes} strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <rect x="26" y="26" width="10" height="10" rx="5" fill={c.clothes} />
              <rect x="44" y="26" width="10" height="10" rx="5" fill={c.clothes} />
              <rect x="29" y="28" width="4" height="4" rx="2" fill="white" opacity="0.8" />
              <rect x="47" y="28" width="4" height="4" rx="2" fill="white" opacity="0.8" />
            </>
          )}

          {/* Mouth */}
          {state === "happy" ? (
            <path d="M32 40 Q40 46 48 40" stroke={c.clothes} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          ) : state === "sleep" ? (
            <path d="M34 40 Q40 42 46 40" stroke={c.clothes} strokeWidth="2" fill="none" strokeLinecap="round" />
          ) : (
            <rect x="34" y="40" width="12" height="3" rx="1.5" fill={c.clothes} opacity="0.6" />
          )}

          {/* Sleep Zzz */}
          {state === "sleep" && (
            <motion.g
              animate={{ y: [-5, -15], opacity: [0.8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <text x="60" y="20" fontSize="8" fill={c.clothes} opacity="0.7" fontWeight="bold">z</text>
              <text x="66" y="14" fontSize="10" fill={c.clothes} opacity="0.5" fontWeight="bold">z</text>
              <text x="73" y="8" fontSize="12" fill={c.clothes} opacity="0.3" fontWeight="bold">z</text>
            </motion.g>
          )}

          {/* Happy sparkles */}
          {state === "happy" && (
            <>
              <motion.text
                x="8" y="20"
                fontSize="10"
                animate={{ scale: [0, 1, 0], rotate: [0, 20, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                style={{ transformOrigin: "13px 15px" }}
              >⭐</motion.text>
              <motion.text
                x="62" y="18"
                fontSize="8"
                animate={{ scale: [0, 1, 0], rotate: [0, -20, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                style={{ transformOrigin: "66px 13px" }}
              >✨</motion.text>
            </>
          )}

          {/* Workout dumbbell */}
          {state === "workout" && (
            <motion.g
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ duration: 0.4, repeat: Infinity }}
              style={{ transformOrigin: "10px 56px" }}
            >
              <rect x="0" y="54" width="20" height="4" rx="2" fill={c.body} />
              <rect x="0" y="52" width="4" height="8" rx="2" fill={c.accent} />
              <rect x="16" y="52" width="4" height="8" rx="2" fill={c.accent} />
            </motion.g>
          )}

          {/* Level badge */}
          {level >= 10 && (
            <g>
              <circle cx="68" cy="12" r="10" fill={c.accent} />
              <text x="68" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill={c.clothes}>
                {level}
              </text>
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
