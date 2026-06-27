import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './RutherfordScattering.css';

const RutherfordScattering = () => {
  const { t } = useTranslation('simulation');
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  const [modelType, setModelType] = useState('rutherford'); // 'rutherford' or 'thomson'
  const [energy, setEnergy] = useState(50); // 10 to 100
  const [showTraces, setShowTraces] = useState(true);
  
  // State refs for animation loop
  const stateRef = useRef({
    modelType: 'rutherford',
    energy: 50,
    showTraces: true,
    particles: [],
    nuclei: [],
    lastEmitTime: 0
  });

  // Update refs when state changes
  useEffect(() => {
    stateRef.current.modelType = modelType;
    stateRef.current.energy = energy;
    stateRef.current.showTraces = showTraces;
  }, [modelType, energy, showTraces]);

  // Canvas Resize and Initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Make canvas responsive
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      
      // Initialize Nuclei based on canvas size
      const cw = canvas.width;
      const ch = canvas.height;
      
      const newNuclei = [];
      const cols = 2;
      const rows = 3;
      // Position nuclei towards the right side of the canvas
      const startX = cw * 0.65;
      const startY = ch * 0.25;
      const spacingX = cw * 0.15;
      const spacingY = ch * 0.25;
      
      for(let i=0; i<cols; i++) {
        for(let j=0; j<rows; j++) {
          newNuclei.push({
            x: startX + i * spacingX,
            y: startY + j * spacingY,
            radius: 4, 
            charge: 79, // Gold Z=79
          });
        }
      }
      stateRef.current.nuclei = newNuclei;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Animation Loop
    const render = (time) => {
      const state = stateRef.current;
      const cw = canvas.width;
      const ch = canvas.height;
      
      // Clear with trailing effect for traces
      if (state.showTraces) {
        ctx.fillStyle = 'rgba(15, 15, 15, 0.12)';
        ctx.fillRect(0, 0, cw, ch);
      } else {
        ctx.clearRect(0, 0, cw, ch);
      }
      
      // Emit new particles
      const emissionRate = 120 - state.energy; // Higher energy = faster emission visual effect
      if (time - state.lastEmitTime > emissionRate) {
        state.lastEmitTime = time;
        // Emit from left side
        const vy = (Math.random() - 0.5) * 0.3; // Slight random angle
        state.particles.push({
          x: 0,
          y: ch * 0.1 + Math.random() * ch * 0.8,
          vx: 3 + (state.energy / 15), 
          vy: vy,
          life: 0
        });
      }
      
      // Draw Nuclei / Atom Model
      state.nuclei.forEach(n => {
        if (state.modelType === 'thomson') {
          const pudRadius = ch * 0.18;
          const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pudRadius);
          gradient.addColorStop(0, 'rgba(231, 76, 60, 0.15)');
          gradient.addColorStop(1, 'rgba(231, 76, 60, 0)');
          ctx.beginPath();
          ctx.arc(n.x, n.y, pudRadius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          
          ctx.fillStyle = 'rgba(52, 152, 219, 0.6)';
          for(let e=0; e<5; e++) {
            ctx.beginPath();
            ctx.arc(n.x + Math.cos(e*1.5)*30, n.y + Math.sin(e*1.5)*30, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 18);
          gradient.addColorStop(0, 'rgba(255, 215, 0, 1)');
          gradient.addColorStop(0.3, 'rgba(255, 215, 0, 0.6)');
          gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
          ctx.beginPath();
          ctx.arc(n.x, n.y, 18, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#FFD700';
          ctx.fill();
        }
      });
      
      // Update and Draw Particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        
        if (state.modelType === 'rutherford') {
          const k = 150; // Coulomb constant multiplier
          
          state.nuclei.forEach(n => {
            const dx = p.x - n.x;
            const dy = p.y - n.y;
            const distSq = dx*dx + dy*dy;
            const dist = Math.sqrt(distSq);
            
            if (dist > 2) {
              const force = (k * 2 * n.charge) / distSq;
              const massFactor = state.energy * 0.12; 
              const accel = force / massFactor;
              
              p.vx += accel * (dx / dist);
              p.vy += accel * (dy / dist);
            } else {
              p.vx *= -1;
              p.vy *= -1;
            }
          });
        }
        
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#e74c3c'; 
        ctx.fill();
        
        if (p.x < -100 || p.x > cw + 100 || p.y < -100 || p.y > ch + 100 || p.life > 1000) {
          state.particles.splice(i, 1);
        }
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
    <div className="rs-container">
      <div className="rs-header">
        <Link to="/simulations" className="rs-back-btn">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          {t('rutherford.back')}
        </Link>
        <h1 className="rs-title">{t('rutherford.title')}</h1>
      </div>

      <div className="rs-simulation-area">
        <canvas ref={canvasRef} className="rs-canvas"></canvas>
        <div className="rs-emitter-ui">
          <div className="rs-gun-barrel"></div>
          <div className="rs-gun-base">
            <span className="rs-gun-label">α</span>
          </div>
        </div>
      </div>

      <div className="rs-controls-container">
        <div className="rs-control-group">
          <h3>{t('rutherford.modelType')}</h3>
          <div className="rs-buttons">
            <button className={`rs-btn ${modelType === 'thomson' ? 'active' : ''}`} onClick={() => setModelType('thomson')}>{t('rutherford.modelThomson')}</button>
            <button className={`rs-btn ${modelType === 'rutherford' ? 'active' : ''}`} onClick={() => setModelType('rutherford')}>{t('rutherford.modelRutherford')}</button>
          </div>
        </div>

        <div className="rs-control-group">
          <h3>{t('rutherford.energyLabel')}</h3>
          <div className="rs-slider-container">
            <span>{t('rutherford.energyLow')}</span>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={energy} 
              onChange={(e) => setEnergy(Number(e.target.value))} 
              className="rs-slider"
            />
            <span>{t('rutherford.energyHigh')}</span>
          </div>
        </div>
        
        <div className="rs-control-group small">
          <h3>{t('rutherford.tracesLabel')}</h3>
          <div className="rs-buttons">
            <button className={`rs-btn ${showTraces ? 'active' : ''}`} onClick={() => setShowTraces(true)}>{t('rutherford.showTraces')}</button>
            <button className={`rs-btn ${!showTraces ? 'active' : ''}`} onClick={() => setShowTraces(false)}>{t('rutherford.hideTraces')}</button>
          </div>
        </div>
      </div>
      
      <div className="rs-info-panel">
        <div className="rs-info-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="#cca60b"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg></div>
        <div className="rs-info-text">
          {modelType === 'thomson' ? t('rutherford.infoThomson') : t('rutherford.infoRutherford')}
        </div>
      </div>

      <div className="rs-theory-section">
        <h2>{t('rutherford.theoryTitle')}</h2>
        <p>{t('rutherford.theoryContent1')}</p>
        <p>{t('rutherford.theoryContent2')}</p>
      </div>
    </div>
  );
};

export default RutherfordScattering;
