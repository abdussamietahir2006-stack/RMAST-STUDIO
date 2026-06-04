'use client';

import { useEffect, useRef } from 'react';

interface Country {
  name: string;
  lat: number;
  lon: number;
  color: string;
  size: number;
  hub?: boolean;
  outline?: [number, number][];
}

export default function AboutLogoAnimation({ width = 300, height = 300 }: { width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    rotY: 0.9,
    rotX: 0.18,
    velY: 0.003,
    velX: 0,
    drag: false,
    lastX: 0,
    lastY: 0,
    t: 0,
    arcProgress: {} as Record<string, number>,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rawCtx = canvas.getContext('2d');
    if (!rawCtx) return;
    const ctx = rawCtx;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    // Scale canvas internally for smaller layout fitting
    const canvasSize = Math.min(width, height) * 0.85; // 306px for 360px container

    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    ctx.scale(dpr, dpr);

    const W = canvasSize, H = canvasSize, CX = W / 2, CY = H / 2;
    const R = canvasSize * 0.42;

    const countries: Country[] = [
      {
        name: 'Pakistan', lat: 30.3, lon: 69.3, color: '#00ffc8', size: 2.5, hub: true,
        outline: [[37.1, 74.6], [37, 72], [35.7, 71.3], [34.7, 70.7], [33.5, 70], [32.3, 69], [30.9, 66.5], [28.5, 64.5], [27, 63], [25.2, 62], [23.6, 60.8], [23.6, 57.4], [25.4, 56.4], [26.7, 57.3], [27.8, 62], [28, 64], [30, 66.5], [32.3, 69.3], [33.5, 72.5], [36.9, 74.5], [37.1, 74.6]]
      },
      {
        name: 'USA', lat: 39, lon: -98, color: '#38bdf8', size: 1.8,
        outline: [[49, -124], [49, -67], [44, -66], [42, -72], [40, -74], [35, -76], [30, -80], [25, -80], [25, -87], [30, -90], [29, -94], [26, -97], [28, -97], [29, -97], [28, -100], [29, -104], [32, -111], [31, -117], [32, -117], [33, -118], [35, -121], [37, -122], [38, -123], [40, -124], [45, -124], [48, -124], [49, -124]]
      },
      {
        name: 'UK', lat: 54, lon: -2, color: '#818cf8', size: 1.2,
        outline: [[50.1, -5.7], [51.5, 0.8], [53, 0], [54, 0], [55, -1.7], [58, -3], [58, -6], [57, -7], [55, -6], [54, -4], [53, -4], [51, -5], [50.1, -5.7]]
      },
      {
        name: 'Germany', lat: 51, lon: 10, color: '#f472b6', size: 1.2,
        outline: [[47.3, 7.6], [48.5, 8], [48.7, 9.5], [48.6, 12], [48, 12.8], [48.3, 14.2], [50.3, 12.3], [50.5, 14], [51.2, 15], [52.8, 14.1], [54.3, 10.2], [54.8, 8.7], [53, 6.5], [51.5, 6.1], [50, 6.2], [49.5, 6.4], [49, 8], [47.3, 7.6]]
      },
      {
        name: 'Japan', lat: 36, lon: 138, color: '#fb923c', size: 1.2,
        outline: [[31, 130.5], [32, 130.5], [34, 131], [35.5, 135], [36.5, 136], [37, 137], [37.5, 138], [38.5, 141], [40, 141.5], [41.5, 140], [42.5, 141.8], [43.5, 145], [44, 144.5], [43, 140], [42, 140], [40, 139], [38, 139], [36.5, 136], [35.5, 135.5], [34, 135], [33, 130], [31, 130.5]]
      },
      {
        name: 'Australia', lat: -27, lon: 133, color: '#a78bfa', size: 1.8,
        outline: [[-17.5, 124], [-15, 129], [-13, 130], [-11.5, 136], [-12, 137], [-11, 143], [-14, 145], [-18, 146], [-23, 150], [-27, 153], [-32, 152], [-35, 150], [-37, 149], [-38, 146], [-38, 140], [-36, 136], [-34, 136], [-32, 134], [-28, 122], [-23, 114], [-22, 114], [-20, 118], [-18, 122], [-17.5, 124]]
      },
      {
        name: 'Brazil', lat: -14, lon: -52, color: '#4ade80', size: 1.8,
        outline: [[-5, -35], [-5, -37], [-6, -41], [-8, -35], [-9, -38], [-11, -37], [-12, -37], [-14, -39], [-15, -39], [-17, -39], [-20, -40], [-23, -43], [-24, -44], [-26, -48], [-29, -50], [-30, -53], [-32, -53], [-33, -53], [-31, -58], [-28, -56], [-25, -54], [-22, -54], [-20, -57], [-17, -58], [-15, -60], [-11, -62], [-9, -66], [-8, -73], [-5, -73], [-2, -72], [0, -70], [1, -68], [2, -60], [3, -60], [4, -61], [2, -50], [2, -49], [0, -50], [-1, -48], [-2, -44], [-5, -35]]
      },
      {
        name: 'China', lat: 35, lon: 103, color: '#f87171', size: 1.8,
        outline: [[22, 99], [22, 103], [23, 104], [24, 102], [26, 100], [27, 97], [28, 97], [29, 97], [30, 96], [32, 95], [33, 93], [37, 95], [41, 96], [44, 90], [46, 84], [48, 87], [49, 85], [52, 87], [52, 94], [49, 100], [48, 106], [46, 119], [42, 122], [41, 122], [39, 121], [38, 118], [35, 117], [33, 116], [33, 120], [31, 121], [30, 121], [28, 120], [25, 118], [23, 117], [21, 110], [20, 108], [21, 105], [23, 104], [23, 100], [22, 99]]
      },
      {
        name: 'India', lat: 21, lon: 79, color: '#fbbf24', size: 1.5,
        outline: [[37.1, 74.6], [36.9, 74.5], [34, 72.5], [32.3, 69.3], [30, 66.5], [28, 64], [27.8, 62], [26.7, 57.3], [25.4, 56.4], [23.6, 57.4], [22, 70], [20, 71], [15, 74], [11, 77], [8, 77], [8, 80], [10, 80], [13, 80], [14, 80], [17, 82], [20, 87], [22, 88], [23, 90], [22, 92], [24, 92], [26, 90], [27, 90], [28, 88], [28, 83], [27, 80], [29, 79], [30, 79], [32, 79], [34, 72.5]]
      },
      {
        name: 'Canada', lat: 60, lon: -96, color: '#67e8f9', size: 1.8,
        outline: [[50, -64], [52, -56], [56, -61], [58, -63], [60, -65], [62, -66], [63, -64], [64, -62], [65, -60], [66, -62], [67, -64], [68, -66], [69, -68], [70, -68], [72, -68], [73, -70], [74, -72], [73, -74], [72, -76], [73, -80], [72, -80], [70, -84], [68, -84], [69, -90], [69, -94], [69, -100], [70, -100], [70, -112], [70, -120], [72, -130], [70, -134], [68, -140], [60, -140], [60, -136], [60, -130], [60, -126], [48, -124], [50, -120], [52, -120], [54, -120], [55, -120], [60, -118], [60, -110], [58, -105], [56, -100], [52, -96], [52, -90], [54, -83], [54, -80], [53, -79], [52, -80], [52, -82], [48, -84], [45, -84], [45, -77], [44, -76], [44, -76], [45, -74], [44, -72], [45, -73], [44, -70], [45, -67], [47, -66], [48, -65], [50, -64]]
      },
      {
        name: 'Russia', lat: 62, lon: 100, color: '#e879f9', size: 2,
        outline: [[58, 38], [60, 40], [62, 44], [64, 44], [65, 42], [66, 44], [68, 44], [68, 54], [68, 58], [70, 60], [72, 72], [72, 80], [72, 90], [72, 100], [72, 110], [72, 130], [70, 134], [68, 140], [62, 144], [58, 142], [54, 142], [50, 142], [48, 138], [46, 135], [44, 134], [44, 128], [48, 120], [50, 108], [54, 100], [58, 92], [58, 80], [58, 72], [58, 60], [58, 50], [58, 44], [58, 38]]
      },
    ];

    const pakistan = countries.find(c => c.hub)!;
    const destinations = countries.filter(c => !c.hub);
    destinations.forEach((d, i) => { stateRef.current.arcProgress[d.name] = (i * 0.18) % 1; });

    function latLon3D(lat: number, lon: number): [number, number, number] {
      const la = (lat * Math.PI) / 180;
      const lo = (lon * Math.PI) / 180;
      return [Math.cos(la) * Math.sin(lo), -Math.sin(la), -Math.cos(la) * Math.cos(lo)];
    }

    function rotateVec([x, y, z]: [number, number, number], rx: number, ry: number): [number, number, number] {
      const x1 = x * Math.cos(ry) + z * Math.sin(ry);
      const z1 = -x * Math.sin(ry) + z * Math.cos(ry);
      const y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
      const z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
      return [x1, y2, z2];
    }

    function project([x, y, z]: [number, number, number]): [number, number, number] {
      const d = 3.5, scale = R * 2.1;
      return [x / (z + d) * scale + CX, y / (z + d) * scale + CY, z];
    }

    function drawCountry(c: Country, rx: number, ry: number, highlight: boolean) {
      if (!c.outline) return;

      const centerV = latLon3D(c.lat, c.lon);
      const centerR = rotateVec(centerV, rx, ry);
      const centerZ = centerR[2];

      // Backface culling: hide or fade outlines rotating to the far side
      if (centerZ > 0.35) return;
      const fade = Math.max(0, Math.min(1, (0.35 - centerZ) * 4));

      ctx.save();
      ctx.globalAlpha = fade;

      ctx.beginPath();
      let first = true;
      for (const [lat, lon] of c.outline) {
        const v = latLon3D(lat, lon);
        const r = rotateVec(v, rx, ry);
        const [px, py] = project(r);
        if (first) { ctx.moveTo(px, py); first = false; }
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      if (highlight) {
        ctx.fillStyle = 'rgba(0, 255, 200, 0.22)';
        ctx.strokeStyle = '#00ffc8';
        ctx.lineWidth = 1.8;
      } else {
        ctx.fillStyle = 'rgba(82, 183, 136, 0.04)'; // Subtle theme green
        ctx.strokeStyle = c.color + '88';
        ctx.lineWidth = 0.8;
      }
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    function drawArc(lat1: number, lon1: number, lat2: number, lon2: number, color: string, rx: number, ry: number) {
      const A = latLon3D(lat1, lon1);
      const B = latLon3D(lat2, lon2);
      const steps = 40;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i <= steps; i++) {
        const tt = i / steps;
        const lerpX = A[0] * (1 - tt) + B[0] * tt;
        const lerpY = A[1] * (1 - tt) + B[1] * tt;
        const lerpZ = A[2] * (1 - tt) + B[2] * tt;
        const mag = Math.sqrt(lerpX ** 2 + lerpY ** 2 + lerpZ ** 2);
        const arc = 0.28 * Math.sin(Math.PI * tt);
        const v: [number, number, number] = [(lerpX / mag) * (1 + arc), (lerpY / mag) * (1 + arc), (lerpZ / mag) * (1 + arc)];
        const r = rotateVec(v, rx, ry);
        const [px, py, pz] = project(r);
        if (pz < 0.2) {
          if (!started) { ctx.moveTo(px, py); started = true; }
          else ctx.lineTo(px, py);
        }
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.55;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function drawPulse(lat1: number, lon1: number, lat2: number, lon2: number, progress: number, rx: number, ry: number, color: string) {
      const A = latLon3D(lat1, lon1);
      const B = latLon3D(lat2, lon2);
      const tt = progress % 1;
      const lerpX = A[0] * (1 - tt) + B[0] * tt;
      const lerpY = A[1] * (1 - tt) + B[1] * tt;
      const lerpZ = A[2] * (1 - tt) + B[2] * tt;
      const mag = Math.sqrt(lerpX ** 2 + lerpY ** 2 + lerpZ ** 2);
      const arc = 0.28 * Math.sin(Math.PI * tt);
      const v: [number, number, number] = [(lerpX / mag) * (1 + arc), (lerpY / mag) * (1 + arc), (lerpZ / mag) * (1 + arc)];
      const r = rotateVec(v, rx, ry);
      const [px, py, pz] = project(r);
      if (pz < 0.18) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      }
    }

    function drawGrid(rx: number, ry: number) {
      for (let lat = -80; lat <= 80; lat += 20) {
        let prev: [number, number, number] | null = null;
        for (let lon = 0; lon <= 360; lon += 6) {
          const v = latLon3D(lat, lon), r = rotateVec(v, rx, ry), [px, py, pz] = project(r);
          if (prev && pz < 0.1 && prev[2] < 0.1) {
            ctx.strokeStyle = 'rgba(82, 183, 136, 0.15)'; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.6;
            ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(px, py); ctx.stroke();
          }
          prev = [px, py, pz];
        }
      }
      for (let lon = 0; lon < 360; lon += 30) {
        let prev: [number, number, number] | null = null;
        for (let lat = -90; lat <= 90; lat += 6) {
          const v = latLon3D(lat, lon), r = rotateVec(v, rx, ry), [px, py, pz] = project(r);
          if (prev && pz < 0.1 && prev[2] < 0.1) {
            ctx.strokeStyle = 'rgba(82, 183, 136, 0.15)'; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.6;
            ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(px, py); ctx.stroke();
          }
          prev = [px, py, pz];
        }
      }
      ctx.globalAlpha = 1;
    }

    let animId: number;

    function draw() {
      const s = stateRef.current;
      ctx.clearRect(0, 0, W, H);

      // Globe glow
      const grd = ctx.createRadialGradient(CX, CY, R * 0.3, CX, CY, R * 1.1);
      grd.addColorStop(0, 'rgba(0,30,20,0.35)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2); ctx.fill();

      // Atmosphere ring
      const atm = ctx.createRadialGradient(CX, CY, R - 4, CX, CY, R + 18);
      atm.addColorStop(0, 'rgba(0,255,150,0.08)');
      atm.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = atm; ctx.beginPath(); ctx.arc(CX, CY, R + 18, 0, Math.PI * 2); ctx.fill();

      // Globe border
      ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,200,120,0.18)'; ctx.lineWidth = 1.2; ctx.stroke();

      drawGrid(s.rotX, s.rotY);

      for (const c of countries) {
        if (c.hub) continue;
        drawCountry(c, s.rotX, s.rotY, false);
      }
      drawCountry(pakistan, s.rotX, s.rotY, true);

      ctx.globalAlpha = 1;
      destinations.forEach((dest, i) => {
        s.arcProgress[dest.name] = (s.arcProgress[dest.name] + 0.0022 + i * 0.0002) % 1;
        drawArc(pakistan.lat, pakistan.lon, dest.lat, dest.lon, dest.color + 'cc', s.rotX, s.rotY);
        drawPulse(pakistan.lat, pakistan.lon, dest.lat, dest.lon, s.arcProgress[dest.name], s.rotX, s.rotY, dest.color);
      });

      for (const dest of destinations) {
        const v = latLon3D(dest.lat, dest.lon), r = rotateVec(v, s.rotX, s.rotY), [px, py, pz] = project(r);
        if (pz < 0.2) {
          const op = Math.max(0, Math.min(1, (0.2 - pz) * 6));
          ctx.save(); ctx.globalAlpha = op;
          ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = dest.color; ctx.shadowColor = dest.color; ctx.shadowBlur = 8; ctx.fill();
          ctx.fillStyle = dest.color + 'cc'; ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center'; ctx.shadowBlur = 0;
          ctx.fillText(dest.name, px, py - 9);
          ctx.restore();
        }
      }

      // Pakistan beacon
      const pakV = latLon3D(pakistan.lat, pakistan.lon), pakR = rotateVec(pakV, s.rotX, s.rotY), [ppx, ppy, ppz] = project(pakR);
      if (ppz < 0.25) {
        const op = Math.max(0, Math.min(1, (0.25 - ppz) * 5));
        ctx.save(); ctx.globalAlpha = op;
        const pulse = (s.t % 120) / 120;
        for (let i = 0; i < 2; i++) {
          const p = (pulse + i * 0.5) % 1;
          ctx.beginPath(); ctx.arc(ppx, ppy, 5 + p * 32, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0,255,200,${(1 - p) * 0.5})`; ctx.lineWidth = 1.5; ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(ppx, ppy, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffc8'; ctx.shadowColor = '#00ffc8'; ctx.shadowBlur = 20; ctx.fill();
        ctx.shadowBlur = 0;

        const goLeft = ppx > CX;
        const lx1 = ppx + (goLeft ? -12 : 12), ly1 = ppy - 14;
        const lx2 = lx1 + (goLeft ? -60 : 60);
        ctx.strokeStyle = 'rgba(0,255,200,0.6)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(ppx, ppy); ctx.lineTo(lx1, ly1); ctx.lineTo(lx2, ly1); ctx.stroke();
        ctx.fillStyle = 'rgba(0,20,12,0.8)';
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(goLeft ? lx2 - 65 : lx1, ly1 - 14, 65, 14, 3);
        } else {
          ctx.rect(goLeft ? lx2 - 65 : lx1, ly1 - 14, 65, 14);
        }
        ctx.fill();
        ctx.fillStyle = '#00ffc8'; ctx.font = 'bold 9.5px monospace';
        ctx.textAlign = goLeft ? 'right' : 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('▶ PAKISTAN HQ', goLeft ? lx2 - 4 : lx1 + 4, ly1 - 7);

        ctx.fillStyle = 'rgba(0,255,200,0.4)'; ctx.font = '7.5px monospace'; ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('WORLDWIDE OPERATIONS', ppx, ppy + 22);
        ctx.restore();
      }

      // Scanline
      ctx.save();
      ctx.globalAlpha = 0.04;
      const scanY = ((s.t * 1.5) % (R * 2)) + CY - R;
      ctx.fillStyle = '#00ffc8';
      ctx.fillRect(CX - R, scanY, R * 2, 2);
      ctx.restore();

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      s.t++;
      if (!s.drag) {
        s.rotY += s.velY;
        s.rotX += s.velX;
        s.velX *= 0.97;
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    // Mouse events
    const onMouseDown = (e: MouseEvent) => { stateRef.current.drag = true; stateRef.current.lastX = e.clientX; stateRef.current.lastY = e.clientY; stateRef.current.velY = 0; stateRef.current.velX = 0; };
    const onMouseUp = () => { stateRef.current.drag = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!stateRef.current.drag) return;
      const dx = e.clientX - stateRef.current.lastX, dy = e.clientY - stateRef.current.lastY;
      stateRef.current.rotY += dx * 0.008; stateRef.current.rotX += dy * 0.008;
      stateRef.current.velY = dx * 0.006; stateRef.current.velX = dy * 0.004;
      stateRef.current.lastX = e.clientX; stateRef.current.lastY = e.clientY;
    };
    const onTouchStart = (e: TouchEvent) => { stateRef.current.drag = true; stateRef.current.lastX = e.touches[0].clientX; stateRef.current.lastY = e.touches[0].clientY; stateRef.current.velY = 0; };
    const onTouchEnd = () => { stateRef.current.drag = false; };
    const onTouchMove = (e: TouchEvent) => {
      if (!stateRef.current.drag) return;
      const dx = e.touches[0].clientX - stateRef.current.lastX, dy = e.touches[0].clientY - stateRef.current.lastY;
      stateRef.current.rotY += dx * 0.008; stateRef.current.rotX += dy * 0.008; stateRef.current.velY = dx * 0.005;
      stateRef.current.lastX = e.touches[0].clientX; stateRef.current.lastY = e.touches[0].clientY;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchmove', onTouchMove);
    };
  }, [width, height]);

  // Adjust canvas size to leave space for high-tech border text labels inside the LogoHolder (300px)
  const canvasSize = Math.min(width, height) * 0.78;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'transparent', position: 'relative', width: `${width}px`, height: `${height}px` }}>
      <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(0,255,180,0.7)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
        ● LIVE
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: `${canvasSize}px`, height: `${canvasSize}px`, display: 'block', cursor: 'grab', background: 'transparent' }}
      />
      <div style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(0,255,180,0.55)', letterSpacing: 2.5, marginTop: 6 }}>
        CONNECTING PAKISTAN TO THE WORLD
      </div>
    </div>
  );
}


