import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './RadiationDetector.css';

const RadiationDetector = () => {
  const { t } = useTranslation('simulation');
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  const [distance, setDistance] = useState(50); // 0 (near) to 100 (far)
  const [cps, setCps] = useState(0); // Counts per second display
  
  // State refs for animation loop
  const stateRef = useRef({
    distance: 50,
    particles: [],
    hits: 0,
    flashHit: 0,
    lastTime: 0,
    frameCount: 0
  });

  useEffect(() => {
    stateRef.current.distance = distance;
  }, [distance]);

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
      // const dt = time - (state.lastTime || time);
      state.lastTime = time;
      state.frameCount++;
      
      // Clear canvas
      ctx.clearRect(0, 0, cw, ch);
      
      const sourceX = 100;
      const sourceY = ch / 2;
      
      // Calculate detector position based on distance slider
      // Slider 0 -> x = sourceX + 100
      // Slider 100 -> x = cw - 100
      const minDetX = sourceX + 150;
      const maxDetX = cw - 150;
      const detX = minDetX + (state.distance / 100) * (maxDetX - minDetX);
      const detY = ch / 2;
      const detWidth = 140; // Panjang tabung (horizontal)
      const detHeight = 30; // Diameter tabung (vertikal)
      
      // Spawn particles continuously (e.g. 15 per frame to show high density)
      for(let i=0; i<15; i++) {
        // Emit in a forward cone
        const angle = (Math.random() - 0.5) * Math.PI * 0.6;
        const speed = 8 + Math.random() * 4;
        state.particles.push({
          x: sourceX,
          y: sourceY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed
        });
      }
      
      let hitsThisFrame = 0;
      
      // Update and draw particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        
        // Check collision with detector window (front face)
        if (p.x > detX - detWidth/2 && p.x < detX - detWidth/2 + 25 && p.y > detY - detHeight/2 && p.y < detY + detHeight/2) {
          hitsThisFrame++;
          state.flashHit = 1; // Flash the sensor
          state.particles.splice(i, 1);
          continue;
        }
        
        // Out of bounds
        if (p.x > cw || p.y < 0 || p.y > ch) {
          state.particles.splice(i, 1);
          continue;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(253, 126, 20, 0.7)';
        ctx.fill();
      }
      
      // Update CPS every 10 frames
      if (state.frameCount % 10 === 0) {
        // Use Inverse Square Law (1/r^2) for realistic 3D readings, rather than 2D visual hits
        const r = Math.max(10, detX - detWidth/2 - sourceX); 
        const k = 19200000; // Calibrated for ~3000 CPS at closest range (r=80)
        let theoreticalCps = k / (r * r);
        
        // Add +/- 5% realistic random fluctuation
        theoreticalCps += (Math.random() - 0.5) * 0.1 * theoreticalCps;
        
        setCps(prev => Math.floor(prev * 0.5 + theoreticalCps * 0.5));
      }
      
      // Draw Source Glow
      const glow = Math.sin(time / 150) * 0.2 + 0.8;
      ctx.shadowBlur = 40 * glow;
      ctx.shadowColor = '#fd7e14';
      ctx.beginPath();
      ctx.arc(sourceX, sourceY, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#fd7e14';
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Draw Source Box housing
      ctx.fillStyle = '#222';
      ctx.fillRect(sourceX - 40, sourceY - 40, 30, 80); 
      
      // Draw Detector connection wire extending backwards
      ctx.beginPath();
      ctx.moveTo(detX + detWidth/2, detY);
      ctx.lineTo(cw, detY);
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Draw Detector Tube body
      ctx.fillStyle = '#7f8c8d';
      ctx.fillRect(detX - detWidth/2, detY - detHeight/2, detWidth, detHeight);
      
      // Sensor window (front)
      ctx.fillStyle = state.flashHit > 0 ? '#2ecc71' : '#34495e';
      ctx.fillRect(detX - detWidth/2, detY - detHeight/2 + 2, 8, detHeight - 4);
      
      if (state.flashHit > 0) {
        state.flashHit -= 0.1;
      }
      
      animationRef.current = requestAnimationFrame(render);
    };
    
    animationRef.current = requestAnimationFrame(render);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="rd-container">
      <div className="rd-header">
        <Link to="/simulations" className="rd-back-btn">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          {t('detector.back')}
        </Link>
        <h1 className="rd-title">{t('detector.title')}</h1>
      </div>

      {/* Monitor Display */}
      <div className="rd-monitor-panel">
        <div className="rd-monitor-label">{t('detector.reading')}</div>
        <div className="rd-monitor-screen">
          <div className="rd-monitor-value">{cps.toString().padStart(4, '0')}</div>
          <div className="rd-monitor-unit">{t('detector.cps')}</div>
        </div>
        
        <div className="rd-monitor-bar-bg">
           {/* max cps approx ~2000-3000 at close range */}
          <div 
            className="rd-monitor-bar-fill" 
            style={{ 
              width: `${Math.min(100, (cps / 2500) * 100)}%`,
              backgroundColor: cps > 1500 ? '#e74c3c' : (cps > 500 ? '#f1c40f' : '#2ecc71')
            }}
          ></div>
        </div>
      </div>

      <div className="rd-simulation-area">
        <canvas ref={canvasRef} className="rd-canvas"></canvas>
        
        {/* LEGEND */}
        <div className="rd-legend-panel">
          <div className="rd-legend-title">{t('detector.legend')}</div>
          
          <div className="rd-legend-item">
            <div className="rd-legend-icon">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <circle cx="8" cy="8" r="6" fill="#fd7e14" />
              </svg>
            </div>
            <div>{t('detector.legendSource')}</div>
          </div>
          
          <div className="rd-legend-item">
            <div className="rd-legend-icon">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <circle cx="8" cy="8" r="3" fill="rgba(253, 126, 20, 0.8)" />
              </svg>
            </div>
            <div>{t('detector.legendParticle')}</div>
          </div>

          <div className="rd-legend-item">
            <div className="rd-legend-icon">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <rect x="4" y="2" width="8" height="12" fill="#7f8c8d" />
                <rect x="4" y="3" width="3" height="10" fill="#2ecc71" />
              </svg>
            </div>
            <div>{t('detector.legendSensor')}</div>
          </div>
        </div>
      </div>

      <div className="rd-controls-container">
        <div className="rd-control-group">
          <h3>{t('detector.distance')}</h3>
          <div className="rd-slider-container">
            <span>{t('detector.near')}</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={distance} 
              onChange={(e) => setDistance(Number(e.target.value))} 
              className="rd-slider"
            />
            <span>{t('detector.far')}</span>
          </div>
        </div>
      </div>

      <div className="rd-theory-section">
        <h2>{t('detector.theoryTitle')}</h2>
        <p>{t('detector.theoryContent1')}</p>
        <p>{t('detector.theoryContent2')}</p>
      </div>
    </div>
  );
};

export default RadiationDetector;
