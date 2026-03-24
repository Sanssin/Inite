# GitHub Copilot Instructions — Project INITE

## Ringkasan Proyek

**INITE** (Indonesian Nuclear Interactive Website) adalah platform edukasi nuklir berbasis web dengan simulasi fisika interaktif. Target pengguna: masyarakat umum Indonesia.

## Tech Stack

- **Frontend**: React 18, Bootstrap 5, react-router-dom v6, i18next, HTML5 Canvas API
- **Backend**: Python 3.7+, FastAPI, Uvicorn
- **Styling**: CSS murni + Bootstrap (tidak ada Tailwind)
- **Bahasa UI**: Bahasa Indonesia (primer)

## Konvensi Kode

### React Components
```javascript
// ✅ Functional component + hooks
const SimulasiPeluruhan = () => {
  const [nilaiDosis, setNilaiDosis] = useState(0);
  const { t } = useTranslation(); // selalu gunakan i18next untuk teks UI
  
  return <div className="simulasi-container">{t('judul.simulasi')}</div>;
};
export default SimulasiPeluruhan;

// ❌ Hindari class components
class SimulasiPeluruhan extends React.Component { ... }
```

### Penamaan
- Komponen React: `PascalCase` → `GameArea.js`, `SimulationFrame.js`
- CSS class: `kebab-case` → `game-area`, `dose-display`
- Fungsi: `camelCase` → `calculateDose`, `handleAvatarMove`
- Konstanta fisika: `SCREAMING_SNAKE_CASE` → `HVL_PB`, `FLUCTUATION_FACTOR`
- Folder simulasi HTML5: `kebab-case` → `radioactive-decay/`, `nuclear-fission/`

### Routing
```javascript
// react-router-dom v6 pattern
<Route path="/simulasi/proteksi-radiasi" element={<ALARASimulation />} />
<Route path="/simulasi/peluruhan" element={<RadioactiveDecay />} />
```

## Backend Python (FastAPI)

```python
# Pattern endpoint simulasi
@app.post("/calculate")
async def calculate_dose(data: DoseInput):
    dose_rate = (data.activity_factor / (data.distance**2)) * \
                (0.5 ** (data.shield_thickness / HVL_PB))
    std_dev = FLUCTUATION_FACTOR * math.sqrt(dose_rate)
    return {"level": dose_rate, "std_dev": std_dev, "description": "..."}
```

- Semua konstanta fisika diberi nama SCREAMING_SNAKE_CASE
- Dokumentasikan rumus baru di `CATATAN_PERHITUNGAN.md`
- Satuan: μSv/jam untuk laju dosis, meter untuk jarak, cm untuk ketebalan perisai

## Simulasi HTML5 Canvas

Untuk simulasi baru (PhET-style), gunakan self-contained HTML5 di `public/simulations/`:

```javascript
// Pattern animasi Canvas
const canvas = document.getElementById('sim-canvas');
const ctx = canvas.getContext('2d');

function simulationLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePhysics();    // hitung fisika
  renderFrame(ctx);   // gambar frame
  requestAnimationFrame(simulationLoop);
}
simulationLoop();
```

```html
<!-- Embed di React via iframe -->
<iframe
  src="/simulations/radioactive-decay/index.html"
  title="Simulasi Peluruhan Radioaktif"
  className="simulation-frame"
/>
```

## Fisika Nuklir — Quick Reference

| Konsep | Rumus | Keterangan |
|---|---|---|
| Inverse Square Law | `D = A / r²` | D=dosis, A=aktivitas faktor, r=jarak |
| Atenuasi Perisai | `D × (0.5^(x/HVL))` | x=tebal perisai, HVL=half value layer |
| HVL Pb untuk Cs-137 | ~0.65 cm | Half Value Layer Timbal |
| Fluktuasi Gaussian | `μ ± σ√D` | Simulasi noise detektor |
| Peluruhan Radioaktif | `N(t) = N₀ × e^(-λt)` | λ = ln(2)/T½ |

## Aturan Penting

1. **Jangan commit ke `main`** — gunakan branch `newSimulation` atau branch fitur baru
2. **Dokumentasikan rumus baru** di `CATATAN_PERHITUNGAN.md`
3. **Selalu gunakan `t()` dari i18next** untuk teks yang tampil ke user
4. **Nilai fisika harus akurat** — referensi IAEA/BAPETEN/literatur standar
5. **Sertakan satuan** pada setiap variabel fisika (komentar atau nama variabel)

## Struktur Folder Penting

```
src/body/game/GameArea.js   → Simulasi ALARA (existing, jangan ubah sembarangan)
api/main.py                 → FastAPI backend, engine fisika
CATATAN_PERHITUNGAN.md      → Dokumentasi rumus (WAJIB dibaca)
public/simulations/         → HTML5 standalone simulations (rencana)
docs/skills/                → Skill files untuk AI agents
```
