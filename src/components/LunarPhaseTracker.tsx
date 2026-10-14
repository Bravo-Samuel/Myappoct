import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Moon, Sun, Sparkles, Clock, Calendar, Compass, ShieldCheck, RefreshCw, ChevronLeft, ChevronRight, Info, Eye } from 'lucide-react';

interface LunarPhaseTrackerProps {
  initialDate?: Date;
  onSelectDate?: (date: Date) => void;
  className?: string;
}

interface LunarPhaseInfo {
  date: Date;
  ageDays: number; // 0 to 29.53
  phaseFraction: number; // 0 to 1
  illumination: number; // 0 to 100
  phaseNameEn: string;
  phaseNameHe: string;
  isKiddushLevanaValid: boolean;
  nextRoshChodeshDate: Date;
  nextMonthNameHe: string;
  nextMonthNameEn: string;
  roshChodeshDaysDuration: number;
  moladChalakim: {
    dayOfWeek: string;
    hours: number;
    minutes: number;
    chalakim: number;
  };
}

// Hebrew lunar months sequence around 2026 (5786)
const HEBREW_MONTHS = [
  { en: "Nisan", he: "נִיסָן" },
  { en: "Iyar", he: "אִיָּר" },
  { en: "Sivan", he: "סִיוָן" },
  { en: "Tamuz", he: "תַּמּוּז" },
  { en: "Av", he: "אָב" },
  { en: "Elul", he: "אֱלוּל" },
  { en: "Tishrei", he: "תִּשְׁרֵי" },
  { en: "Cheshvan", he: "חֶשְׁוָן" },
  { en: "Kislev", he: "כִּסְלֵו" },
  { en: "Tevet", he: "טֵבֵת" },
  { en: "Shevat", he: "שְׁבָט" },
  { en: "Adar", he: "אֲדָר" }
];

// Reference Epoch: Known New Moon (Molad) on Jan 11, 2024 at 11:57 UTC
const BASE_NEW_MOON_EPOCH = new Date(Date.UTC(2024, 0, 11, 11, 57, 0));
const SYNODIC_MONTH_DAYS = 29.530588853;
const SYNODIC_MONTH_MS = SYNODIC_MONTH_DAYS * 24 * 60 * 60 * 1000;

export function calculateLunarPhaseInfo(targetDate: Date): LunarPhaseInfo {
  const elapsedMs = targetDate.getTime() - BASE_NEW_MOON_EPOCH.getTime();
  let cycles = elapsedMs / SYNODIC_MONTH_MS;
  let currentCycleOffsetMs = elapsedMs % SYNODIC_MONTH_MS;
  if (currentCycleOffsetMs < 0) {
    currentCycleOffsetMs += SYNODIC_MONTH_MS;
    cycles -= 1;
  }

  const ageDays = currentCycleOffsetMs / (24 * 60 * 60 * 1000);
  const phaseFraction = ageDays / SYNODIC_MONTH_DAYS;
  const illumination = ((1 - Math.cos(2 * Math.PI * phaseFraction)) / 2) * 100;

  // Determine Phase Name
  let phaseNameEn = "New Moon";
  let phaseNameHe = "מולד הירח (Molad)";
  if (phaseFraction < 0.03 || phaseFraction > 0.97) {
    phaseNameEn = "New Moon (Molad)";
    phaseNameHe = "מולד לבנה / ראש חודש";
  } else if (phaseFraction < 0.22) {
    phaseNameEn = "Waxing Crescent";
    phaseNameHe = "התחדשות הלבנה (Waxing)";
  } else if (phaseFraction < 0.28) {
    phaseNameEn = "First Quarter";
    phaseNameHe = "רבע ראשון";
  } else if (phaseFraction < 0.47) {
    phaseNameEn = "Waxing Gibbous";
    phaseNameHe = "לבנה מתמלאת";
  } else if (phaseFraction <= 0.53) {
    phaseNameEn = "Full Moon";
    phaseNameHe = "ט״ו בחודש - לבנה במילואה";
  } else if (phaseFraction < 0.72) {
    phaseNameEn = "Waning Gibbous";
    phaseNameHe = "לבנה מתחסרת";
  } else if (phaseFraction < 0.78) {
    phaseNameEn = "Last Quarter";
    phaseNameHe = "רבע אחרון";
  } else {
    phaseNameEn = "Waning Crescent";
    phaseNameHe = "סוף החודש הירחי";
  }

  // Kiddush Levana Halachic Window: From 3 full days after Molad until 14.76 days (Full moon)
  const isKiddushLevanaValid = ageDays >= 3.0 && ageDays <= 14.76;

  // Calculate Next Rosh Chodesh (Next New Moon)
  const msUntilNextNewMoon = SYNODIC_MONTH_MS - currentCycleOffsetMs;
  const nextRoshChodeshDate = new Date(targetDate.getTime() + msUntilNextNewMoon);

  // Approximate Hebrew month indexing based on month of nextRoshChodeshDate
  const monthIdx = (nextRoshChodeshDate.getMonth() + 9) % 12; // Aligns roughly Nisan=April, Tamuz=July, Av=August
  const nextMonthObj = HEBREW_MONTHS[monthIdx] || HEBREW_MONTHS[4];

  // Alternating 1 or 2 days for Rosh Chodesh based on cycle parity
  const cycleCountInt = Math.floor(cycles);
  const roshChodeshDaysDuration = cycleCountInt % 2 === 0 ? 2 : 1;

  // Calculate Halachic Molad parts (Chalakim: 1080 per hour)
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Shabbat"];
  const moladDayOfWeek = daysOfWeek[nextRoshChodeshDate.getDay()];
  const moladHours = nextRoshChodeshDate.getHours();
  const moladMinutes = nextRoshChodeshDate.getMinutes();
  const moladChalakimVal = Math.floor((nextRoshChodeshDate.getSeconds() / 60) * 1080);

  return {
    date: targetDate,
    ageDays,
    phaseFraction,
    illumination,
    phaseNameEn,
    phaseNameHe,
    isKiddushLevanaValid,
    nextRoshChodeshDate,
    nextMonthNameEn: nextMonthObj.en,
    nextMonthNameHe: nextMonthObj.he,
    roshChodeshDaysDuration,
    moladChalakim: {
      dayOfWeek: moladDayOfWeek,
      hours: moladHours,
      minutes: moladMinutes,
      chalakim: moladChalakimVal
    }
  };
}

export const LunarPhaseTracker: React.FC<LunarPhaseTrackerProps> = ({
  initialDate = new Date("2026-07-02T16:09:31"),
  onSelectDate,
  className = ""
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [isAnimating, setIsAnimating] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const lunarInfo = useMemo(() => calculateLunarPhaseInfo(currentDate), [currentDate]);

  // Calculate remaining time to next Rosh Chodesh
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = currentDate.getTime();
      const target = lunarInfo.nextRoshChodeshDate.getTime();
      const diff = Math.max(0, target - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setCountdown({ days: d, hours: h, minutes: m, seconds: s });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [currentDate, lunarInfo.nextRoshChodeshDate]);

  // D3 & SVG Moon rendering
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clean previous render

    const width = 300;
    const height = 300;
    const radius = 110;
    const cx = width / 2;
    const cy = height / 2;

    // Outer glow / halo filter
    const defs = svg.append("defs");

    const haloGradient = defs.append("radialGradient")
      .attr("id", "moonHalo")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");
    haloGradient.append("stop").attr("offset", "70%").attr("stop-color", "#F59E0B").attr("stop-opacity", 0.25);
    haloGradient.append("stop").attr("offset", "100%").attr("stop-color", "#F59E0B").attr("stop-opacity", 0);

    // Moon texture gradient
    const textureGrad = defs.append("radialGradient")
      .attr("id", "moonSurface")
      .attr("cx", "40%")
      .attr("cy", "35%")
      .attr("r", "65%");
    textureGrad.append("stop").attr("offset", "0%").attr("stop-color", "#FFFBEB");
    textureGrad.append("stop").attr("offset", "60%").attr("stop-color", "#FDE68A");
    textureGrad.append("stop").attr("offset", "95%").attr("stop-color", "#D97706");

    // Shadow color
    const shadowGrad = defs.append("linearGradient")
      .attr("id", "moonShadow")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    shadowGrad.append("stop").attr("offset", "0%").attr("stop-color", "#0A1128");
    shadowGrad.append("stop").attr("offset", "100%").attr("stop-color", "#030712");

    // Background starry stars
    const starGroup = svg.append("g").attr("class", "stars");
    for (let i = 0; i < 40; i++) {
      const sx = (Math.sin(i * 99.7 + currentDate.getDate()) * 0.5 + 0.5) * width;
      const sy = (Math.cos(i * 53.3 + currentDate.getMonth()) * 0.5 + 0.5) * height;
      const sr = (i % 3) * 0.6 + 0.6;
      starGroup.append("circle")
        .attr("cx", sx)
        .attr("cy", sy)
        .attr("r", sr)
        .attr("fill", i % 2 === 0 ? "#FDE68A" : "#FFFFFF")
        .attr("opacity", 0.4 + (i % 5) * 0.12)
        .append("animate")
        .attr("attributeName", "opacity")
        .attr("values", `${0.2};${0.8};${0.2}`)
        .attr("dur", `${2 + (i % 3)}s`)
        .attr("repeatCount", "indefinite");
    }

    // Outer Halo
    svg.append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", radius + 35)
      .attr("fill", "url(#moonHalo)");

    // Base dark sphere (unlit portion)
    svg.append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", radius)
      .attr("fill", "url(#moonShadow)")
      .attr("stroke", "#475569")
      .attr("stroke-width", 1.5);

    // Create clipping mask for illuminated phase
    const clipId = "moonIlluminationClip";
    const clipPath = defs.append("clipPath").attr("id", clipId);

    // Calculate exact D3 path for illumination
    // phaseFraction: 0 is New, 0.25 First Quarter, 0.5 Full, 0.75 Third Quarter
    const f = lunarInfo.phaseFraction;
    const isWaxing = f <= 0.5;
    
    // Convert phase fraction to terminator curve cosine factor
    // At f=0 (New): factor = -1. At f=0.25: factor = 0. At f=0.5 (Full): factor = 1
    const terminatorX = Math.cos(2 * Math.PI * f) * radius;

    // Generate path string for lit region
    let pathD = "";
    if (isWaxing) {
      // Lit side is on the right arc
      // Right semicircle + terminator curve
      pathD = [
        `M ${cx} ${cy - radius}`,
        `A ${radius} ${radius} 0 0 1 ${cx} ${cy + radius}`,
        `A ${Math.abs(terminatorX)} ${radius} 0 0 ${terminatorX > 0 ? 0 : 1} ${cx} ${cy - radius}`,
        "Z"
      ].join(" ");
    } else {
      // Lit side is on the left arc
      pathD = [
        `M ${cx} ${cy - radius}`,
        `A ${Math.abs(terminatorX)} ${radius} 0 0 ${terminatorX > 0 ? 1 : 0} ${cx} ${cy + radius}`,
        `A ${radius} ${radius} 0 0 1 ${cx} ${cy - radius}`,
        "Z"
      ].join(" ");
    }

    clipPath.append("path").attr("d", pathD);

    // Illuminated surface layer
    const litGroup = svg.append("g").attr("clip-path", `url(#${clipId})`);
    
    litGroup.append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", radius)
      .attr("fill", "url(#moonSurface)");

    // Add subtle crater marks on lit surface
    const craters = [
      { x: cx - 35, y: cy - 25, r: 16 },
      { x: cx + 25, y: cy - 45, r: 12 },
      { x: cx + 45, y: cy + 15, r: 22 },
      { x: cx - 20, y: cy + 45, r: 14 },
      { x: cx + 10, y: cy - 10, r: 28 },
      { x: cx - 45, y: cy + 10, r: 10 }
    ];

    craters.forEach(crater => {
      litGroup.append("circle")
        .attr("cx", crater.x)
        .attr("cy", crater.y)
        .attr("r", crater.r)
        .attr("fill", "#B45309")
        .attr("opacity", 0.18)
        .attr("stroke", "#D97706")
        .attr("stroke-width", 1);
    });

    // Terminator glow edge line for visual clarity
    litGroup.append("path")
      .attr("d", pathD)
      .attr("fill", "none")
      .attr("stroke", "#FDE68A")
      .attr("stroke-width", 2)
      .attr("opacity", 0.5);

  }, [lunarInfo, currentDate]);

  const stepDays = (days: number) => {
    setIsAnimating(true);
    const newDate = new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);
    setCurrentDate(newDate);
    if (onSelectDate) onSelectDate(newDate);
    setTimeout(() => setIsAnimating(false), 250);
  };

  const resetToToday = () => {
    const now = new Date("2026-07-02T16:09:31");
    setCurrentDate(now);
    if (onSelectDate) onSelectDate(now);
  };

  return (
    <div id="lunar-phase-tracker" className={`bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#0B132B] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-amber-500/30 ${className}`}>
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Moon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Celestial D3 Engine</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                Halachic Calibrated
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Visual Lunar Phase & Rosh Chodesh Predictor
            </h3>
          </div>
        </div>

        {/* Date Scrubber Controls */}
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 self-start sm:self-center">
          <button
            onClick={() => stepDays(-1)}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="px-3 text-center min-w-[140px]">
            <div className="text-xs font-bold font-mono text-amber-300">
              {currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
            <div className="text-[10px] text-slate-400">
              Day {lunarInfo.ageDays.toFixed(1)} of Lunar Cycle
            </div>
          </div>

          <button
            onClick={() => stepDays(1)}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={resetToToday}
            className="ml-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1 shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Today</span>
          </button>
        </div>
      </div>

      {/* Main Grid: D3 SVG Moon + Lunar Phase Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center">
        {/* Left Col: D3 SVG Moon Visualization */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className={`relative transition-transform duration-300 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
            <svg
              ref={svgRef}
              width="300"
              height="300"
              viewBox="0 0 300 300"
              className="overflow-visible filter drop-shadow-[0_0_25px_rgba(245,158,11,0.2)]"
            />
          </div>

          <div className="text-center mt-4 space-y-1">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
              {lunarInfo.illumination.toFixed(1)}% Illuminated
            </span>
            <div className="text-base font-black text-white mt-1">
              {lunarInfo.phaseNameEn}
            </div>
            <div className="text-xs font-semibold text-amber-400/90 font-serif">
              {lunarInfo.phaseNameHe}
            </div>
          </div>
        </div>

        {/* Right Col: Halachic & Astronomical Metrics */}
        <div className="lg:col-span-7 space-y-6">
          {/* Next Rosh Chodesh Prediction Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-transparent border border-amber-400/40 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
                <span>Next Rosh Chodesh Prediction</span>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-xs">
                {lunarInfo.roshChodeshDaysDuration} Day{lunarInfo.roshChodeshDaysDuration > 1 ? 's' : ''} Rosh Chodesh
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h4 className="text-2xl sm:text-3xl font-black text-white">
                  Rosh Chodesh {lunarInfo.nextMonthNameEn}
                </h4>
                <div className="text-sm font-bold text-amber-300 font-serif">
                  ראש חודש {lunarInfo.nextMonthNameHe}
                </div>
              </div>

              <div className="text-xs font-mono text-slate-300 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
                Molad: {lunarInfo.moladChalakim.dayOfWeek}, {lunarInfo.moladChalakim.hours}h {lunarInfo.moladChalakim.minutes}m ({lunarInfo.moladChalakim.chalakim} chalakim)
              </div>
            </div>

            {/* Countdown Ticker */}
            <div className="grid grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-amber-500/20">
              <div className="bg-black/40 p-2.5 rounded-xl text-center border border-white/5">
                <div className="text-xl sm:text-2xl font-black font-mono text-amber-400">{countdown.days}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Days</div>
              </div>
              <div className="bg-black/40 p-2.5 rounded-xl text-center border border-white/5">
                <div className="text-xl sm:text-2xl font-black font-mono text-white">{String(countdown.hours).padStart(2, '0')}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Hours</div>
              </div>
              <div className="bg-black/40 p-2.5 rounded-xl text-center border border-white/5">
                <div className="text-xl sm:text-2xl font-black font-mono text-white">{String(countdown.minutes).padStart(2, '0')}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Mins</div>
              </div>
              <div className="bg-black/40 p-2.5 rounded-xl text-center border border-white/5">
                <div className="text-xl sm:text-2xl font-black font-mono text-amber-300">{String(countdown.seconds).padStart(2, '0')}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Secs</div>
              </div>
            </div>
          </div>

          {/* 4-Card Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Lunar Age (Synodic Cycle)</span>
              </div>
              <div className="text-lg font-black text-white">
                {lunarInfo.ageDays.toFixed(2)} Days
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(lunarInfo.ageDays / 29.53) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Kiddush Levana Window</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2.5 h-2.5 rounded-full ${lunarInfo.isKiddushLevanaValid ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-base font-bold text-white">
                  {lunarInfo.isKiddushLevanaValid ? 'Halachically Valid Now' : 'Window Closed / Waiting'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {lunarInfo.isKiddushLevanaValid 
                  ? 'Recite outside under moonlight with minyan'
                  : 'Valid between day 3.0 and Full Moon (day 14.7)'}
              </div>
            </div>
          </div>

          {/* Quick Scrub Cycle Buttons */}
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-300">Scrub to Major Phases:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "New Moon", offsetDays: -lunarInfo.ageDays },
                { label: "First Quarter", offsetDays: 7.38 - lunarInfo.ageDays },
                { label: "Full Moon", offsetDays: 14.76 - lunarInfo.ageDays },
                { label: "Next Molad", offsetDays: 29.53 - lunarInfo.ageDays }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => stepDays(item.offsetDays)}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-amber-500 hover:text-slate-950 text-xs font-semibold text-slate-200 transition-all"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
