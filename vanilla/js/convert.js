const STEPS = [
  { id: 'smooth', label: 'Grayscale & Gaussian Blur', color: '#667eea', desc: 'Converting to grayscale and reducing noise…'       },
  { id: 'sobel',  label: 'Sobel Gradient',            color: '#f59e0b', desc: 'Computing gradient intensity and direction…'        },
  { id: 'nonmax', label: 'Non-Max Suppression',        color: '#10b981', desc: 'Thinning edges to single-pixel width…'             },
  { id: 'final',  label: 'Hysteresis Thresholding',   color: '#ef4444', desc: 'Applying double threshold and edge tracking…'      },
];

function validateUrl(url) {
  if (!url.trim()) return 'Please enter an image URL.';
  const http   = /^https?:\/\/.+\.(jpg|jpeg|png)(\?.*)?$/i.test(url);
  const base64 = /^data:image\/(jpeg|png|jpg);base64,/.test(url);
  if (!http && !base64)
    return 'URL must point to a .jpg, .jpeg, or .png file (https://…), or be a base64 data: URL.';
  return '';
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function initConvert() {
  const form       = document.getElementById('convertForm');
  const urlInput   = document.getElementById('imageUrl');
  const urlError   = document.getElementById('urlError');
  const lowT       = document.getElementById('lowT');
  const highT      = document.getElementById('highT');
  const lowVal     = document.getElementById('lowVal');
  const highVal    = document.getElementById('highVal');
  const threshErr  = document.getElementById('threshError');
  const submitBtn  = document.getElementById('submitBtn');
  const progressBox = document.getElementById('progressBox');
  const progSteps  = document.getElementById('progSteps');
  const progDesc   = document.getElementById('progDesc');
  const emptyState = document.getElementById('emptyState');
  const photosGrid = document.getElementById('photosGrid');
  const cardResult = document.getElementById('cardResult');
  const cardProc   = document.getElementById('cardProcessing');
  const imgOrig    = document.getElementById('imgOriginal');
  const imgResult  = document.getElementById('imgResult');
  const downloadLnk = document.getElementById('downloadLink');
  const loaderLabel = document.getElementById('loaderLabel');
  const timingCard = document.getElementById('timingCard');
  const timingRows = document.getElementById('timingRows');

  // Slider live labels
  lowT.addEventListener('input',  () => { lowVal.textContent  = lowT.value;  checkThresh(); });
  highT.addEventListener('input', () => { highVal.textContent = highT.value; checkThresh(); });

  function checkThresh() {
    const bad = parseInt(lowT.value) >= parseInt(highT.value);
    threshErr.hidden  = !bad;
    submitBtn.disabled = bad;
  }

  // URL input: clear error on change
  urlInput.addEventListener('input', () => { urlError.hidden = true; });

  // Progress helpers
  function setStep(activeId) {
    const activeIdx = STEPS.findIndex(s => s.id === activeId);
    progDesc.textContent = STEPS[activeIdx]?.desc || '';
    loaderLabel.textContent = STEPS[activeIdx]?.label || '';

    progSteps.innerHTML = STEPS.map((s, i) => {
      const status = i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'pending';
      const dot    = `<span class="prog-dot" style="background:${status !== 'pending' ? s.color : '#d1d5db'}"></span>`;
      const check  = status === 'done'   ? '<span class="prog-check">✓</span>' : '';
      const spin   = status === 'active'
        ? `<span class="prog-spinner" style="border-top-color:${s.color}"></span>`
        : '';
      return `<div class="prog-row ${status}">${dot}<span class="prog-label">${s.label}</span>${check}${spin}</div>`;
    }).join('');
  }

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url  = urlInput.value.trim();
    const err  = validateUrl(url);
    if (err) { urlError.textContent = '⚠ ' + err; urlError.hidden = false; return; }
    if (parseInt(lowT.value) >= parseInt(highT.value)) return;

    const low  = parseInt(lowT.value);
    const high = parseInt(highT.value);

    // Reset UI
    urlError.hidden = true;
    emptyState.hidden = true;
    photosGrid.hidden = false;
    cardResult.hidden = true;
    cardProc.hidden = false;
    timingCard.hidden = true;
    progressBox.hidden = false;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing…';

    imgOrig.src = url;

    const times = {};

    try {
      setStep('smooth');
      const t0 = performance.now();
      const smoothed = await cannySmooth(url);
      times.smooth = performance.now() - t0;

      setStep('sobel');
      const t1 = performance.now();
      const { gradientPhoto, gradientIntensity, gradientDirection, width, height } = await cannySobel(smoothed);
      times.sobel = performance.now() - t1;

      setStep('nonmax');
      const t2 = performance.now();
      const nonmaxed = await cannyNonMax(gradientPhoto, gradientIntensity, gradientDirection, width, height);
      times.nonmax = performance.now() - t2;

      setStep('final');
      const t3 = performance.now();
      const finalUrl = await cannyHysteresis(nonmaxed, low, high);
      times.final = performance.now() - t3;

      // Show result
      imgResult.src = finalUrl;
      downloadLnk.href = finalUrl;
      cardProc.hidden = true;
      cardResult.hidden = false;
      progressBox.hidden = true;

      // Timing breakdown
      const total = Object.values(times).reduce((a, b) => a + b, 0);
      timingRows.innerHTML = STEPS.map(s => {
        const t   = times[s.id] || 0;
        const pct = total > 0 ? Math.min(100, (t / total) * 100) : 0;
        return `
          <div class="timing-item">
            <div class="timing-label-row">
              <span>${s.label}</span>
              <strong>${t.toFixed(1)} ms</strong>
            </div>
            <div class="timing-track">
              <div class="timing-fill" style="width:${pct}%;background:${s.color}"></div>
            </div>
          </div>`;
      }).join('') + `
        <div class="timing-total">
          Total: <strong>${total.toFixed(0)} ms</strong>
        </div>`;
      timingCard.hidden = false;

    } catch (err) {
      urlError.textContent = '⚠ Failed to load or process the image. Check the URL and try again.';
      urlError.hidden = false;
      cardProc.hidden = true;
      progressBox.hidden = true;
      emptyState.hidden = false;
      photosGrid.hidden = true;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Apply Canny';
    }
  });
}
