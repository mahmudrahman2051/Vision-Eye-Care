import React, { useState, useEffect, useRef } from 'react';

const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const stageRef = useRef(null);
  const dotRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    // Start fade out after 1.6s, call onFinish after animation completes (~2s total)
    const fadeTimer = setTimeout(() => setFadeOut(true), 1600);
    const finishTimer = setTimeout(() => onFinish(), 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [onFinish]);

  useEffect(() => {
    const stage = stageRef.current;
    const dot = dotRef.current;
    if (!stage || !dot) return;

    const NS = "http://www.w3.org/2000/svg";
    const svg = stage.querySelector('svg');
    const maskA = svg.querySelector('#mask-a');
    const maskB = svg.querySelector('#mask-b');
    const geo = svg.querySelector('#trace-geo');
    const glowGrad = svg.querySelector('#head-glow');
    const glowUse = svg.querySelector('#glow-layer');
    const sweepGrad = svg.querySelector('#sweep-grad');
    const sweepUse = svg.querySelector('#sweep-layer');
    const layerA = svg.querySelector('#layer-a');
    const layerB = svg.querySelector('#layer-b');
    const finalUse = svg.querySelector('#final-layer');

    const T_APPEAR = 100, T_DRAW = 1200, T_FINISH = 300;
    const LAG = 140;
    const MOVE_WEIGHT = 0.15;

    const C1 = { x: 1053, y: 590 }, C2 = { x: 412, y: 590 };
    const RAD = Math.PI / 180;

    function arcPts(c, r0, r1, a0, a1) {
      const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 1.5));
      const out = [];
      for (let i = 0; i <= n; i++) {
        const u = i / n, a = (a0 + (a1 - a0) * u) * RAD, r = r0 + (r1 - r0) * u;
        out.push([c.x + r * Math.cos(a), c.y + r * Math.sin(a)]);
      }
      return out;
    }

    function toD(p) {
      return "M" + p.map(q => q[0].toFixed(1) + " " + q[1].toFixed(1)).join("L");
    }

    const items = [
      { draw: true, w: 124, pts: arcPts(C1, 230, 230, 0, 360) },
      { draw: false, pts: arcPts(C1, 230, 212, 360, 595) },
      { draw: true, w: 100, pts: [[850, 452], [630, 462]] },
      { draw: true, w: 124, pts: arcPts(C2, 230, 230, 330, -30) },
      { draw: true, w: 70, pts: arcPts(C2, 315, 315, 213, 265) },
      { draw: true, w: 70, pts: arcPts(C1, 315, 315, 280, 328) },
    ];

    let segs = [], total = 0, scale = 1;
    const head = { x: 1283, y: 590 };

    // Build
    const list = [];
    items.forEach((it, i) => {
      if (i > 0) {
        const prev = list[list.length - 1].pts;
        const a = prev[prev.length - 1], b = it.pts[0];
        if (Math.hypot(a[0] - b[0], a[1] - b[1]) > 1.5) list.push({ draw: false, pts: [a, b] });
      }
      list.push(it);
    });

    let acc = 0;
    list.forEach(it => {
      const d = toD(it.pts);
      const g = document.createElementNS(NS, "path");
      g.setAttribute("d", d);
      geo.appendChild(g);
      const len = g.getTotalLength();
      const seg = { draw: it.draw, len, cost: len * (it.draw ? 1 : MOVE_WEIGHT), start: acc, geo: g };
      if (it.draw) {
        ["a", "b"].forEach(k => {
          const p = document.createElementNS(NS, "path");
          p.setAttribute("d", d);
          p.setAttribute("fill", "none");
          p.setAttribute("stroke", "#fff");
          p.setAttribute("stroke-width", it.w);
          p.setAttribute("stroke-linejoin", "round");
          p.setAttribute("stroke-dasharray", len + " " + len);
          p.setAttribute("stroke-dashoffset", len);
          (k === "a" ? maskA : maskB).appendChild(p);
          seg[k] = p;
        });
      }
      segs.push(seg);
      acc += seg.cost;
    });
    total = acc;

    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function easeIO(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function ease(t) { return 0.3 * easeIO(t) + 0.7 * t; }

    function resize() { scale = stage.clientWidth / 1482; }
    window.addEventListener("resize", resize);
    resize();

    function render(d, lag) {
      let found = false;
      for (let i = 0; i < segs.length; i++) {
        const s = segs[i];
        if (s.draw) {
          s.a.setAttribute("stroke-dashoffset", s.len * (1 - clamp01((d - s.start) / s.cost)));
          s.b.setAttribute("stroke-dashoffset", s.len * (1 - clamp01((d - lag - s.start) / s.cost)));
        }
        if (!found && (d <= s.start + s.cost || i === segs.length - 1)) {
          const p = clamp01((d - s.start) / s.cost);
          const pt = s.geo.getPointAtLength(p * s.len);
          head.x = pt.x;
          head.y = pt.y;
          found = true;
        }
      }
      glowGrad.setAttribute("cx", head.x);
      glowGrad.setAttribute("cy", head.y);
    }

    function placeDot(opacity, k) {
      dot.style.opacity = opacity;
      dot.style.transform = `translate3d(${head.x * scale}px,${head.y * scale}px,0) scale(${k})`;
    }

    function setSweep(sp) {
      if (sp <= 0 || sp >= 1) { sweepUse.setAttribute("opacity", 0); return; }
      const x = -400 + sp * (1482 + 800);
      sweepGrad.setAttribute("x1", x);
      sweepGrad.setAttribute("x2", x + 300);
      sweepUse.setAttribute("opacity", 1);
    }

    function setFinal(on) {
      finalUse.setAttribute("visibility", on ? "visible" : "hidden");
      layerA.setAttribute("visibility", on ? "hidden" : "visible");
      layerB.setAttribute("visibility", on ? "hidden" : "visible");
    }

    function showComplete() {
      setFinal(true);
      render(total + 1, 0);
      glowUse.setAttribute("opacity", 0);
      setSweep(0);
      dot.style.opacity = 0;
    }

    let t0 = 0;
    function frame(now) {
      const e = now - t0;
      if (e < T_APPEAR) {
        render(0, LAG);
        glowUse.setAttribute("opacity", 0);
        placeDot(clamp01(e / T_APPEAR), 1);
      } else if (e < T_APPEAR + T_DRAW) {
        render(ease((e - T_APPEAR) / T_DRAW) * total, LAG);
        glowUse.setAttribute("opacity", 1);
        placeDot(1, 1);
      } else if (e < T_APPEAR + T_DRAW + T_FINISH) {
        const f = e - T_APPEAR - T_DRAW;
        render(total, LAG * (1 - easeIO(clamp01(f / 350))));
        const k = f < 200 ? 1 + 0.9 * easeIO(f / 200) : 1.9 - 0.9 * clamp01((f - 200) / 220);
        placeDot(f < 200 ? 1 : 1 - clamp01((f - 200) / 220), k);
        glowUse.setAttribute("opacity", 1 - clamp01(f / 400));
        setSweep(f / T_FINISH);
      } else {
        showComplete();
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    }

    // Start animation
    setFinal(false);
    render(0, LAG);
    placeDot(0, 1);
    rafRef.current = requestAnimationFrame(now => { t0 = now; frame(now); });

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-400 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ background: '#14161a' }}
    >
      <div
        ref={stageRef}
        className="relative w-[84vw] max-w-[1100px]"
        style={{ aspectRatio: '1482 / 1062' }}
      >
        <svg
          viewBox="0 0 1482 1062"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full block"
          style={{ overflow: 'visible' }}
          role="img"
          aria-label="Vision Eye Care logo"
        >
          <defs>
            <path id="logo-path" fillRule="evenodd" d="M1030.00,843.39C999.99,841.29 969.00,833.98 943.23,822.93C899.03,803.97 860.70,771.83 834.65,731.86C813.48,699.39 800.50,661.03 797.47,622.00C796.94,615.19 797.15,612.66 798.52,609.25C801.71,601.27 810.39,596.60 817.86,598.84C827.03,601.59 830.06,606.71 832.45,623.50C837.21,656.97 847.62,685.09 865.04,711.50C874.94,726.52 881.64,734.50 895.69,748.00C927.58,778.65 966.82,797.77 1014.00,805.65C1027.12,807.83 1061.92,808.12 1076.00,806.16C1142.96,796.83 1203.68,759.32 1238.40,705.82C1289.01,627.85 1280.76,515.13 1219.07,441.76C1189.96,407.13 1145.36,381.08 1099.85,372.13C1081.25,368.47 1070.93,367.69 1049.13,368.29C1026.22,368.93 1015.62,370.39 996.71,375.53C966.01,383.86 939.79,396.72 916.02,415.09C895.46,430.98 880.20,447.70 864.30,471.75C856.19,484.01 851.97,489.49 849.70,490.69C845.27,493.02 837.25,492.92 833.06,490.46C827.28,487.08 825.52,483.74 825.34,475.86C825.17,468.03 824.04,466.08 817.82,462.91C812.02,459.95 798.55,456.40 785.50,454.39C768.14,451.71 710.83,451.66 694.00,454.31C673.54,457.52 657.23,462.56 652.30,467.18C648.75,470.52 649.36,474.85 655.38,488.92C667.63,517.59 673.58,545.10 674.66,578.00C676.37,630.41 661.86,680.42 632.00,725.00C620.69,741.88 613.17,751.02 599.09,765.00C560.73,803.09 509.35,828.96 455.00,837.56C441.18,839.74 401.74,840.63 387.83,839.07C327.45,832.30 276.59,808.96 234.09,768.51C215.99,751.28 194.31,722.05 182.62,699.11C157.70,650.21 150.72,601.70 160.56,546.00C172.49,478.53 214.17,416.11 273.58,376.75C347.81,327.57 436.28,317.48 515.78,349.12C549.67,362.61 568.02,374.52 608.00,408.99C613.83,414.01 621.39,419.47 625.00,421.26C631.02,424.24 632.21,424.47 641.00,424.37C646.23,424.31 657.64,423.07 666.37,421.60C714.13,413.60 779.48,414.22 822.86,423.09C836.32,425.84 841.45,425.62 848.59,422.01C854.51,419.01 857.56,416.75 879.66,398.98C929.60,358.81 976.83,338.25 1033.50,332.01C1078.70,327.03 1134.05,338.27 1176.99,361.14C1237.00,393.12 1282.40,450.72 1299.90,517.10C1306.65,542.73 1309.01,561.67 1308.98,590.21C1308.96,626.28 1303.82,652.72 1290.40,685.83C1278.59,714.96 1263.04,738.39 1239.82,762.03C1219.71,782.50 1198.18,798.30 1171.82,811.95C1140.29,828.26 1112.66,837.07 1079.00,841.53C1067.39,843.07 1040.15,844.10 1030.00,843.39Z M441.03,802.95C474.71,798.77 506.45,787.87 533.35,771.23C571.71,747.50 603.14,710.82 620.56,669.47C640.19,622.87 642.99,570.34 628.53,520.10C616.96,479.92 593.72,444.08 563.00,419.06C532.06,393.86 498.49,378.41 458.12,370.77C442.40,367.80 404.63,367.54 387.00,370.29C352.61,375.65 315.61,390.42 288.00,409.81C245.83,439.42 213.35,485.22 200.51,533.16C194.51,555.56 193.52,563.67 193.56,590.00C193.60,612.80 193.80,615.40 196.35,627.50C208.47,684.85 242.65,734.54 292.49,767.27C321.33,786.21 356.28,798.95 390.24,802.90C400.87,804.13 431.23,804.16 441.03,802.95Z M920.01,745.83C911.13,741.33 888.85,716.65 879.10,700.53C870.82,686.84 876.83,673.00 891.06,673.00C898.11,673.00 901.64,675.47 907.42,684.41C914.40,695.23 926.16,709.21 934.23,716.30C944.17,725.03 946.27,731.48 941.73,739.41C938.67,744.77 935.02,747.20 929.32,747.70C925.68,748.01 923.40,747.55 920.01,745.83Z M270.25,704.25C261.14,698.05 246.04,675.39 238.12,656.00C227.85,630.85 223.60,603.84 225.77,577.33C228.45,544.41 238.76,513.43 255.57,487.72C268.00,468.72 272.20,465.00 281.23,465.00C289.89,465.00 296.95,471.95 296.98,480.50C297.00,485.13 295.80,487.54 287.15,500.16C275.05,517.82 265.25,541.95 261.41,563.50C258.74,578.49 258.94,602.16 261.85,616.83C264.18,628.63 269.87,645.89 274.25,654.50C276.47,658.85 281.47,666.57 292.32,682.39C294.76,685.94 295.09,687.26 294.77,692.05C294.35,698.44 292.23,701.88 286.86,704.93C281.58,707.94 275.30,707.68 270.25,704.25Z M806.21,580.33C796.89,575.74 795.64,567.48 800.59,543.00C804.30,524.62 806.87,519.21 813.35,516.07C821.30,512.22 830.71,514.56 834.96,521.43C837.65,525.79 837.46,531.67 834.13,547.00C832.99,552.23 831.59,559.84 831.01,563.91C830.43,567.99 829.05,572.80 827.94,574.59C823.99,581.00 813.29,583.82 806.21,580.33Z M164.68,405.60C156.83,402.70 153.58,397.52 154.20,388.92C154.70,381.98 156.75,378.74 168.95,365.61C205.07,326.74 255.26,295.38 310.00,277.48C325.12,272.53 335.57,271.78 341.47,275.22C351.70,281.18 353.76,293.51 346.00,302.34C342.42,306.42 338.94,307.93 322.83,312.39C272.94,326.22 223.30,356.72 191.04,393.39C180.41,405.46 173.28,408.76 164.68,405.60Z M1292.25,405.34C1288.92,404.16 1286.05,401.59 1279.02,393.52C1243.62,352.85 1195.36,323.36 1144.00,311.00C1130.03,307.64 1126.31,305.49 1122.89,298.79C1119.51,292.16 1120.67,284.12 1125.81,278.63C1133.36,270.55 1145.30,271.17 1173.50,281.08C1229.19,300.65 1273.04,330.62 1308.75,373.52C1319.04,385.89 1317.77,399.06 1305.71,404.90C1300.68,407.33 1298.12,407.42 1292.25,405.34Z" />

            <mask id="mask-a" maskUnits="userSpaceOnUse" x="0" y="0" width="1482" height="1062"></mask>
            <mask id="mask-b" maskUnits="userSpaceOnUse" x="0" y="0" width="1482" height="1062"></mask>

            <linearGradient id="champagneGold" gradientUnits="userSpaceOnUse" x1="130" y1="130" x2="1350" y2="930">
              <stop offset="0%" stopColor="#FFF0B3" />
              <stop offset="35%" stopColor="#E7B84A" />
              <stop offset="65%" stopColor="#C88A1A" />
              <stop offset="100%" stopColor="#F6D77A" />
            </linearGradient>

            <radialGradient id="head-glow" gradientUnits="userSpaceOnUse" cx="1283" cy="590" r="150">
              <stop offset="0" stopColor="#F6D77A" stopOpacity="0.95" />
              <stop offset="0.45" stopColor="#F6D77A" stopOpacity="0.35" />
              <stop offset="1" stopColor="#F6D77A" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="sweep-grad" gradientUnits="userSpaceOnUse" x1="-400" y1="0" x2="-100" y2="300">
              <stop offset="0" stopColor="#FFF0B3" stopOpacity="0" />
              <stop offset="0.5" stopColor="#FFF0B3" stopOpacity="0.8" />
              <stop offset="1" stopColor="#FFF0B3" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g id="trace-geo" fill="none" stroke="none"></g>

          <use id="layer-a" href="#logo-path" fill="#FFF0B3" mask="url(#mask-a)" />
          <use id="layer-b" href="#logo-path" fill="url(#champagneGold)" mask="url(#mask-b)" />
          <use id="glow-layer" href="#logo-path" fill="url(#head-glow)" mask="url(#mask-a)" opacity="0" />
          <use id="final-layer" href="#logo-path" fill="url(#champagneGold)" visibility="hidden" />
          <use id="sweep-layer" href="#logo-path" fill="url(#sweep-grad)" opacity="0" />
        </svg>

        <div
          ref={dotRef}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 'clamp(4px, 0.45vw, 6px)',
            height: 'clamp(4px, 0.45vw, 6px)',
            margin: 'calc(clamp(4px, 0.45vw, 6px) / -2) 0 0 calc(clamp(4px, 0.45vw, 6px) / -2)',
            borderRadius: '50%',
            background: '#FFF0B3',
            boxShadow: '0 0 6px 1px rgba(246,215,122,.9), 0 0 18px 5px rgba(231,184,74,.30)',
            opacity: 0,
            willChange: 'transform, opacity',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
