import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './NuclearReactor.css';

const NuclearReactor = () => {
  const { t } = useTranslation('simulation');
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  const [controlRodLevel, setControlRodLevel] = useState(50); // 0 to 100 (0 = pulled, 100 = inserted)
  const [temperature, setTemperature] = useState(0); // 0 to 100
  const [isMeltdown, setIsMeltdown] = useState(false);
  
  // State refs for animation loop
  const stateRef = useRef({
    controlRodLevel: 50,
    temperature: 0,
    neutrons: [],
    atoms: [],
    flashes: [],
    lastTime: 0
  });

  useEffect(() => {
    stateRef.current.controlRodLevel = controlRodLevel;
  }, [controlRodLevel]);

  // Init Core
  const resetCore = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const cw = canvas.width;
    const ch = canvas.height;
    
    const newAtoms = [];
    const cols = 8;
    const rows = 6;
    const paddingX = cw * 0.15;
    const paddingY = ch * 0.15;
    const stepX = (cw - paddingX * 2) / (cols - 1);
    const stepY = (ch - paddingY * 2) / (rows - 1);
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        newAtoms.push({
          x: paddingX + i * stepX,
          y: paddingY + j * stepY,
          radius: 12,
          split: false,
          cooldown: 0
        });
      }
    }
    
    stateRef.current.atoms = newAtoms;
    stateRef.current.neutrons = [];
    stateRef.current.flashes = [];
    stateRef.current.temperature = 0;
    setTemperature(0);
    setIsMeltdown(false);
  };

  const fireNeutron = () => {
    if (isMeltdown) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Fire from left center
    stateRef.current.neutrons.push({
      x: 0,
      y: canvas.height / 2 + (Math.random() * 40 - 20),
      vx: 4,
      vy: (Math.random() - 0.5) * 2,
      active: true
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      resetCore();
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    const render = (time) => {
      const state = stateRef.current;
      const cw = canvas.width;
      const ch = canvas.height;
      const dt = time - (state.lastTime || time);
      state.lastTime = time;
      
      // Draw background (water moderator)
      // Heat color changes moderator color
      const heatRatio = state.temperature / 100;
      const bgR = Math.min(255, 10 + heatRatio * 200);
      const bgB = Math.max(20, 100 - heatRatio * 80);
      ctx.fillStyle = `rgba(${bgR}, 20, ${bgB}, 0.2)`;
      ctx.fillRect(0, 0, cw, ch);
      
      // Update Temperature Decay
      if (state.temperature > 0) {
        state.temperature -= 0.05; // cooling (slower so reaction lasts longer)
      }
      
      // Control Rod boundaries
      const rods = [
        { x: cw * 0.25, width: 25 },
        { x: cw * 0.50, width: 25 },
        { x: cw * 0.75, width: 25 },
      ];
      const rodHeight = (state.controlRodLevel / 100) * ch;
      
      // Draw Control Rods
      ctx.fillStyle = '#2c3e50';
      rods.forEach(rod => {
        ctx.fillRect(rod.x - rod.width/2, 0, rod.width, rodHeight);
        
        // Rod styling
        ctx.fillStyle = '#34495e';
        ctx.fillRect(rod.x - rod.width/2 + 2, 0, rod.width - 4, rodHeight - 2);
        ctx.fillStyle = '#2c3e50';
      });
      
      // Draw Flashes
      for (let i = state.flashes.length - 1; i >= 0; i--) {
        const f = state.flashes[i];
        f.life -= 0.05;
        if (f.life <= 0) {
          state.flashes.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(f.x, f.y, 40 * (1 - f.life), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 200, 50, ${f.life})`;
          ctx.fill();
        }
      }
      
      // Update and Draw Neutrons
      for (let i = state.neutrons.length - 1; i >= 0; i--) {
        const n = state.neutrons[i];
        
        n.x += n.vx;
        n.y += n.vy;
        
        // Check Control Rod collision
        let absorbed = false;
        rods.forEach(rod => {
          if (n.x > rod.x - rod.width/2 && n.x < rod.x + rod.width/2 && n.y < rodHeight) {
            absorbed = true;
          }
        });
        
        if (absorbed) {
          state.neutrons.splice(i, 1);
          continue;
        }
        
        // Bounds check
        if (n.x < 0 || n.x > cw || n.y < 0 || n.y > ch) {
          state.neutrons.splice(i, 1);
          continue;
        }
        
        // Atom Collision check
        let hit = false;
        for (let a of state.atoms) {
          if (!a.split) {
            const dx = n.x - a.x;
            const dy = n.y - a.y;
            if (dx*dx + dy*dy < a.radius * a.radius) {
              a.split = true;
              hit = true;
              state.temperature += 4; // heat increases on fission
              
              state.flashes.push({x: a.x, y: a.y, life: 1});
              
              // Spawn new neutrons
              const numNew = 2 + Math.floor(Math.random() * 2); // 2 or 3
              for(let j=0; j<numNew; j++) {
                const angle = Math.random() * Math.PI * 2;
                state.neutrons.push({
                  x: a.x,
                  y: a.y,
                  vx: Math.cos(angle) * 3.5, // slower speed
                  vy: Math.sin(angle) * 3.5
                });
              }
              break; // break atom loop
            }
          }
        }
        
        if (hit) {
          state.neutrons.splice(i, 1); // original neutron consumed
          continue;
        }
        
        // Draw Neutron
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffff';
        ctx.fill();
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#00ffff';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      
      // Draw Atoms
      state.atoms.forEach(a => {
        if (!a.split) {
          // Intact Uranium
          ctx.beginPath();
          ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#2ecc71';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(a.x - 3, a.y - 3, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.fill();
        } else {
          // Fission fragments
          ctx.beginPath();
          ctx.arc(a.x - 5, a.y - 5, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#7f8c8d';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(a.x + 5, a.y + 5, 4, 0, Math.PI * 2);
          ctx.fill();
          
          // Regenerate after cooldown
          a.cooldown++;
          if (a.cooldown > 250) { // Approx 4 seconds at 60fps
            a.split = false;
            a.cooldown = 0;
          }
        }
      });
      
      // Update external React state for UI
      setTemperature(Math.min(100, Math.max(0, state.temperature)));
      
      if (state.temperature >= 100) {
        setIsMeltdown(true);
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
    <div className="nr-container">
      <div className="nr-header">
        <Link to="/simulations" className="nr-back-btn">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          {t('reactor.back')}
        </Link>
        <h1 className="nr-title">{t('reactor.title')}</h1>
      </div>

      <div className={`nr-simulation-area ${isMeltdown ? 'meltdown-shake' : ''}`}>
        <canvas ref={canvasRef} className="nr-canvas"></canvas>
        {isMeltdown && (
          <div className="nr-meltdown-overlay">
            <div className="nr-meltdown-text">
              <h2>{t('reactor.meltdown')}</h2>
              <p>{t('reactor.meltdownSub')}</p>
            </div>
          </div>
        )}
        
        {/* LEGEND */}
        <div className="nr-legend-panel">
          <div className="nr-legend-title">{t('reactor.legend')}</div>
          
          <div className="nr-legend-item">
            <div className="nr-legend-icon">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <circle cx="8" cy="8" r="6" fill="#2ecc71" />
                <circle cx="6" cy="6" r="2" fill="rgba(255,255,255,0.4)" />
              </svg>
            </div>
            <div>{t('reactor.legendUranium')}</div>
          </div>
          
          <div className="nr-legend-item">
            <div className="nr-legend-icon">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <circle cx="8" cy="8" r="4" fill="#00ffff" />
              </svg>
            </div>
            <div>{t('reactor.legendNeutron')}</div>
          </div>

          <div className="nr-legend-item">
            <div className="nr-legend-icon">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <rect x="4" y="2" width="8" height="12" fill="#2c3e50" />
                <rect x="5" y="3" width="6" height="10" fill="#34495e" />
              </svg>
            </div>
            <div>{t('reactor.legendControlRod')}</div>
          </div>
          
          <div className="nr-legend-item">
            <div className="nr-legend-icon">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <circle cx="8" cy="8" r="6" fill="rgba(255, 200, 50, 0.8)" />
              </svg>
            </div>
            <div>{t('reactor.legendFission')}</div>
          </div>
        </div>
      </div>

      <div className="nr-controls-container">
        <div className="nr-control-group">
          <h3>{t('reactor.controlRods')}</h3>
          <div className="nr-slider-container">
            <span>{t('reactor.pulled')}</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={controlRodLevel} 
              onChange={(e) => setControlRodLevel(Number(e.target.value))} 
              className="nr-slider"
            />
            <span>{t('reactor.inserted')}</span>
          </div>
        </div>

        <div className="nr-control-group small">
          <h3>Aksi</h3>
          <div className="nr-buttons">
            <button className="nr-btn fire" onClick={fireNeutron} disabled={isMeltdown}>{t('reactor.fireNeutron')}</button>
            <button className="nr-btn reset" onClick={resetCore}>{t('reactor.resetCore')}</button>
          </div>
        </div>
      </div>
      
      {/* Temperature Bar */}
      <div className="nr-temperature-panel">
        <div className="nr-temp-header">
          <span>{t('reactor.temperature')}</span>
          <span style={{color: temperature > 80 ? '#e74c3c' : '#2ecc71', fontWeight: 'bold'}}>
            {temperature > 80 ? t('reactor.critical') : t('reactor.normal')}
          </span>
        </div>
        <div className="nr-temp-bar-bg">
          <div 
            className="nr-temp-bar-fill" 
            style={{ 
              width: `${temperature}%`,
              background: `linear-gradient(90deg, #2ecc71, ${temperature > 50 ? '#f1c40f' : '#2ecc71'} 50%, #e74c3c)`
            }}
          ></div>
        </div>
      </div>

      <div className="nr-theory-section">
        <h2>{t('reactor.theoryTitle')}</h2>
        <p>{t('reactor.theoryContent1')}</p>
        <p>{t('reactor.theoryContent2')}</p>
      </div>
    </div>
  );
};

export default NuclearReactor;
