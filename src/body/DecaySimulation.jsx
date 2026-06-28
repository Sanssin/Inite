import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './DecaySimulation.css';

const ISOTOPES = {
  cs137: { id: 'cs-137', name: 'Cesium-137', halfLife: 30.17, color: '#00e5ff' },
  co60: { id: 'co-60', name: 'Cobalt-60', halfLife: 5.27, color: '#ff4444' },
  na22: { id: 'na-22', name: 'Natrium-22', halfLife: 2.60, color: '#00ff88' },
  am241: { id: 'am-241', name: 'Americium-241', halfLife: 432.2, color: '#fd7e14' },
  u235: { id: 'u-235', name: 'Uranium-235', halfLife: 704000000, color: '#9c27b0' },
  th232: { id: 'th-232', name: 'Thorium-232', halfLife: 14000000000, color: '#607d8b' },
  pu239: { id: 'pu-239', name: 'Plutonium-239', halfLife: 24110, color: '#e91e63' },
  i131: { id: 'i-131', name: 'Iodine-131', halfLife: 0.02197, color: '#e040fb' }
};

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
};

const DecaySimulation = () => {
  const { t } = useTranslation('simulation');
  const canvasRef = useRef(null);
  const graphCanvasRef = useRef(null);
  const animationRef = useRef(null);

  const [selectedIsoKey, setSelectedIsoKey] = useState('cs137');
  const [timeSpeed, setTimeSpeed] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  
  const [uiActiveAtoms, setUiActiveAtoms] = useState(1000000);
  const [uiSimTime, setUiSimTime] = useState(0);

  const stateRef = useRef({
    isotope: ISOTOPES.cs137,
    initialAtoms: 1000000,
    activeAtoms: 1000000,
    simTime: 0,
    isRunning: false,
    timeSpeed: 10,
    history: [[0, 1000000]],
    particles: [],
    lastTime: 0,
    lastGraphUpdate: 0
  });

  useEffect(() => {
    stateRef.current.timeSpeed = timeSpeed;
    stateRef.current.isRunning = isRunning;
  }, [timeSpeed, isRunning]);

  useEffect(() => {
    const iso = ISOTOPES[selectedIsoKey];
    stateRef.current.isotope = iso;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    resetSimulation();
  }, [selectedIsoKey]);

  const resetSimulation = () => {
    stateRef.current.activeAtoms = stateRef.current.initialAtoms;
    stateRef.current.simTime = 0;
    stateRef.current.history = [[0, stateRef.current.initialAtoms]];
    stateRef.current.particles = [];
    stateRef.current.lastGraphUpdate = 0;
    setIsRunning(false);
    setUiActiveAtoms(stateRef.current.initialAtoms);
    setUiSimTime(0);
    drawGraph(stateRef.current);
  };

  const drawGraph = (state) => {
    const gCanvas = graphCanvasRef.current;
    if (!gCanvas) return;
    const gCtx = gCanvas.getContext('2d');
    
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    
    gCtx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height);
    gCtx.strokeStyle = 'rgba(255,255,255,0.1)';
    gCtx.lineWidth = 1;
    gCtx.strokeRect(0, 0, gCanvas.width, gCanvas.height);

    if (state.history.length === 0) return;

    const maxTime = Math.max(state.simTime, state.isotope.halfLife * 2);
    
    gCtx.beginPath();
    gCtx.strokeStyle = state.isotope.color;
    gCtx.lineWidth = 2;

    state.history.forEach((point, i) => {
      const x = (point[0] / maxTime) * gCanvas.width;
      const y = gCanvas.height - (point[1] / state.initialAtoms) * gCanvas.height;
      if (i === 0) gCtx.moveTo(x, y);
      else gCtx.lineTo(x, y);
    });
    gCtx.stroke();

    for (let hl = 1; hl <= 5; hl++) {
      const hlx = (state.isotope.halfLife * hl / maxTime) * gCanvas.width;
      if (hlx < gCanvas.width) {
        gCtx.setLineDash([4, 4]);
        gCtx.beginPath();
        gCtx.moveTo(hlx, 0);
        gCtx.lineTo(hlx, gCanvas.height);
        gCtx.strokeStyle = 'rgba(255,255,255,0.2)';
        gCtx.stroke();
        gCtx.setLineDash([]);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      if (!canvas || !canvas.parentElement) return;
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      
      const gCanvas = graphCanvasRef.current;
      if (gCanvas && gCanvas.parentElement) {
        const gParent = gCanvas.parentElement;
        gCanvas.width = gParent.clientWidth;
        gCanvas.height = gParent.clientHeight;
        drawGraph(stateRef.current);
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    setTimeout(resizeCanvas, 100);
    
    const render = (timestamp) => {
      const state = stateRef.current;
      
      if (!state.lastTime) state.lastTime = timestamp;
      const dt = Math.min((timestamp - state.lastTime) / 1000, 0.1);
      state.lastTime = timestamp;
      
      if (state.isRunning) {
        const simDt = dt * state.timeSpeed;
        state.simTime += simDt;

        const lambda = Math.LN2 / state.isotope.halfLife;
        const newActive = state.initialAtoms * Math.exp(-lambda * state.simTime);
        state.activeAtoms = newActive;

        const remainingRatio = state.activeAtoms / state.initialAtoms;
        
        let pps = 40 * remainingRatio * (state.timeSpeed / 10);
        if (pps > 200) pps = 200;

        const spawnCount = Math.floor(pps * dt) + (Math.random() < (pps * dt % 1) ? 1 : 0);

        for (let i = 0; i < spawnCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 100 + Math.random() * 150;
            const rOffset = 40 * (0.5 + remainingRatio * 0.5) * Math.random();
            
            state.particles.push({
                x: canvas.width / 2 + Math.cos(angle) * rOffset,
                y: canvas.height / 2 + Math.sin(angle) * rOffset,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0 + Math.random() * 0.5,
                maxLife: 1.5
            });
        }
        
        if (Math.floor(timestamp / 200) % 2 === 0) {
           setUiActiveAtoms(state.activeAtoms);
           setUiSimTime(state.simTime);
        }

        const captureInterval = Math.max(state.isotope.halfLife / 100, 0.05);
        if (state.simTime - state.lastGraphUpdate >= captureInterval) {
            state.history.push([state.simTime, state.activeAtoms]);
            state.lastGraphUpdate = state.simTime;
            drawGraph(state);
        }
      }

      for (let i = state.particles.length - 1; i >= 0; i--) {
          const p = state.particles[i];
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
          if (p.life <= 0) {
              state.particles.splice(i, 1);
          }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const remainingRatio = state.activeAtoms / state.initialAtoms;
      const scale = 0.6 + remainingRatio * 0.4;
      const rgb = hexToRgb(state.isotope.color);

      if (remainingRatio > 0.01 || !state.isRunning) {
          const glowRatio = state.isRunning ? remainingRatio : 1.0;
          ctx.beginPath();
          ctx.arc(cx, cy, 150 * scale, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(cx, cy, 30 * scale, cx, cy, 150 * scale);
          grad.addColorStop(0, `rgba(${rgb}, ${glowRatio * 0.5})`);
          grad.addColorStop(1, `rgba(${rgb}, 0)`);
          ctx.fillStyle = grad;
          ctx.fill();
      }

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      const pts = [
          {x: 0, y: -70}, {x: 40, y: -30}, {x: 70, y: 30}, {x: 20, y: 80},
          {x: -30, y: 70}, {x: -70, y: 20}, {x: -40, y: -40}
      ];

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for(let i=1; i<pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
      
      ctx.fillStyle = '#1c1c24';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#000';
      ctx.stroke();

      const opacities = [1.0, 0.7, 0.5, 0.8, 0.6, 0.9, 0.4];
      for(let i=0; i<pts.length; i++) {
          const next = (i + 1) % pts.length;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[next].x, pts[next].y);
          ctx.lineTo(5, -5);
          ctx.closePath();
          
          const currentOpacity = state.isRunning ? remainingRatio : 1.0;
          ctx.fillStyle = `rgba(${rgb}, ${currentOpacity * opacities[i]})`;
          ctx.fill();
          
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(5, -5);
          ctx.strokeStyle = 'rgba(255,255,255,0.15)';
          ctx.lineWidth = 1;
          ctx.stroke();
      }
      ctx.restore();

      state.particles.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = state.isotope.color;
          ctx.globalAlpha = p.life / p.maxLife;
          ctx.fill();
          
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 0.1, p.y - p.vy * 0.1);
          ctx.strokeStyle = state.isotope.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();
      });
      ctx.globalAlpha = 1.0;

      animationRef.current = requestAnimationFrame(render);
    };
    
    animationRef.current = requestAnimationFrame(render);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="decay-container">
      <div className="decay-header">
        <Link to="/simulations" className="decay-back-btn">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          {t('decay.backToMenu')}
        </Link>
        <h1 className="decay-title">{t('decay.title')}</h1>
      </div>

      <div className="decay-main-grid">
        <div className="decay-simulation-area">
          <canvas ref={canvasRef} className="decay-canvas"></canvas>
          <div className="decay-legend-panel">
            <div className="decay-legend-title">{t('decay.edu.isotopeInfo')}</div>
            <div className="decay-isotope-name" style={{ color: ISOTOPES[selectedIsoKey].color }}>
              {ISOTOPES[selectedIsoKey].name}
            </div>
            <div className="decay-isotope-desc">
              {t(`cards.sourceDesc.${ISOTOPES[selectedIsoKey].id}`, ISOTOPES[selectedIsoKey].name)}
            </div>
          </div>
        </div>

        <div className="decay-stats-panel">
          <div className="decay-stat-box">
            <div className="decay-stat-label">Half-Life (T½)</div>
            <div className="decay-stat-value">{ISOTOPES[selectedIsoKey].halfLife} {t('decay.years')}</div>
          </div>
          <div className="decay-stat-box">
            <div className="decay-stat-label">{t('decay.activeAtoms')}</div>
            <div className="decay-stat-value">{Math.floor(uiActiveAtoms).toLocaleString()}</div>
          </div>
          <div className="decay-stat-box">
            <div className="decay-stat-label">{t('decay.simTime')}</div>
            <div className="decay-stat-value">{uiSimTime.toFixed(1)} {t('decay.years')}</div>
          </div>
          <div className="decay-graph-container">
             <canvas ref={graphCanvasRef} className="decay-graph-canvas"></canvas>
          </div>
        </div>
      </div>

      <div className="decay-controls-container">
        <div className="decay-control-group">
          <h3>{t('decay.selectIsotope')}</h3>
          <select 
            value={selectedIsoKey} 
            onChange={(e) => setSelectedIsoKey(e.target.value)}
            className="decay-select"
          >
            {Object.keys(ISOTOPES).map(k => (
              <option key={k} value={k}>{ISOTOPES[k].name}</option>
            ))}
          </select>
        </div>
        
        <div className="decay-control-group">
          <h3>{t('decay.speed')} {timeSpeed} {t('decay.years')}/sec</h3>
          <div className="decay-slider-container">
            <span>0.1</span>
            <input 
              type="range" 
              min="0.1" 
              max="50" 
              step="0.1" 
              value={timeSpeed} 
              onChange={(e) => setTimeSpeed(Number(e.target.value))} 
              className="decay-slider"
            />
            <span>50</span>
          </div>
        </div>

        <div className="decay-control-group action-group">
          <button 
            className={`decay-action-btn ${isRunning ? 'active' : ''}`}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'PAUSE' : 'START'}
          </button>
          <button 
            className="decay-reset-btn"
            onClick={resetSimulation}
          >
            {t('decay.reset')}
          </button>
        </div>
      </div>

      <div className="decay-theory-section">
        <h2>{t('decay.edu.title')}</h2>
        
        <div className="theory-block">
          <h3>{t('decay.edu.whatIsDecay')}</h3>
          <p>{t('decay.edu.whatIsDecayDesc')}</p>
        </div>

        <div className="theory-block">
          <h3>{t('decay.edu.halfLife')}</h3>
          <p>{t('decay.edu.halfLifeDesc')}</p>
        </div>

        <div className="theory-block">
          <h3>{t('decay.edu.decayLaw')}</h3>
          <div className="formula-box">N(t) = N₀ · e<sup>-λt</sup></div>
          <p>{t('decay.edu.decayLawDesc')}</p>
        </div>
      </div>
    </div>
  );
};

export default DecaySimulation;
