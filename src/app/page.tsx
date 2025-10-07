"use client";

import React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// ────────────────────────────────────────────────────────────────────────────────
// Farbpalette (nur diese Farben verwenden)
// Hintergrund (Dosenfarbe): Türkisblau #4BC6E0
// Monster-Claw-Logo: Gelb-Orange #F7B034
// Akzent 1: Korallenrot #E84C3D
// Akzent 2: Schwarz #000000
// Akzent 3: Weiß #FFFFFF
// Ornament-Details: Lila #7A3F98
// ────────────────────────────────────────────────────────────────────────────────

// Helpers
const LITER_PRICE = 3.18; // € pro Liter

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
  return `${value.toLocaleString("de-DE", { maximumFractionDigits: 2 })}`;
}

export default function Page() {
  const [euros, setEuros] = React.useState<number>(3000);
  const [liters, setLiters] = React.useState<number>(euros / LITER_PRICE);
  const [mango, setMango] = React.useState<number>(euroToMango(euros));

  // Animated number using Framer Motion springs
  const mangoMotion = useMotionValue(0);
  const mangoSpring = useSpring(mangoMotion, { stiffness: 120, damping: 20 });
  const [mangoDisplay, setMangoDisplay] = React.useState<string>(formatMango(mango));

  // Einmalig auf Änderungen des Springs hören und Anzeige updaten
  React.useEffect(() => {
    const unsub = mangoSpring.on("change", (v) => setMangoDisplay(formatMango(v)));
    return () => unsub?.();
  }, []);

  // Bei jeder Änderung des Zielwerts den MotionValue setzen – der Spring animiert automatisch dorthin
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

  const mango3000 = euroToMango(3000);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[url(/bg.png)] bg-no-repeat bg-cover bg-center">
      <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 py-16 sm:px-10">
        <header className="text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold tracking-tight text-[#000000] sm:text-7xl bg-[#1EA5D3] p-3"
          >
            <span className="inline-block px-4 py-2 rounded-2xl border-4 border-[#ffffff] bg-[#F7B034]">MANGO LOCO</span>
            <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #ffffff, #F7B034)" }}>
              MEGA‑UMRECHNER
            </span>
          </motion.h1>
          <p className="mt-4 max-w-2xl text-center text-lg sm:text-2xl bg-[#1EA5D3] p-3" style={{ color: "#ffffff" }}>
            Rechne jeden €‑Betrag mit <span className="font-semibold">{formatEuros(LITER_PRICE)}</span> pro Liter um
          </p>
        </header>

        {/* Card */}
        <motion.section
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
          className="w-full rounded-3xl p-6 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
          style={{ backgroundColor: "#FFFFFF", border: "6px solid #000000" }}
        >
          {/* Input row */}
          <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto]">
            <div>
              <label className="block text-sm font-semibold" style={{ color: "#000000" }}>€ Betrag</label>
              <div
                className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-4 shadow-[0_8px_0_#000000]"
                style={{ backgroundColor: "#FFFFFF", border: "4px solid #7A3F98" }}
              >
                <span className="select-none text-3xl font-black" style={{ color: "#E84C3D" }}>€</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={Number.isFinite(euros) ? euros : 0}
                  onChange={(e) => handleChange(e.target.value)}
                  className="w-full bg-transparent text-4xl font-extrabold tracking-tight focus:outline-none"
                  style={{ color: "#000000" }}
                  placeholder="3000"
                  min={0}
                />
              </div>
              <p className="mt-2 text-sm" style={{ color: "#000000" }}>
                {formatEuros(euros)} entsprechen {liters.toLocaleString("de-DE", { maximumFractionDigits: 3 })} Litern.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCalculate}
              className="inline-flex items-center justify-center rounded-2xl px-6 py-5 text-2xl font-black uppercase tracking-wider shadow-[0_10px_0_#000000]"
              style={{ backgroundColor: "#F7B034", color: "#000000", border: "4px solid #000000" }}
            >
              Ausrechnen ⚡
            </motion.button>
          </div>

          {/* Result */}
          <div className="mt-10 grid gap-6">
            <div className="rounded-2xl p-1" style={{ background: "linear-gradient(135deg, #F7B034, #E84C3D)" }}>
              <div className="rounded-2xl p-6" style={{ backgroundColor: "#FFFFFF", border: "4px solid #000000" }}>
                <motion.div
                  key={mango}
                  initial={{ filter: "blur(6px)", opacity: 0 }}
                  animate={{ filter: "blur(0px)", opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="mt-2 text-5xl font-black leading-none sm:text-7xl"
                  style={{ color: "#000000" }}
                >
                  {mangoDisplay}
                  <br />
                  <span style={{ color: "#F7B034" }}>MANGO LOCOS</span>
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
          className="mt-6 text-center text-3xl font-extrabold uppercase tracking-wider leading-[125%] sm:text-5xl bg-[#1EA5D3] p-3"
          style={{ color: "#ffffff" }}
        >
          3000€ sind {" "}
          <span className="px-3" style={{ backgroundColor: "#FFFFFF", color: "#000000", border: "3px solid #000000" }}>
            {mango3000.toLocaleString("de-DE", { maximumFractionDigits: 2 })}
          </span>{" "}
          <br />
          <span style={{ color: "#ffffff" }}>MANGO LOCOS WERT.</span>
        </motion.p>

        <p className="text-center text-sm bg-[#1EA5D3] p-3" style={{ color: "#ffffff" }}>
          Tipp: Tippe einen Betrag ein und drücke <span className="font-bold" style={{ color: "#E84C3D" }}>Ausrechnen</span>.
        </p>
      </main>
    </div>
  );
}
