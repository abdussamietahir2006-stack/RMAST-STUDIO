'use client';
import { useEffect, useRef } from 'react';

interface LogoAnimationProps {
  width?: string | number;
  height?: string | number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  r: number;
  color: string;
  decay: number;
}

export default function LogoAnimation({ width = '100%', height = '100%' }: LogoAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    cv.width = 680;
    cv.height = 460;

    const COLORS = ['#00ffc8', '#00e88a', '#a8ff5a', '#ffe44a', '#ff9f1c'];
    const CY = 240;

    const PHASES = [
      'stem', 'branch1', 'leaf1L', 'leaf1R',
      'branch2', 'leaf2L', 'leaf2R',
      'branch3', 'leaf3L', 'leaf3R', 'crown',
      'R', 'M', 'A', 'S', 'T',
      'studio', 'tagline', 'icons', 'hold', 'fadeout'
    ] as const;

    type Phase = typeof PHASES[number];

    let phase: Phase = 'stem';
    let phaseT = 0;
    let particles: Particle[] = [];
    let animId: number;

    const DURATIONS: Record<Phase, number> = {
      stem: 50, branch1: 30, leaf1L: 28, leaf1R: 28,
      branch2: 28, leaf2L: 26, leaf2R: 26,
      branch3: 24, leaf3L: 22, leaf3R: 22,
      crown: 30, R: 36, M: 36, A: 36, S: 36, T: 36,
      studio: 40, tagline: 36, icons: 60, hold: 100, fadeout: 50
    };

    const leafColors = ['#00ffc8', '#a8ff5a', '#ffe44a'];

    function easeOut(t: number) { return 1 - Math.pow(1 - Math.min(t, 1), 3); }
    function easeIn(t: number) { return Math.pow(Math.min(t, 1), 2); }
    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    function drawAI(x: number, y: number, a: number) {
      if (!ctx) return;
      ctx.save(); ctx.globalAlpha = a;
      ctx.strokeStyle = '#00ffc8'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x - 6, y - 4, 7, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x + 6, y - 4, 7, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 1;
      [[x - 9, y + 3, x - 4, y + 10], [x + 9, y + 3, x + 4, y + 10], [x, y + 3, x, y + 10]].forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      });
      ctx.beginPath(); ctx.arc(x, y - 4, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#00ffc8'; ctx.fill();
      ctx.restore();
    }

    function drawML(x: number, y: number, a: number) {
      if (!ctx) return;
      ctx.save(); ctx.globalAlpha = a;
      ctx.strokeStyle = '#a8ff5a'; ctx.lineWidth = 1.5;
      const nodes: [number, number][] = [[x, y - 12], [x - 10, y + 4], [x + 10, y + 4], [x - 5, y + 14], [x + 5, y + 14]];
      const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 4], [1, 2], [3, 4]];
      edges.forEach(([u, v]) => {
        ctx.beginPath(); ctx.moveTo(nodes[u][0], nodes[u][1]); ctx.lineTo(nodes[v][0], nodes[v][1]); ctx.stroke();
      });
      nodes.forEach(([nx, ny]) => {
        ctx.beginPath(); ctx.arc(nx, ny, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#a8ff5a'; ctx.fill();
      });
      ctx.restore();
    }

    function drawWeb(x: number, y: number, a: number) {
      if (!ctx) return;
      ctx.save(); ctx.globalAlpha = a;
      ctx.strokeStyle = '#ffe44a'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x, y, 6, 13, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 13, y); ctx.lineTo(x+13, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 11, y - 7); ctx.lineTo(x + 11, y - 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 11, y + 7); ctx.lineTo(x + 11, y + 7); ctx.stroke();
      ctx.restore();
    }

    function drawCode(x: number, y: number, a: number) {
      if (!ctx) return;
      ctx.save(); ctx.globalAlpha = a;
      ctx.strokeStyle = '#ff9f1c'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x - 4, y - 8); ctx.lineTo(x - 12, y); ctx.lineTo(x - 4, y + 8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 4, y - 8); ctx.lineTo(x + 12, y); ctx.lineTo(x + 4, y + 8); ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x - 2, y + 10); ctx.lineTo(x + 2, y - 10); ctx.stroke();
      ctx.restore();
    }

    function drawDB(x: number, y: number, a: number) {
      if (!ctx) return;
      ctx.save(); ctx.globalAlpha = a;
      ctx.strokeStyle = '#00e88a'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(x, y - 8, 10, 4, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x, y, 10, 4, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x, y + 8, 10, 4, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 10, y - 8); ctx.lineTo(x - 10, y + 8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 10, y - 8); ctx.lineTo(x + 10, y + 8); ctx.stroke();
      ctx.restore();
    }

    function drawCloud(x: number, y: number, a: number) {
      if (!ctx) return;
      ctx.save(); ctx.globalAlpha = a;
      ctx.strokeStyle = '#00ffc8'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x - 6, y + 2, 7, Math.PI * 0.5, Math.PI * 1.5);
      ctx.arc(x - 2, y - 6, 6, Math.PI, Math.PI * 2);
      ctx.arc(x + 6, y - 4, 7, Math.PI * 1.5, Math.PI * 0.5);
      ctx.lineTo(x - 6, y + 9); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y + 8); ctx.lineTo(x, y + 2);
      ctx.moveTo(x - 3, y + 5); ctx.lineTo(x, y + 2); ctx.lineTo(x + 3, y + 5); ctx.stroke();
      ctx.restore();
    }

    function draw3D(x: number, y: number, a: number) {
      if (!ctx) return;
      ctx.save(); ctx.globalAlpha = a;
      ctx.strokeStyle = '#a8ff5a'; ctx.lineWidth = 1.5;
      const s = 9;
      ctx.beginPath();
      ctx.moveTo(x - s, y); ctx.lineTo(x, y - s); ctx.lineTo(x + s, y); ctx.lineTo(x, y + s); ctx.closePath(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - s + 4, y - 4); ctx.lineTo(x + 4, y - s - 4); ctx.lineTo(x + s + 4, y - 4); ctx.lineTo(x + 4, y + s - 4); ctx.closePath(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - s, y); ctx.lineTo(x - s + 4, y - 4);
      ctx.moveTo(x + s, y); ctx.lineTo(x + s + 4, y - 4);
      ctx.moveTo(x, y + s); ctx.lineTo(x + 4, y + s - 4); ctx.stroke();
      ctx.restore();
    }

    function drawAPI(x: number, y: number, a: number) {
      if (!ctx) return;
      ctx.save(); ctx.globalAlpha = a;
      ctx.strokeStyle = '#ffe44a'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(x - 14, y - 12, 12, 10, 2); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(x + 2, y - 12, 12, 10, 2); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(x - 8, y + 2, 16, 10, 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 8, y - 7); ctx.lineTo(x + 2, y - 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y + 2); ctx.lineTo(x, y - 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 2, y - 4); ctx.lineTo(x + 2, y - 4); ctx.lineTo(x + 2, y - 2); ctx.stroke();
      ctx.restore();
    }

    const TECH_ICONS = [
      { x: 68,  y: 158, label: 'AI',    color: '#00ffc8', draw: drawAI },
      { x: 140, y: 100, label: 'ML',    color: '#a8ff5a', draw: drawML },
      { x: 540, y: 100, label: 'WEB',   color: '#ffe44a', draw: drawWeb },
      { x: 612, y: 158, label: 'CODE',  color: '#ff9f1c', draw: drawCode },
      { x: 68,  y: 340, label: 'DB',    color: '#00e88a', draw: drawDB },
      { x: 612, y: 340, label: 'CLOUD', color: '#00ffc8', draw: drawCloud },
      { x: 140, y: 390, label: '3D',    color: '#a8ff5a', draw: draw3D },
      { x: 540, y: 390, label: 'API',   color: '#ffe44a', draw: drawAPI },
    ];

    function spawnBurst(x: number, y: number, color: string, n = 12) {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const sp = Math.random() * 2.5 + 0.8;
        particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          alpha: 1,
          r: Math.random() * 2.5 + 0.5,
          color,
          decay: 0.025 + Math.random() * 0.02
        });
      }
    }

    function drawBg() {
      if (!ctx) return;
      ctx.fillStyle = '#060e0a';
      ctx.fillRect(0, 0, 680, 460);
      ctx.fillStyle = 'rgba(0,255,200,0.07)';
      for (let x = 0; x < 680; x += 40) {
        for (let y = 0; y < 460; y += 40) {
          ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    function drawParticles() {
      if (!ctx) return;
      particles = particles.filter(p => p.alpha > 0.02);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vx *= 0.91; p.vy *= 0.91; p.alpha -= p.decay;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
    }

    function drawCorners(alpha: number) {
      if (!ctx || alpha <= 0) return;
      ctx.strokeStyle = `rgba(0,255,200,${alpha * 0.3})`; ctx.lineWidth = 1;
      [[28, 36, 1, 1], [652, 36, -1, 1]].forEach(([x, y, dx, dy]) => {
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx * 20, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + dy * 20); ctx.stroke();
      });
      ctx.strokeStyle = `rgba(255,228,74,${alpha * 0.3})`;
      [[28, 424, 1, -1], [652, 424, -1, -1]].forEach(([x, y, dx, dy]) => {
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx * 20, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + dy * 20); ctx.stroke();
      });
    }

    function drawStem(p: number) {
      if (!ctx || p <= 0) return;
      const top = lerp(460, 105, easeOut(p));
      const grad = ctx.createLinearGradient(340, 105, 340, 460);
      grad.addColorStop(0, 'rgba(0,255,200,0.6)');
      grad.addColorStop(1, 'rgba(0,255,200,0)');
      ctx.strokeStyle = grad; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(340, 460); ctx.lineTo(340, top); ctx.stroke();
    }

    function drawBranch(bx: number, by: number, ex: number, ey: number, p: number, color: string) {
      if (!ctx || p <= 0) return;
      const nx = lerp(bx, ex, easeOut(p)), ny = lerp(by, ey, easeOut(p));
      ctx.strokeStyle = color + '66'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(nx, ny); ctx.stroke();
    }

    function drawLeaf(p: number, pts: number[][], color: string) {
      if (!ctx || p <= 0) return;
      const ep = easeOut(p);
      ctx.save(); ctx.globalAlpha = ep * 0.75; ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      ctx.bezierCurveTo(
        lerp(pts[0][0], pts[1][0], ep), lerp(pts[0][1], pts[1][1], ep),
        lerp(pts[0][0], pts[2][0], ep), lerp(pts[0][1], pts[2][1], ep),
        lerp(pts[0][0], pts[3][0], ep), lerp(pts[0][1], pts[3][1], ep)
      );
      ctx.closePath(); ctx.fill(); ctx.restore();
    }

    function drawCrown(p: number) {
      if (!ctx || p <= 0) return;
      const ep = easeOut(p);
      ctx.beginPath(); ctx.arc(340, 105, 14 * ep, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,255,200,${ep * 0.5})`; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(340, 105, 6 * ep, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,200,${ep * 0.6})`; ctx.fill();
      ctx.beginPath(); ctx.arc(340, 105, 3 * ep, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${ep * 0.8})`; ctx.fill();
    }

    let LETTER_X = [110, 218, 326, 434, 542];

    function computeLetterPositions() {
      if (!ctx) return;
      ctx.font = "900 96px 'Arial Black', Arial, sans-serif";
      const letters = ['R', 'M', 'A', 'S', 'T'];
      const widths = letters.map(l => ctx.measureText(l).width);
      const gap = 16;
      const totalSpan = widths.reduce((a, b) => a + b, 0) + gap * 4;
      const startX = (680 - totalSpan) / 2;
      let cx = startX;
      LETTER_X = letters.map((l, i) => {
        const pos = cx + widths[i] / 2;
        cx += widths[i] + gap;
        return pos;
      });
    }

    function drawGradLetters(alphas: number[], masterAlpha = 1) {
      if (!ctx || masterAlpha <= 0) return;
      ctx.font = "900 96px 'Arial Black', Arial, sans-serif";
      const grad = ctx.createLinearGradient(LETTER_X[0] - 60, 0, LETTER_X[4] + 60, 0);
      grad.addColorStop(0, '#00ffc8');
      grad.addColorStop(0.35, '#00e88a');
      grad.addColorStop(0.7, '#a8ff5a');
      grad.addColorStop(1, '#ffe44a');
      const letters = ['R', 'M', 'A', 'S', 'T'] as const;
      letters.forEach((l, i) => {
        if (alphas[i] <= 0) return;
        const ep = easeOut(alphas[i]);
        ctx.save();
        ctx.globalAlpha = masterAlpha * Math.min(ep, 1) * 0.97;
        ctx.translate(LETTER_X[i], CY);
        ctx.scale(1, 0.2 + ep * 0.8);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(0,255,200,0.5)'; ctx.shadowBlur = 22;
        ctx.fillText(l, 0, 0);
        ctx.restore();
      });
    }

    function drawUnderline(alpha: number) {
      if (!ctx || alpha <= 0) return;
      const x1 = LETTER_X[0] - 50, x2 = LETTER_X[4] + 50, mid = (x1 + x2) / 2;
      ctx.save(); ctx.globalAlpha = alpha * 0.2;
      ctx.strokeStyle = '#00ffc8'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(x1, 258); ctx.lineTo(mid - 20, 258); ctx.stroke();
      ctx.strokeStyle = '#ffe44a';
      ctx.beginPath(); ctx.moveTo(mid + 20, 258); ctx.lineTo(x2, 258); ctx.stroke();
      ctx.restore();
    }

    function drawStudio(alpha: number) {
      if (!ctx || alpha <= 0) return;
      ctx.save(); ctx.globalAlpha = alpha * 0.65;
      ctx.font = "300 20px Arial, sans-serif";
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#00ffc8';
      ctx.shadowColor = '#00ffc8'; ctx.shadowBlur = 10;
      ctx.fillText('S  T  U  D  I  O', 340, 296);
      ctx.restore();
    }

    function drawTagline(alpha: number) {
      if (!ctx || alpha <= 0) return;
      ctx.save(); ctx.globalAlpha = alpha * 0.45;
      ctx.font = "italic 12px Georgia, serif";
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#a8ff5a';
      ctx.fillText('nature-inspired digital craft', 340, 330);
      ctx.globalAlpha = alpha * 0.25; ctx.fillStyle = '#a8ff5a';
      ctx.beginPath(); ctx.moveTo(145, 326); ctx.lineTo(150, 330); ctx.lineTo(145, 334); ctx.lineTo(140, 330); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(535, 326); ctx.lineTo(540, 330); ctx.lineTo(535, 334); ctx.lineTo(530, 330); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    function drawIcons(p: number) {
      if (!ctx || p <= 0) return;
      const ep = Math.min(p, 1);
      TECH_ICONS.forEach((icon, i) => {
        const delay = (i / TECH_ICONS.length) * 0.6;
        const localP = Math.max(0, Math.min((ep - delay) / 0.4, 1));
        if (localP <= 0) return;
        const alpha = localP * 0.7;
        const pulseAlpha = alpha * (0.8 + Math.sin(Date.now() / 600 + i) * 0.2);
        ctx.save(); ctx.globalAlpha = pulseAlpha * 0.25;
        ctx.beginPath(); ctx.arc(icon.x, icon.y, 22, 0, Math.PI * 2);
        ctx.strokeStyle = icon.color; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
        ctx.save(); ctx.globalAlpha = pulseAlpha * 0.12;
        ctx.beginPath(); ctx.arc(icon.x, icon.y, 18, 0, Math.PI * 2);
        ctx.fillStyle = icon.color; ctx.fill(); ctx.restore();
        icon.draw(icon.x, icon.y, pulseAlpha);
        ctx.save(); ctx.globalAlpha = pulseAlpha * 0.55;
        ctx.font = "500 8px Arial, sans-serif";
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillStyle = icon.color;
        ctx.fillText(icon.label, icon.x, icon.y + 20);
        ctx.restore();
      });
    }

    function phaseReached(name: Phase) {
      return PHASES.indexOf(phase) >= PHASES.indexOf(name);
    }

    function render() {
      if (!ctx) return;
      const p = Math.min(phaseT / DURATIONS[phase], 1);
      const fadeAlpha = phase === 'fadeout' ? 1 - easeIn(p) : 1;
      drawBg(); drawParticles();
      ctx.save(); ctx.globalAlpha = fadeAlpha;
      const iconP = phase === 'icons' ? easeOut(p) : phaseReached('icons') ? 1 : 0;
      drawIcons(iconP);
      drawStem(phase === 'stem' ? easeOut(p) : phaseReached('stem') ? 1 : 0);
      const b0p = phase === 'branch1' ? p : phaseReached('branch1') ? 1 : 0;
      const b1p = phase === 'branch2' ? p : phaseReached('branch2') ? 1 : 0;
      const b2p = phase === 'branch3' ? p : phaseReached('branch3') ? 1 : 0;
      drawBranch(340, 320, 290, 270, b0p, leafColors[0]);
      drawBranch(340, 320, 390, 270, b0p, leafColors[0]);
      drawBranch(340, 250, 268, 190, b1p, leafColors[1]);
      drawBranch(340, 250, 412, 190, b1p, leafColors[1]);
      drawBranch(340, 185, 300, 145, b2p, leafColors[2]);
      drawBranch(340, 185, 380, 145, b2p, leafColors[2]);
      drawLeaf(phase === 'leaf1L' ? p : phaseReached('leaf1L') ? 1 : 0, [[340, 320], [320, 290], [270, 285], [290, 270]], 'rgba(0,255,200,0.7)');
      drawLeaf(phase === 'leaf1R' ? p : phaseReached('leaf1R') ? 1 : 0, [[340, 320], [360, 290], [410, 285], [390, 270]], 'rgba(0,255,200,0.7)');
      drawLeaf(phase === 'leaf2L' ? p : phaseReached('leaf2L') ? 1 : 0, [[340, 250], [310, 215], [252, 215], [268, 190]], 'rgba(168,255,90,0.65)');
      drawLeaf(phase === 'leaf2R' ? p : phaseReached('leaf2R') ? 1 : 0, [[340, 250], [370, 215], [428, 215], [412, 190]], 'rgba(168,255,90,0.65)');
      drawLeaf(phase === 'leaf3L' ? p : phaseReached('leaf3L') ? 1 : 0, [[340, 185], [322, 162], [288, 158], [300, 145]], 'rgba(255,228,74,0.7)');
      drawLeaf(phase === 'leaf3R' ? p : phaseReached('leaf3R') ? 1 : 0, [[340, 185], [358, 162], [372, 132], [380, 145]], 'rgba(255,228,74,0.7)');
      drawCrown(phase === 'crown' ? p : phaseReached('crown') ? 1 : 0);
      const letters = ['R', 'M', 'A', 'S', 'T'] as const;
      const alphas = letters.map((_, i) => {
        const idx = PHASES.indexOf(letters[i]);
        const cur = PHASES.indexOf(phase);
        if (cur < idx) return 0; if (cur > idx) return 1; return p;
      });
      drawGradLetters(alphas, 1);
      drawUnderline(phaseReached('T') ? (phase === 'T' ? easeOut(p) : 1) : 0);
      drawStudio(phase === 'studio' ? easeOut(p) : phaseReached('studio') ? 1 : 0);
      drawTagline(phase === 'tagline' ? easeOut(p) : phaseReached('tagline') ? 1 : 0);
      drawCorners(phaseReached('branch1') ? 1 : 0);
      ctx.restore();
    }

    function tick() {
      phaseT++;
      if (phase === 'branch1' && phaseT === 1) spawnBurst(340, 320, '#00ffc8', 8);
      if (phase === 'branch2' && phaseT === 1) spawnBurst(340, 250, '#a8ff5a', 8);
      if (phase === 'branch3' && phaseT === 1) spawnBurst(340, 185, '#ffe44a', 8);
      if (phase === 'crown' && phaseT === 1) spawnBurst(340, 105, '#ffffff', 14);
      const letterIndex = ['R', 'M', 'A', 'S', 'T'].indexOf(phase);
      if (letterIndex !== -1 && phaseT === 2) {
        spawnBurst(LETTER_X[letterIndex], CY, COLORS[letterIndex], 10);
      }
      if (phase === 'studio' && phaseT === 2) spawnBurst(340, 294, '#00ffc8', 8);
      if (phase === 'icons' && phaseT === 1) TECH_ICONS.forEach(icon => spawnBurst(icon.x, icon.y, icon.color, 6));
      render();
      if (phaseT >= DURATIONS[phase]) {
        phaseT = 0;
        const pi = PHASES.indexOf(phase);
        phase = pi < PHASES.length - 1 ? PHASES[pi + 1] : PHASES[0];
        if (phase === PHASES[0]) particles = [];
      }
      animId = requestAnimationFrame(tick);
    }

    computeLetterPositions();
    phase = PHASES[0];
    tick();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: '28px',
      }}
    />
  );
}
