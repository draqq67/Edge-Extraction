const STAGES = [
  { key: 'fetch',   label: 'Fetch Images',       desc: 'Downloading images from the dog API…'                    },
  { key: 'mirror',  label: 'Mirror',              desc: 'Flipping each image horizontally…'                       },
  { key: 'smooth',  label: 'Gaussian Blur',       desc: 'Converting to grayscale and applying Gaussian blur…'     },
  { key: 'nonmax',  label: 'Non-Max Suppression', desc: 'Computing Sobel gradients and thinning edges…'           },
  { key: 'hyster',  label: 'Hysteresis',          desc: 'Applying double threshold and edge tracking…'            },
];

const DOG_API = 'https://dog.ceo/api/breed/';
const N = 5;

function initAlbum() {
  const form        = document.getElementById('breedForm');
  const infoToggle  = document.getElementById('infoToggle');
  const infoPanel   = document.getElementById('infoPanel');

  // Info toggle
  infoToggle.addEventListener('click', () => {
    const open = !infoPanel.hidden;
    infoPanel.hidden = open;
    infoToggle.textContent = open ? 'Show Stage Info' : 'Hide Stage Info';
    infoToggle.setAttribute('aria-expanded', String(!open));
  });

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const breed = document.getElementById('breedSelect').value;
    await runAlbum(breed);
  });
}

/* ── Mirroring helper (pure canvas, no server) ─────────── */
function mirrorImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.translate(img.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0);
      resolve(c.toDataURL());
    };
    img.onerror = reject;
    img.src = src;
  });
}

/* ── Run the full pipeline ──────────────────────────────── */
async function runAlbum(breed) {
  const errorEl    = document.getElementById('albumError');
  const progressEl = document.getElementById('albumProgress');
  const pillsEl    = document.getElementById('stagePills');
  const descEl     = document.getElementById('stageDesc');
  const resultsEl  = document.getElementById('albumResults');
  const emptyEl    = document.getElementById('emptyState');
  const timingEl   = document.getElementById('timingSection');
  const timingList = document.getElementById('timingList');
  const loadBtn    = document.getElementById('loadBtn');

  // Reset UI
  errorEl.hidden = true;
  progressEl.hidden = false;
  resultsEl.innerHTML = '';
  emptyEl.hidden = true;
  timingEl.hidden = true;
  timingList.innerHTML = '';
  loadBtn.disabled = true;
  loadBtn.textContent = 'Loading…';

  const times = {};

  function setStage(key) {
    descEl.textContent = STAGES.find(s => s.key === key)?.desc || '';
    const pills = STAGES.map(s => {
      const idx     = STAGES.findIndex(st => st.key === key);
      const sIdx    = STAGES.findIndex(st => st.key === s.key);
      const status  = sIdx < idx ? 'done' : sIdx === idx ? 'active' : '';
      const spinner = status === 'active'
        ? `<span class="mini-spinner" style="border-top-color:#667eea"></span>`
        : status === 'done' ? '✓' : '';
      return `<div class="pill ${status}"><span class="pill-dot"></span>${s.label}${spinner}</div>`;
    }).join('');
    pillsEl.innerHTML = pills;
  }

  try {
    // 1. Fetch
    setStage('fetch');
    const t0  = performance.now();
    const res = await fetch(`${DOG_API}${breed}/images/random/${N}`);
    if (!res.ok) throw new Error('Dog API error: ' + res.status);
    const { message: urls } = await res.json();
    times.fetch = performance.now() - t0;

    // Pre-build rows in DOM so images appear as they process
    resultsEl.innerHTML = '';
    const rows = urls.map((_, i) => buildRow(i));

    // 2-5. Process each image
    for (let i = 0; i < N; i++) {
      const url = urls[i];
      rows[i].cells.original.src = url;

      setStage('mirror');
      const t1   = performance.now();
      const mirrored = await mirrorImage(url);
      times.mirror = (times.mirror || 0) + (performance.now() - t1);
      rows[i].cells.mirror.src = mirrored;

      setStage('smooth');
      const t2   = performance.now();
      const smoothed = await cannySmooth(mirrored);
      times.smooth = (times.smooth || 0) + (performance.now() - t2);
      rows[i].cells.smooth.src = smoothed;

      setStage('nonmax');
      const t3   = performance.now();
      const { gradientPhoto, gradientIntensity, gradientDirection, width, height } = await cannySobel(smoothed);
      const nonmaxed = await cannyNonMax(gradientPhoto, gradientIntensity, gradientDirection, width, height);
      times.nonmax = (times.nonmax || 0) + (performance.now() - t3);
      rows[i].cells.nonmax.src = nonmaxed;

      setStage('hyster');
      const t4   = performance.now();
      const final = await cannyHysteresis(nonmaxed, 100, 140);
      times.hyster = (times.hyster || 0) + (performance.now() - t4);
      rows[i].cells.final.src = final;
    }

    // Done
    progressEl.hidden = true;

    // Show timing
    timingList.innerHTML = STAGES.map(s =>
      times[s.key] !== undefined
        ? `<div class="timing-entry"><span>${s.label}</span><strong>${times[s.key].toFixed(0)} ms</strong></div>`
        : ''
    ).join('');
    timingEl.hidden = false;

  } catch (err) {
    errorEl.textContent = '⚠ ' + err.message;
    errorEl.hidden = false;
    progressEl.hidden = true;
    emptyEl.hidden = false;
  } finally {
    loadBtn.disabled = false;
    loadBtn.textContent = 'Load Images';
  }
}

/* ── Build a dog row ────────────────────────────────────── */
function buildRow(index) {
  const COLS = [
    { key: 'original', label: 'Original', color: '#6b7280' },
    { key: 'mirror',   label: 'Mirror',   color: '#8b5cf6' },
    { key: 'smooth',   label: 'Smooth',   color: '#667eea' },
    { key: 'nonmax',   label: 'Non-Max',  color: '#10b981' },
    { key: 'final',    label: 'Final',    color: '#ef4444' },
  ];

  const row = document.createElement('div');
  row.className = 'dog-row';

  const indexEl = document.createElement('div');
  indexEl.className = 'dog-index';
  indexEl.textContent = `#${index + 1}`;
  row.appendChild(indexEl);

  const pipeline = document.createElement('div');
  pipeline.className = 'pipeline-row';

  const cells = {};

  COLS.forEach((col, j) => {
    const cell = document.createElement('div');
    cell.className = 'stage-cell';

    const label = document.createElement('span');
    label.className = 'stage-label';
    label.style.color = col.color;
    label.textContent = col.label;

    const photoBox = document.createElement('div');
    photoBox.className = 'stage-photo' + (col.key === 'final' ? ' stage-final' : '');

    const spinner = document.createElement('div');
    spinner.className = 'mini-spinner';
    spinner.style.borderTopColor = col.color;
    photoBox.appendChild(spinner);

    const img = document.createElement('img');
    img.className = 'stage-img';
    img.alt = col.label + ' ' + (index + 1);
    img.hidden = true;
    img.onload = () => { spinner.remove(); img.hidden = false; };
    photoBox.appendChild(img);

    cell.appendChild(label);
    cell.appendChild(photoBox);

    if (j < COLS.length - 1) {
      const arrow = document.createElement('span');
      arrow.className = 'stage-arrow';
      arrow.textContent = '›';
      cell.appendChild(arrow);
    }

    pipeline.appendChild(cell);
    cells[col.key] = img;
  });

  row.appendChild(pipeline);
  document.getElementById('albumResults').appendChild(row);

  return { row, cells };
}
