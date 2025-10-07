"use client";

import React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// ────────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────────
const LITER_PRICE = 3.18; // € per Liter

function euroToMango(euros: number) {
  const liters = euros / LITER_PRICE;
  return liters * 2; // Mango Loco units
}

function formatEuros(value: number) {
  return value.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
}

function formatMango(value: number) {
  // Big, but keep a couple decimals for flair
  return `${value.toLocaleString("de-DE", { maximumFractionDigits: 2 })}`;
}

// ────────────────────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────────────────────
export default function Page() {
  const [euros, setEuros] = React.useState<number>(3000);
  const [liters, setLiters] = React.useState<number>(euros / LITER_PRICE);
  const [mango, setMango] = React.useState<number>(euroToMango(euros));

  // Animated number using Framer Motion springs
  const mangoMotion = useMotionValue(0);
  const mangoSpring = useSpring(mangoMotion, { stiffness: 100, damping: 18 });
  const [mangoDisplay, setMangoDisplay] = React.useState<string>(formatMango(mango));

  // 1) Einmalig auf Änderungen des Springs hören und Anzeige updaten
  React.useEffect(() => {
    const unsub = mangoSpring.on("change", (v) => setMangoDisplay(formatMango(v)));
    return () => unsub?.();
  }, []);

  // 2) Bei jeder Änderung des Zielwerts den MotionValue setzen –
  //    der Spring animiert automatisch dorthin (kein animate() nötig)
  React.useEffect(() => {
    mangoMotion.set(mango);
  }, [mango]);

  const handleChange = (val: string) => {
    const clean = Number(val.replace(/,/g, ".").replace(/[^0-9.]/g, ""));
    const eurosVal = Number.isFinite(clean) ? clean : 0;
    setEuros(eurosVal);
    setLiters(eurosVal / LITER_PRICE);
  };

  const handleCalculate = () => {
    setMango(euroToMango(euros));
  };

  // Precompute the special footer line for 3000€
  const mango3000 = euroToMango(3000);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-fuchsia-500 via-amber-400 to-cyan-400">
      {/* Animated background candy blobs */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0.5, scale: 0.8 }}
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.9, 1.05, 0.9], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full blur-3xl"
        style={{ background: "conic-gradient(from 180deg, #ff00f7, #00e5ff, #ffe600, #ff00f7)" }}
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0.35, scale: 1 }}
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1], rotate: [0, -8, 8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-40 -right-40 h-[42rem] w-[42rem] rounded-full blur-3xl"
        style={{ background: "conic-gradient(from 90deg, #7c3aed, #06b6d4, #f59e0b, #ef4444, #7c3aed)" }}
      />

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 py-16 sm:px-10">
        <header className="text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_5px_20px_rgba(0,0,0,0.3)] sm:text-7xl"
          >
            MANGO LOCO<br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
              MEGA‑UMRECHNER
            </span>
          </motion.h1>
          <p className="mt-4 max-w-2xl text-center text-lg text-white/90 sm:text-2xl">
            Rechne jeden €‑Betrag mit <span className="font-semibold">{formatEuros(LITER_PRICE)}</span> pro Liter um —
            poppig, knallig, mit Animation. 🚀
          </p>
        </header>

        {/* Card */}
        <motion.section
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
          className="w-full rounded-3xl bg-white/90 p-6 shadow-2xl ring-4 ring-white/50 backdrop-blur-md sm:p-10"
        >
          {/* Input row */}
          <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto]">
            <div>
              <label className="block text-sm font-semibold text-neutral-600">€ Betrag</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border-2 border-fuchsia-400/60 bg-white px-4 py-4 shadow-lg outline-offset-4 outline-fuchsia-400">
                <span className="select-none text-3xl font-black text-fuchsia-600">€</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={Number.isFinite(euros) ? euros : 0}
                  onChange={(e) => handleChange(e.target.value)}
                  className="w-full bg-transparent text-4xl font-extrabold tracking-tight text-neutral-900 placeholder-neutral-400 focus:outline-none"
                  placeholder="3000"
                  min={0}
                />
              </div>
              <p className="mt-2 text-sm text-neutral-600">
                {formatEuros(euros)} entsprechen {liters.toLocaleString("de-DE", { maximumFractionDigits: 3 })} Litern.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCalculate}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 via-rose-500 to-orange-400 px-6 py-5 text-2xl font-black uppercase tracking-wider text-white shadow-[0_10px_30px_rgba(236,72,153,0.6)]"
            >
              Ausrechnen ⚡
            </motion.button>
          </div>

          {/* Result */}
          <div className="mt-10 grid gap-6">
            <div className="rounded-2xl bg-gradient-to-br from-yellow-200 via-pink-200 to-cyan-200 p-1">
              <div className="rounded-2xl bg-white/90 p-6">
                <motion.div
                  key={mango}
                  initial={{ filter: "blur(6px)", opacity: 0 }}
                  animate={{ filter: "blur(0px)", opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="mt-2 text-5xl font-black leading-none text-neutral-900 sm:text-7xl"
                >
                  {mangoDisplay}<br/>
                  MANGO LOCOS
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Footer punchline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-center text-3xl font-extrabold uppercase tracking-tight text-white drop-shadow-[0_5px_20px_rgba(0,0,0,0.35)] sm:text-5xl"
        >
          3000€ sind {" "}
          <span className="bg-black/20 px-3 py-1">
            {mango3000.toLocaleString("de-DE", { maximumFractionDigits: 2 })}
          </span>{" "}<br/>
          MANGO LOCOS WERT.
        </motion.p>

        <p className="text-center text-sm text-white/80">
          Tipp: Tippe einen Betrag ein und drücke <span className="font-bold">Ausrechnen</span>.
        </p>
      </main>
    </div>
  );
}
