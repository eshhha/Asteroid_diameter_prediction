import './style.css';

type Prediction = {
  name: string;
  diameter: number;
  magnitude: number;
  albedo: number;
  capturedAt: string;
};

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) throw new Error('App root not found');

const samplePrediction: Prediction = {
  name: '2024 QX7',
  diameter: 0.42,
  magnitude: 18.7,
  albedo: 0.18,
  capturedAt: 'Just now',
};

const predictions: Prediction[] = [samplePrediction];

app.innerHTML = `
  <main class="shell">
    <header class="topbar">
      <a class="brand" href="#top" aria-label="Asteroid Diameter Explorer home">
        <span class="brand-mark" aria-hidden="true"><span></span></span>
        <span>ASTEROID<span class="brand-soft">LAB</span></span>
      </a>
      <div class="topbar-meta"><span class="status-dot"></span> Local prediction workspace <span class="divider"></span> v0.1</div>
    </header>

    <section class="hero" id="top">
      <div class="hero-copy">
        <p class="eyebrow">Orbital object intelligence / 01</p>
        <h1>Read the <em>shape</em><br />of a small world.</h1>
        <p class="hero-description">Estimate an asteroid's diameter from the signals astronomers can see first: absolute magnitude, reflectivity, and orbital character.</p>
      </div>
      <div class="orbit-visual" aria-label="Decorative orbital visualization">
        <div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="orbit orbit-c"></div>
        <div class="sun"></div><div class="asteroid"><span></span></div>
        <span class="orbit-label label-top">NEO / 03</span><span class="orbit-label label-bottom">EST. RANGE</span>
      </div>
    </section>

    <section class="workspace-grid">
      <form class="panel input-panel" id="prediction-form">
        <div class="panel-heading"><div><p class="section-kicker">01 / Signal inputs</p><h2>Describe the object</h2></div><span class="panel-index">A</span></div>
        <div class="field-grid">
          <label class="field field-wide"><span>Object designation <small>optional</small></span><input id="object-name" type="text" value="2024 QX7" placeholder="e.g. 2024 QX7" /></label>
          <label class="field"><span>Absolute magnitude H <small>mag</small></span><input id="magnitude" type="number" min="-5" max="35" step="0.1" value="18.7" required /></label>
          <label class="field"><span>Geometric albedo <small>0 - 1</small></span><input id="albedo" type="number" min="0.01" max="1" step="0.01" value="0.18" required /></label>
          <label class="field"><span>Semi-major axis <small>AU</small></span><input id="axis" type="number" min="0" max="100" step="0.01" value="2.35" /></label>
          <label class="field"><span>Eccentricity <small>e</small></span><input id="eccentricity" type="number" min="0" max="0.99" step="0.01" value="0.41" /></label>
          <label class="field"><span>Inclination <small>deg</small></span><input id="inclination" type="number" min="0" max="180" step="0.1" value="7.2" /></label>
          <label class="field"><span>Taxonomic class</span><select id="class"><option>C</option><option selected>S</option><option>X</option><option>Other</option></select></label>
        </div>
        <div class="toggle-row"><label class="toggle-label"><input id="neo" type="checkbox" checked /><span class="toggle"></span><span>Near-Earth object</span></label><label class="toggle-label"><input id="pha" type="checkbox" /><span class="toggle"></span><span>Potentially hazardous</span></label></div>
        <button class="primary-button" type="submit"><span>Run diameter estimate</span><span class="button-arrow">&rarr;</span></button>
        <p class="fine-print">Baseline uses the H–albedo relationship: D = 1329 / sqrt(p) &times; 10<sup>-H/5</sup>. Results are estimates, not observations.</p>
      </form>

      <aside class="panel result-panel" aria-live="polite">
        <div class="panel-heading"><div><p class="section-kicker">02 / Model output</p><h2>Diameter estimate</h2></div><span class="live-tag">LIVE</span></div>
        <div class="result-number"><span id="diameter-value">0.42</span><small>km</small></div>
        <div class="range-row"><span>Likely range</span><strong id="range-value">0.34 - 0.53 km</strong></div>
        <div class="range-track"><span id="range-marker"></span></div>
        <div class="confidence-row"><div><span class="metric-label">Signal confidence</span><strong id="confidence-value">82%</strong></div><div class="confidence-ring"><span id="confidence-ring-value">82</span><small>%</small></div></div>
        <div class="result-divider"></div>
        <div class="insight"><span class="insight-icon">i</span><p id="insight-text">A moderate albedo with a faint apparent brightness points to a compact, stony object.</p></div>
      </aside>
    </section>

    <section class="lower-grid">
      <div class="panel context-panel"><div class="panel-heading"><div><p class="section-kicker">03 / Orbital context</p><h2>What shaped the estimate?</h2></div></div><div class="context-list"><div><span class="context-key">Brightness</span><strong id="brightness-context">Faint / small</strong><p>H magnitude is the strongest observable size signal.</p></div><div><span class="context-key">Surface</span><strong id="surface-context">Stony / reflective</strong><p>Albedo changes how much light becomes visible.</p></div><div><span class="context-key">Trajectory</span><strong id="trajectory-context">Main-belt crossing</strong><p>Orbital fields add context for the eventual ML model.</p></div></div></div>
      <div class="panel history-panel"><div class="panel-heading"><div><p class="section-kicker">04 / Session history</p><h2>Recent estimates</h2></div><button class="text-button" id="clear-history" type="button">Clear all</button></div><div id="history-list" class="history-list"></div></div>
    </section>
    <footer><span>ASTEROIDLAB / DIAMETER EXPLORER</span><span>Built for exploratory analysis</span></footer>
  </main>
`;

const byId = <T extends HTMLElement>(id: string) => document.querySelector<T>(`#${id}`)!;

function calculateDiameter(magnitude: number, albedo: number) {
  return 1329 / Math.sqrt(albedo) * 10 ** (-magnitude / 5);
}

function renderHistory() {
  const history = byId<HTMLDivElement>('history-list');
  history.innerHTML = predictions.length
    ? predictions.map((item) => `<div class="history-item"><div><strong>${item.name || 'Unnamed object'}</strong><span>H ${item.magnitude.toFixed(1)} &middot; p ${item.albedo.toFixed(2)}</span></div><strong>${item.diameter.toFixed(2)} km</strong><small>${item.capturedAt}</small></div>`).join('')
    : '<p class="empty-history">No estimates in this session.</p>';
}

function updateResult(event: SubmitEvent) {
  event.preventDefault();
  const magnitude = Number(byId<HTMLInputElement>('magnitude').value);
  const albedo = Number(byId<HTMLInputElement>('albedo').value);
  const axis = Number(byId<HTMLInputElement>('axis').value);
  const eccentricity = Number(byId<HTMLInputElement>('eccentricity').value);
  const diameter = calculateDiameter(magnitude, albedo);
  const uncertainty = Math.max(0.12, Math.min(0.3, 0.12 + eccentricity * 0.12));
  const confidence = Math.round(94 - Math.abs(albedo - 0.2) * 36 - eccentricity * 10);
  const lower = diameter * (1 - uncertainty);
  const upper = diameter * (1 + uncertainty);
  const className = byId<HTMLSelectElement>('class').value;
  const orbitLabel = axis < 1.3 ? 'Near-Earth crossing' : axis < 3.3 ? 'Main-belt crossing' : 'Outer orbit';
  const surfaceLabel = className === 'S' ? 'Stony / reflective' : className === 'C' ? 'Carbon-rich / dark' : 'Mixed / uncertain';

  byId('diameter-value').textContent = diameter.toFixed(2);
  byId('range-value').textContent = `${lower.toFixed(2)} - ${upper.toFixed(2)} km`;
  byId('confidence-value').textContent = `${confidence}%`;
  byId('confidence-ring-value').textContent = String(confidence);
  byId('range-marker').style.left = `${Math.min(91, Math.max(9, confidence))}%`;
  byId('brightness-context').textContent = magnitude > 18 ? 'Faint / small' : magnitude > 12 ? 'Moderate' : 'Bright / large';
  byId('surface-context').textContent = surfaceLabel;
  byId('trajectory-context').textContent = orbitLabel;
  byId('insight-text').textContent = `${surfaceLabel} surfaces reflect ${Math.round(albedo * 100)}% of incoming light. Combined with H ${magnitude.toFixed(1)}, the baseline centers on a ${diameter.toFixed(2)} km object.`;

  predictions.unshift({ name: byId<HTMLInputElement>('object-name').value, diameter, magnitude, albedo, capturedAt: 'Just now' });
  renderHistory();
}

byId<HTMLFormElement>('prediction-form').addEventListener('submit', updateResult);
byId<HTMLButtonElement>('clear-history').addEventListener('click', () => { predictions.length = 0; renderHistory(); });
renderHistory();