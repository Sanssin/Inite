import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './XRayMachine.css';

const XRayMachine = () => {
  const { t } = useTranslation('simulation');
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  const [ma, setMa] = useState(50); // Filament Current
  const [kvp, setKvp] = useState(50); // Tube Voltage
  const [isExposing, setIsExposing] = useState(false);
  const [anodeHeat, setAnodeHeat] = useState(0); // 0 to 100
  
  const stateRef = useRef({
    ma: 50,
    kvp: 50,
    isExposing: false,
    anodeHeat: 0,
    electrons: [],
    xrays: [],
    lastTime: 0
  });

  useEffect(() => {
    stateRef.current.ma = ma;
    stateRef.current.kvp = kvp;
    stateRef.current.isExposing = isExposing;
  }, [ma, kvp, isExposing]);

  const handleExposeDown = () => setIsExposing(true);
  const handleExposeUp = () => setIsExposing(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    const render = (time) => {
      const state = stateRef.current;
      const cw = canvas.width;
      const ch = canvas.height;
      state.lastTime = time;
      
      // Clear canvas
      ctx.clearRect(0, 0, cw, ch);
      
      const cathodeX = cw * 0.35;
      const cathodeY = ch * 0.45;
      
      const anodeX = cw * 0.65;
      const anodeY = ch * 0.45;
      
      // Heat dissipation
      if (!state.isExposing && state.anodeHeat > 0) {
        state.anodeHeat -= 0.5;
      }
      
      // Thermionic Emission Cloud (Hovers near cathode based on mA)
      if (!state.cloudParticles) state.cloudParticles = [];
      const targetCloudSize = Math.floor(state.ma * 2);
      
      // Add or remove particles to match target cloud size
      if (state.cloudParticles.length < targetCloudSize) {
        state.cloudParticles.push({
          x: cathodeX + 5 + Math.random() * 20,
          y: cathodeY + (Math.random() - 0.5) * 35,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5
        });
      } else if (state.cloudParticles.length > targetCloudSize) {
        state.cloudParticles.pop();
      }
      
      if (state.isExposing) {
        // Generate high-speed electrons from the cloud
        const numElectrons = Math.floor(state.ma / 10);
        for(let i = 0; i < numElectrons; i++) {
          state.electrons.push({
            x: cathodeX + 25,
            y: cathodeY + (Math.random() - 0.5) * 35,
            speed: 15 + (state.kvp / 3) // Faster!
          });
        }
        
        // Heat buildup
        state.anodeHeat += (state.ma / 100) * (state.kvp / 150) * 1.5;
        if (state.anodeHeat > 100) state.anodeHeat = 100;
      }
      
      // Update external UI state roughly
      setAnodeHeat(Math.max(0, Math.floor(state.anodeHeat)));
      
      // ---- BACKGROUND / TECHNICAL DRAWING ----
      
      // Tube Shielding / Housing (Lead casing)
      ctx.fillStyle = '#1c1c1c';
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 4;
      ctx.beginPath();
      // Housing shape
      ctx.moveTo(cw*0.1, ch*0.15);
      ctx.lineTo(cw*0.9, ch*0.15);
      ctx.lineTo(cw*0.9, ch*0.75);
      ctx.lineTo(cw*0.75, ch*0.75);
      // Window drop (exactly below Anode)
      ctx.lineTo(cw*0.75, ch*0.98); 
      ctx.lineTo(cw*0.55, ch*0.98);
      ctx.lineTo(cw*0.55, ch*0.75);
      ctx.lineTo(cw*0.1, ch*0.75);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw Glass Envelope (Vacuum Tube)
      ctx.beginPath();
      ctx.moveTo(cw*0.15, ch*0.35);
      ctx.lineTo(cw*0.4, ch*0.35);
      // Top bulge
      ctx.bezierCurveTo(cw*0.5, ch*0.35, cw*0.55, ch*0.2, cw*0.75, ch*0.2);
      ctx.lineTo(cw*0.85, ch*0.2);
      ctx.lineTo(cw*0.85, ch*0.7);
      ctx.lineTo(cw*0.75, ch*0.7);
      // Bottom bulge
      ctx.bezierCurveTo(cw*0.55, ch*0.7, cw*0.5, ch*0.55, cw*0.4, ch*0.55);
      ctx.lineTo(cw*0.15, ch*0.55);
      ctx.closePath();
      ctx.fillStyle = 'rgba(173, 216, 230, 0.05)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(173, 216, 230, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Beryllium Window (X-Ray exit)
      ctx.beginPath();
      ctx.moveTo(cw*0.55, ch*0.75);
      ctx.lineTo(cw*0.75, ch*0.75);
      ctx.strokeStyle = '#2ecc71';
      ctx.lineWidth = 6;
      ctx.stroke();
      
      // Draw Voltage/KVp Indicator Lines (Electric Field)
      if (state.isExposing) {
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = -40; i <= 40; i += 20) {
          ctx.moveTo(cathodeX + 35, cathodeY + i);
          ctx.lineTo(anodeX - 35, cathodeY + i);
        }
        ctx.stroke();
      }
      
      // ---- PARTICLES ----
      
      // Update and Draw Thermionic Cloud
      ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
      state.cloudParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        // Keep in cup
        if (p.x < cathodeX - 5) p.vx = Math.abs(p.vx);
        if (p.x > cathodeX + 25) p.vx = -Math.abs(p.vx);
        if (p.y < cathodeY - 25) p.vy = Math.abs(p.vy);
        if (p.y > cathodeY + 25) p.vy = -Math.abs(p.vy);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and Draw Fast Electrons
      for (let i = state.electrons.length - 1; i >= 0; i--) {
        const e = state.electrons[i];
        e.x += e.speed;
        
        // Calculate the slope of the anode face for collision
        // Slope goes from (anodeX - 25, anodeY - 45) to (anodeX + 15, anodeY + 45)
        // This is a \ shape. 
        const hitX = anodeX - 25 + ((e.y - (anodeY - 45)) / 90) * 40;
        
        // Hit anode
        if (e.x >= hitX && e.y >= anodeY - 45 && e.y <= anodeY + 45) {
          state.electrons.splice(i, 1);
          
          // Generate X-Ray based on probability
          if (Math.random() < 0.35) {
            state.xrays.push({
              x: hitX,
              y: e.y,
              vx: (Math.random() - 0.5) * 4,
              vy: 5 + (state.kvp / 15), 
              life: 1
            });
          }
          continue;
        }
        
        if (e.x > cw) {
            state.electrons.splice(i, 1);
            continue;
        }
        
        ctx.beginPath();
        ctx.arc(e.x, e.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffff';
        ctx.fill();
      }
      
      // Update and Draw X-Rays
      for (let i = state.xrays.length - 1; i >= 0; i--) {
        const xr = state.xrays[i];
        xr.x += xr.vx;
        xr.y += xr.vy;
        xr.life -= 0.015;
        
        // Prevent x-rays from exiting outside the window (cw*0.55 to cw*0.75)
        // If they hit the lead housing, they die faster or get absorbed
        if (xr.y > ch * 0.75) {
            if (xr.x < cw * 0.55 || xr.x > cw * 0.75) {
                xr.life -= 0.1; // Rapid absorption by lead
            }
        }
        
        if (xr.life <= 0 || xr.y > ch) {
          state.xrays.splice(i, 1);
          continue;
        }
        
        ctx.beginPath();
        ctx.moveTo(xr.x, xr.y);
        ctx.lineTo(xr.x - Math.sin(xr.y / 4) * 5, xr.y - 12);
        ctx.lineTo(xr.x + Math.sin(xr.y / 4) * 5, xr.y - 24);
        ctx.strokeStyle = `rgba(241, 196, 15, ${Math.max(0, xr.life)})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
      
      // ---- CATHODE & ANODE HARDWARE ----
      
      // Cathode Focusing Cup (Molybdenum)
      // Larger cup
      ctx.fillStyle = '#7f8c8d';
      ctx.beginPath();
      ctx.arc(cathodeX, cathodeY, 35, Math.PI * 0.5, Math.PI * 1.5);
      ctx.lineTo(cathodeX + 25, cathodeY - 35);
      ctx.lineTo(cathodeX + 25, cathodeY - 25);
      ctx.lineTo(cathodeX, cathodeY - 25);
      ctx.lineTo(cathodeX, cathodeY + 25);
      ctx.lineTo(cathodeX + 25, cathodeY + 25);
      ctx.lineTo(cathodeX + 25, cathodeY + 35);
      ctx.closePath();
      ctx.fill();
      
      // Cathode Stem
      ctx.fillRect(cw*0.1, cathodeY - 15, cathodeX - cw*0.1, 30);
      
      // Filament Coil inside cup (Much larger)
      const cathodeGlow = state.ma / 100;
      ctx.shadowBlur = 25 * cathodeGlow;
      ctx.shadowColor = '#e74c3c';
      for(let j = -16; j <= 16; j+=6) {
        ctx.beginPath();
        ctx.moveTo(cathodeX - 8, cathodeY + j);
        ctx.lineTo(cathodeX + 12, cathodeY + j + 3);
        ctx.strokeStyle = `rgb(255, ${200 - cathodeGlow*150}, ${200 - cathodeGlow*150})`;
        ctx.lineWidth = 5;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      
      // Anode (Copper block with Tungsten Target)
      const heatRatio = state.anodeHeat / 100;
      ctx.shadowBlur = 40 * heatRatio;
      ctx.shadowColor = '#e74c3c';
      
      // Copper Stem / Rotor
      ctx.fillStyle = '#a0522d'; // Copper color
      ctx.fillRect(anodeX + 25, cathodeY - 45, cw*0.9 - (anodeX + 25), 90);
      
      // Angled Tungsten Target Face (\ shape)
      // Top points further left, bottom points further right
      ctx.beginPath();
      ctx.moveTo(anodeX - 25, anodeY - 45); // Top-left
      ctx.lineTo(anodeX + 15, anodeY + 45); // Bottom-left (slanted \)
      ctx.lineTo(anodeX + 26, anodeY + 45); // To copper body
      ctx.lineTo(anodeX + 26, anodeY - 45); // To copper body
      ctx.closePath();
      
      // Heat coloration
      const r = 149 + (106 * heatRatio);
      const g = 165 - (100 * heatRatio);
      const b = 166 - (100 * heatRatio);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fill();
      
      // Tungsten Insert Target Path
      ctx.beginPath();
      ctx.moveTo(anodeX - 18, anodeY - 30);
      ctx.lineTo(anodeX + 6, anodeY + 25);
      ctx.lineTo(anodeX + 18, anodeY + 25);
      ctx.lineTo(anodeX - 6, anodeY - 30);
      ctx.fillStyle = '#34495e'; // Darker tungsten
      if (heatRatio > 0.5) ctx.fillStyle = '#e74c3c';
      ctx.fill();
      
      ctx.shadowBlur = 0;
      
      // kVp and mA Gauge Overlays (Technical UI)
      ctx.fillStyle = '#fff';
      ctx.font = '14px monospace';
      // mA Display near Cathode
      ctx.fillText(`FILAMENT CURRENT: ${state.ma} mA`, cw*0.15, ch*0.25);
      // kVp Display near Anode
      ctx.fillText(`TUBE VOLTAGE: ${state.kvp} kVp`, cw*0.65, ch*0.25);
      
      animationRef.current = requestAnimationFrame(render);
    };
    
    animationRef.current = requestAnimationFrame(render);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="xm-container">
      <div className="xm-header">
        <Link to="/simulations" className="xm-back-btn">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          {t('xray.back')}
        </Link>
        <h1 className="xm-title">{t('xray.title')}</h1>
      </div>

      <div className="xm-simulation-area">
        <canvas ref={canvasRef} className="xm-canvas"></canvas>
        
        {/* LEGEND */}
        <div className="xm-legend-panel">
          <div className="xm-legend-title">{t('xray.legend')}</div>
          
          <div className="xm-legend-item">
            <div className="xm-legend-icon">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <line x1="4" y1="2" x2="4" y2="14" stroke="#e74c3c" strokeWidth="2" />
                <path d="M4,2 C8,2 8,14 4,14" fill="none" stroke="#e74c3c" strokeWidth="2" />
              </svg>
            </div>
            <div>{t('xray.legendCathode')}</div>
          </div>
          
          <div className="xm-legend-item">
            <div className="xm-legend-icon">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <polygon points="12,2 4,6 4,14 12,10" fill="#7f8c8d" />
              </svg>
            </div>
            <div>{t('xray.legendAnode')}</div>
          </div>

          <div className="xm-legend-item">
            <div className="xm-legend-icon">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <circle cx="8" cy="8" r="3" fill="#00ffff" />
              </svg>
            </div>
            <div>{t('xray.legendElectron')}</div>
          </div>
          
          <div className="xm-legend-item">
            <div className="xm-legend-icon">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path d="M8,2 Q4,5 8,8 T8,14" fill="none" stroke="#fff" strokeWidth="2" />
              </svg>
            </div>
            <div>{t('xray.legendXRay')}</div>
          </div>
        </div>
      </div>

      <div className="xm-controls-container">
        <div className="xm-control-group">
          <h3>{t('xray.ma')}</h3>
          <div className="xm-slider-container">
            <span>{t('xray.low')}</span>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={ma} 
              onChange={(e) => setMa(Number(e.target.value))} 
              className="xm-slider ma-slider"
            />
            <span>{t('xray.high')}</span>
          </div>
          <div className="xm-hint">Arus (mA) menentukan JUMLAH elektron.</div>
        </div>
        
        <div className="xm-control-group">
          <h3>{t('xray.kvp')}</h3>
          <div className="xm-slider-container">
            <span>{t('xray.low')}</span>
            <input 
              type="range" 
              min="30" 
              max="150" 
              value={kvp} 
              onChange={(e) => setKvp(Number(e.target.value))} 
              className="xm-slider kvp-slider"
            />
            <span>{t('xray.high')}</span>
          </div>
          <div className="xm-hint">Tegangan (kVp) menentukan KECEPATAN (Energi Sinar-X).</div>
        </div>

        <div className="xm-control-group action-group">
          <button 
            className={`xm-expose-btn ${isExposing ? 'active' : ''}`}
            onMouseDown={handleExposeDown}
            onMouseUp={handleExposeUp}
            onMouseLeave={handleExposeUp}
            onTouchStart={handleExposeDown}
            onTouchEnd={handleExposeUp}
          >
            {isExposing ? `⚡ ${t('xray.expose').toUpperCase()}...` : t('xray.expose')}
          </button>
          
          <div className="xm-heat-indicator">
            <div className="xm-heat-label">{t('xray.heat')}</div>
            <div className="xm-heat-bar">
              <div 
                className="xm-heat-fill" 
                style={{ width: `${anodeHeat}%`, background: anodeHeat > 80 ? '#e74c3c' : '#f1c40f' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="xm-theory-section">
        <h2>{t('xray.theoryTitle')}</h2>
        <p>{t('xray.theoryContent1')}</p>
        <p>{t('xray.theoryContent2')}</p>
      </div>
    </div>
  );
};

export default XRayMachine;
