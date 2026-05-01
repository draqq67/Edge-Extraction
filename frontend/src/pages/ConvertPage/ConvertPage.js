import React, { useState } from "react";
import smooth from "../../Components/Canny Edge Detector/smooth";
import sobel from "../../Components/Canny Edge Detector/sobel";
import applyNonMaxSuppression from "../../Components/Canny Edge Detector/nonMaxSupression";
import edgeTracking from "../../Components/Canny Edge Detector/edgeTrackingByHysteresis";
import "./ConvertPage.css";

const STEPS = [
  { id: 'smooth', label: 'Grayscale & Gaussian Blur', color: '#667eea', desc: 'Converting to grayscale and reducing noise…' },
  { id: 'sobel',  label: 'Sobel Gradient',            color: '#f59e0b', desc: 'Computing gradient intensity and direction…' },
  { id: 'nonmax', label: 'Non-Max Suppression',        color: '#10b981', desc: 'Thinning edges to single-pixel width…' },
  { id: 'final',  label: 'Hysteresis Thresholding',   color: '#ef4444', desc: 'Applying double threshold and edge tracking…' },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function validateUrl(url) {
  if (!url.trim()) return 'Please enter an image URL.';
  const isHttp  = /^https?:\/\/.+\.(jpg|jpeg|png)(\?.*)?$/i.test(url);
  const isBase64 = /^data:image\/(jpeg|png|jpg);base64,/.test(url);
  if (!isHttp && !isBase64)
    return 'URL must point to a .jpg, .jpeg, or .png file (https), or be a base64 data: URL.';
  return '';
}

export default function ConvertPage() {
  const [imageUrl,     setImageUrl]     = useState('');
  const [urlError,     setUrlError]     = useState('');
  const [initialPhoto, setInitialPhoto] = useState('');
  const [edgePhoto,    setEdgePhoto]    = useState(null);
  const [currentStep,  setCurrentStep]  = useState(null);
  const [lowThreshold,  setLowThreshold]  = useState(100);
  const [highThreshold, setHighThreshold] = useState(140);
  const [timings,      setTimings]      = useState({});
  const [totalTime,    setTotalTime]    = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateUrl(imageUrl);
    if (err) { setUrlError(err); return; }
    if (lowThreshold >= highThreshold) return;
    setUrlError('');
    setEdgePhoto(null);
    setInitialPhoto(imageUrl);
    setTimings({});
    setTotalTime(null);
    setCurrentStep('smooth');

    try {
      const start = performance.now();

      const t0 = performance.now();
      const smoothed = await smooth(imageUrl);
      setTimings(p => ({ ...p, smooth: performance.now() - t0 }));
      setCurrentStep('sobel');
      await delay(800);

      const t1 = performance.now();
      const { gradientPhoto, gradientIntensity, gradientDirection } = await sobel(smoothed);
      setTimings(p => ({ ...p, sobel: performance.now() - t1 }));
      setCurrentStep('nonmax');
      await delay(800);

      const t2 = performance.now();
      const nonMaxPhoto = await applyNonMaxSuppression(gradientPhoto, gradientIntensity, gradientDirection);
      setTimings(p => ({ ...p, nonmax: performance.now() - t2 }));
      setCurrentStep('final');
      await delay(800);

      const t3 = performance.now();
      const finalPhoto = await edgeTracking(nonMaxPhoto, lowThreshold, highThreshold);
      setTimings(p => ({ ...p, final: performance.now() - t3 }));

      setTotalTime(performance.now() - start);
      setEdgePhoto(finalPhoto);
      setCurrentStep(null);
    } catch (error) {
      setUrlError('Failed to load or process the image. Check the URL and try again.');
      setCurrentStep(null);
    }
  };

  const isProcessing = currentStep !== null;
  const stepIndex    = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="convert-page">

      <div className="convert-header">
        <h1>Convert Your Photo</h1>
        <p>
          Paste any image URL, adjust the hysteresis thresholds, and apply the Canny Edge
          Detection algorithm to see the result side-by-side.
        </p>
      </div>

      <div className="convert-body">

        {/* ── Sidebar / controls ── */}
        <aside className="convert-sidebar">
          <form onSubmit={handleSubmit} noValidate>

            <div className="ctrl-section">
              <label htmlFor="imageUrl" className="ctrl-label">Image URL</label>
              <input
                id="imageUrl"
                type="text"
                className={`url-input ${urlError ? 'input-error' : ''}`}
                value={imageUrl}
                onChange={e => { setImageUrl(e.target.value); if (urlError) setUrlError(''); }}
                placeholder="https://example.com/photo.jpg"
                disabled={isProcessing}
              />
              {urlError && (
                <div className="error-msg" role="alert">⚠ {urlError}</div>
              )}
              <small className="ctrl-hint">
                Supports https://…jpg|.jpeg|.png or base64 data: URLs
              </small>
            </div>

            <div className="ctrl-section threshold-box">
              <div className="threshold-title">
                Hysteresis Thresholds
                <span
                  className="info-badge"
                  title="The Canny algorithm uses two thresholds to classify pixels as strong edges, weak edges, or non-edges. Try different values to see their effect."
                >?</span>
              </div>

              <div className="slider-group">
                <div className="slider-row">
                  <label htmlFor="lowT">Low threshold</label>
                  <strong>{lowThreshold}</strong>
                </div>
                <input
                  id="lowT"
                  type="range"
                  min="0" max="254"
                  value={lowThreshold}
                  onChange={e => setLowThreshold(Number(e.target.value))}
                  disabled={isProcessing}
                />
                <small>Pixels below this value are discarded (non-edge).</small>
              </div>

              <div className="slider-group">
                <div className="slider-row">
                  <label htmlFor="highT">High threshold</label>
                  <strong>{highThreshold}</strong>
                </div>
                <input
                  id="highT"
                  type="range"
                  min="1" max="255"
                  value={highThreshold}
                  onChange={e => setHighThreshold(Number(e.target.value))}
                  disabled={isProcessing}
                />
                <small>Pixels above this value become strong edges.</small>
              </div>

              {lowThreshold >= highThreshold && (
                <div className="error-msg" role="alert">
                  ⚠ Low threshold must be less than high threshold.
                </div>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isProcessing || lowThreshold >= highThreshold}
            >
              {isProcessing ? 'Processing…' : 'Apply Canny'}
            </button>
          </form>

          {isProcessing && (
            <div className="progress-box">
              <p className="progress-heading">Pipeline progress</p>
              {STEPS.map((step, i) => {
                const status = i < stepIndex ? 'done' : i === stepIndex ? 'active' : 'pending';
                return (
                  <div key={step.id} className={`prog-row ${status}`}>
                    <span className="prog-dot" style={{ background: status !== 'pending' ? step.color : '#d1d5db' }} />
                    <span className="prog-label">{step.label}</span>
                    {status === 'done'   && <span className="prog-check">✓</span>}
                    {status === 'active' && <span className="prog-spinner" />}
                  </div>
                );
              })}
              <p className="prog-desc">{STEPS[stepIndex]?.desc}</p>
            </div>
          )}
        </aside>

        {/* ── Main result area ── */}
        <main className="convert-main">
          {!initialPhoto && (
            <div className="empty-state">
              <span className="empty-icon">🖼</span>
              <p>Enter an image URL and click <strong>Apply Canny</strong> to see the result here.</p>
            </div>
          )}

          {initialPhoto && (
            <div className="photos-grid">

              <div className="photo-card">
                <div className="photo-card-header">Original</div>
                <div className="photo-wrapper">
                  <img src={initialPhoto} alt="Original" className="result-photo" />
                </div>
              </div>

              {edgePhoto ? (
                <div className="photo-card">
                  <div className="photo-card-header">Edge Detection Result</div>
                  <div className="photo-wrapper">
                    <img src={edgePhoto} alt="Edge Detection Result" className="result-photo" />
                  </div>
                  <a href={edgePhoto} download="edge_result.png" className="download-link">
                    ⬇ Download Result
                  </a>
                </div>
              ) : isProcessing ? (
                <div className="photo-card">
                  <div className="photo-card-header">Processing…</div>
                  <div className="photo-wrapper loader-wrapper">
                    <div className="loader" />
                    <p className="loader-label">{STEPS[stepIndex]?.label}</p>
                  </div>
                </div>
              ) : null}

            </div>
          )}

          {edgePhoto && totalTime != null && (
            <div className="timing-card">
              <h3>Performance Breakdown</h3>
              <div className="timing-rows">
                {STEPS.map(step => (
                  <div key={step.id} className="timing-item">
                    <div className="timing-label-row">
                      <span>{step.label}</span>
                      <strong>{(timings[step.id] || 0).toFixed(1)} ms</strong>
                    </div>
                    <div className="timing-track">
                      <div
                        className="timing-fill"
                        style={{
                          width: `${Math.min(100, ((timings[step.id] || 0) / totalTime) * 100)}%`,
                          background: step.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div className="timing-total">
                  Total: <strong>{totalTime.toFixed(0)} ms</strong>
                  <small> (includes 800 ms delays between steps)</small>
                </div>
              </div>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
