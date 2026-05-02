"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { PlaneTakeoff, PlaneLanding, ArrowLeftRight, Calendar, Users, Search, ChevronDown } from "lucide-react";

const CITIES = [
  { code: "MNL", name: "Manila", country: "Philippines" },
  { code: "CEB", name: "Cebu", country: "Philippines" },
  { code: "DVO", name: "Davao", country: "Philippines" },
  { code: "SIN", name: "Singapore", country: "Singapore" },
  { code: "KUL", name: "Kuala Lumpur", country: "Malaysia" },
  { code: "HKG", name: "Hong Kong", country: "China" },
  { code: "NRT", name: "Tokyo", country: "Japan" },
  { code: "SYD", name: "Sydney", country: "Australia" },
  { code: "DXB", name: "Dubai", country: "UAE" },
  { code: "LHR", name: "London", country: "UK" },
];

export default function Home() {
  const [tripType, setTripType] = useState<"oneway" | "roundtrip" | "multicity">("roundtrip");
  const [from, setFrom] = useState("MNL");
  const [to, setTo] = useState("SIN");
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [depart, setDepart] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState("Economy");

  const swapCities = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const fromCity = CITIES.find((c) => c.code === from)!;
  const toCity = CITIES.find((c) => c.code === to)!;

  return (
    <main className="min-h-screen bg-[#0f0e1a] text-white overflow-hidden">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: "rgba(15,14,26,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(65,64,102,0.3)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#CEFF1A" }}>
            <PlaneTakeoff size={16} color="#0f0e1a" />
          </div>
          <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: "1.2rem", letterSpacing: "-0.02em" }}>
            Kai2 <span style={{ color: "#CEFF1A" }}>Flight</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Flights", "Hotels", "Packages", "My Trips"].map((item) => (
            <a key={item} href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {item}
            </a>
          ))}
        </div>
        <button className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
          style={{ background: "#CEFF1A", color: "#0f0e1a", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
          Sign In
        </button>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20">

        {/* Background glow blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "#414066" }} />
        <div className="absolute bottom-40 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "#CEFF1A" }} />

        {/* Animated plane trail */}
        <motion.div
          className="absolute top-32 left-0 right-0 flex items-center justify-center pointer-events-none"
          initial={{ x: "-100%" }} animate={{ x: "100%" }}
          transition={{ duration: 8, repeat: Infinity, repeatDelay: 4, ease: "linear" }}>
          <PlaneTakeoff size={28} style={{ color: "#CEFF1A", opacity: 0.3 }} />
        </motion.div>

        {/* Hero Text */}
        <motion.div className="text-center mb-10 z-10"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: "#CEFF1A", fontFamily: "'DM Sans', sans-serif" }}>
            ✦ Your Journey Starts Here
          </p>
          <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            Fly Smarter,<br />
            <span style={{ color: "#CEFF1A" }}>Arrive Better.</span>
          </h1>
          <p className="mt-4 opacity-60 max-w-md mx-auto" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem" }}>
            Book flights across 500+ destinations worldwide. Best prices, zero hassle.
          </p>
        </motion.div>

        {/* SEARCH CARD */}
        <motion.div className="w-full max-w-4xl z-10"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
          <div className="rounded-2xl p-6" style={{ background: "rgba(65,64,102,0.2)", backdropFilter: "blur(20px)", border: "1px solid rgba(65,64,102,0.5)" }}>

            {/* Trip type tabs */}
            <div className="flex gap-2 mb-6">
              {(["roundtrip", "oneway", "multicity"] as const).map((type) => (
                <button key={type} onClick={() => setTripType(type)}
                  className="px-4 py-2 rounded-full text-sm font-medium capitalize transition-all"
                  style={{
                    background: tripType === type ? "#CEFF1A" : "rgba(65,64,102,0.4)",
                    color: tripType === type ? "#0f0e1a" : "rgba(255,255,255,0.7)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: tripType === type ? 600 : 400,
                  }}>
                  {type === "roundtrip" ? "Round Trip" : type === "oneway" ? "One Way" : "Multi-City"}
                </button>
              ))}
            </div>

            {/* FROM / SWAP / TO */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 mb-4">

              {/* FROM */}
              <div className="relative">
                <div className="rounded-xl p-4 cursor-pointer hover:border-[#CEFF1A] transition-colors"
                  style={{ background: "rgba(15,14,26,0.6)", border: "1px solid rgba(65,64,102,0.6)" }}
                  onClick={() => { setFromOpen(!fromOpen); setToOpen(false); }}>
                  <div className="flex items-center gap-2 mb-1">
                    <PlaneTakeoff size={14} style={{ color: "#CEFF1A" }} />
                    <span className="text-xs opacity-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>From</span>
                  </div>
                  <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#CEFF1A", lineHeight: 1 }}>
                    {fromCity.code}
                  </div>
                  <div className="text-sm opacity-60 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {fromCity.name}, {fromCity.country}
                  </div>
                </div>
                {fromOpen && (
                  <div className="absolute top-full mt-2 left-0 right-0 rounded-xl z-50 overflow-hidden"
                    style={{ background: "#1a1929", border: "1px solid rgba(65,64,102,0.6)" }}>
                    {CITIES.filter(c => c.code !== to).map((city) => (
                      <div key={city.code} className="px-4 py-3 cursor-pointer hover:bg-[#414066] transition-colors flex items-center justify-between"
                        onClick={() => { setFrom(city.code); setFromOpen(false); }}>
                        <span style={{ fontFamily: "'DM Sans', sans-serif" }}>{city.name}, {city.country}</span>
                        <span className="text-xs font-bold" style={{ color: "#CEFF1A", fontFamily: "'Clash Display', sans-serif" }}>{city.code}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SWAP */}
              <div className="flex items-center justify-center">
                <button onClick={swapCities}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:rotate-180"
                  style={{ background: "#CEFF1A", color: "#0f0e1a", transition: "all 0.3s ease" }}>
                  <ArrowLeftRight size={16} />
                </button>
              </div>

              {/* TO */}
              <div className="relative">
                <div className="rounded-xl p-4 cursor-pointer hover:border-[#CEFF1A] transition-colors"
                  style={{ background: "rgba(15,14,26,0.6)", border: "1px solid rgba(65,64,102,0.6)" }}
                  onClick={() => { setToOpen(!toOpen); setFromOpen(false); }}>
                  <div className="flex items-center gap-2 mb-1">
                    <PlaneLanding size={14} style={{ color: "#CEFF1A" }} />
                    <span className="text-xs opacity-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>To</span>
                  </div>
                  <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#CEFF1A", lineHeight: 1 }}>
                    {toCity.code}
                  </div>
                  <div className="text-sm opacity-60 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {toCity.name}, {toCity.country}
                  </div>
                </div>
                {toOpen && (
                  <div className="absolute top-full mt-2 left-0 right-0 rounded-xl z-50 overflow-hidden"
                    style={{ background: "#1a1929", border: "1px solid rgba(65,64,102,0.6)" }}>
                    {CITIES.filter(c => c.code !== from).map((city) => (
                      <div key={city.code} className="px-4 py-3 cursor-pointer hover:bg-[#414066] transition-colors flex items-center justify-between"
                        onClick={() => { setTo(city.code); setToOpen(false); }}>
                        <span style={{ fontFamily: "'DM Sans', sans-serif" }}>{city.name}, {city.country}</span>
                        <span className="text-xs font-bold" style={{ color: "#CEFF1A", fontFamily: "'Clash Display', sans-serif" }}>{city.code}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* DATES + PASSENGERS + SEARCH */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">

              {/* Depart */}
              <div className="rounded-xl p-4" style={{ background: "rgba(15,14,26,0.6)", border: "1px solid rgba(65,64,102,0.6)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={14} style={{ color: "#CEFF1A" }} />
                  <span className="text-xs opacity-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>Depart</span>
                </div>
                <input type="date" value={depart} onChange={(e) => setDepart(e.target.value)}
                  className="w-full bg-transparent outline-none text-white"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", colorScheme: "dark" }} />
              </div>

              {/* Return */}
              <div className="rounded-xl p-4" style={{
                background: "rgba(15,14,26,0.6)",
                border: `1px solid ${tripType === "roundtrip" ? "rgba(65,64,102,0.6)" : "rgba(65,64,102,0.2)"}`,
                opacity: tripType === "roundtrip" ? 1 : 0.4
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={14} style={{ color: "#CEFF1A" }} />
                  <span className="text-xs opacity-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>Return</span>
                </div>
                <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)}
                  disabled={tripType !== "roundtrip"}
                  className="w-full bg-transparent outline-none text-white disabled:cursor-not-allowed"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", colorScheme: "dark" }} />
              </div>

              {/* Passengers */}
              <div className="rounded-xl p-4" style={{ background: "rgba(15,14,26,0.6)", border: "1px solid rgba(65,64,102,0.6)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Users size={14} style={{ color: "#CEFF1A" }} />
                  <span className="text-xs opacity-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>Passengers & Class</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                      style={{ background: "rgba(65,64,102,0.6)", color: "white" }}>−</button>
                    <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.1rem", fontWeight: 600 }}>{passengers}</span>
                    <button onClick={() => setPassengers(Math.min(9, passengers + 1))}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                      style={{ background: "#CEFF1A", color: "#0f0e1a" }}>+</button>
                  </div>
                  <select value={cabinClass} onChange={(e) => setCabinClass(e.target.value)}
                    className="bg-transparent outline-none text-sm opacity-70"
                    style={{ fontFamily: "'DM Sans', sans-serif", colorScheme: "dark" }}>
                    <option value="Economy" style={{ background: "#1a1929" }}>Economy</option>
                    <option value="Business" style={{ background: "#1a1929" }}>Business</option>
                    <option value="First" style={{ background: "#1a1929" }}>First Class</option>
                  </select>
                </div>
              </div>

              {/* SEARCH BUTTON */}
              <button className="rounded-xl px-6 py-4 font-bold flex items-center gap-2 transition-all hover:scale-105 hover:shadow-lg whitespace-nowrap"
                style={{ background: "#CEFF1A", color: "#0f0e1a", fontFamily: "'Clash Display', sans-serif", fontSize: "1rem", boxShadow: "0 0 30px rgba(206,255,26,0.3)" }}>
                <Search size={18} />
                Search Flights
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div className="flex flex-wrap justify-center gap-8 mt-10 z-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          {[["500+", "Destinations"], ["2M+", "Happy Travelers"], ["50+", "Airlines"], ["24/7", "Support"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#CEFF1A" }}>{num}</div>
              <div className="text-xs opacity-50 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "#CEFF1A", fontFamily: "'DM Sans', sans-serif" }}>✦ Explore</p>
          <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, marginBottom: "2rem" }}>
            Popular Destinations
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { city: "Tokyo", country: "Japan", code: "NRT", price: "₱18,500", tag: "Trending" },
            { city: "Singapore", country: "Singapore", code: "SIN", price: "₱6,200", tag: "Best Value" },
            { city: "Dubai", country: "UAE", code: "DXB", price: "₱22,800", tag: "Luxury" },
          ].map((dest, i) => (
            <motion.div key={dest.city}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-6 cursor-pointer group transition-all hover:scale-[1.02]"
              style={{ background: "rgba(65,64,102,0.15)", border: "1px solid rgba(65,64,102,0.4)" }}>
              <div className="flex justify-between items-start mb-8">
                <span className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: "rgba(206,255,26,0.15)", color: "#CEFF1A", fontFamily: "'DM Sans', sans-serif" }}>
                  {dest.tag}
                </span>
                <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "2rem", fontWeight: 700, color: "rgba(255,255,255,0.1)" }}>
                  {dest.code}
                </span>
              </div>
              <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.5rem", fontWeight: 700 }}>{dest.city}</h3>
              <p className="text-sm opacity-50 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>{dest.country}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs opacity-40" style={{ fontFamily: "'DM Sans', sans-serif" }}>From </span>
                  <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#CEFF1A" }}>{dest.price}</span>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ background: "#CEFF1A" }}>
                  <PlaneTakeoff size={14} color="#0f0e1a" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-8 py-10 border-t" style={{ borderColor: "rgba(65,64,102,0.3)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#CEFF1A" }}>
              <PlaneTakeoff size={12} color="#0f0e1a" />
            </div>
            <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700 }}>Kai2 Flight</span>
          </div>
          <p className="text-xs opacity-40" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            © 2026 Kai2 Flight Booking System. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}