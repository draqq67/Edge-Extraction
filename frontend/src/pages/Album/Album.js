import React, { useState } from "react";
import AlbumTemplate from "./AlbumTemplate/AlbumTemplate";
import "./Album.css";

const BREEDS = [
  { value: 'african',  label: 'African' },
  { value: 'boxer',    label: 'Boxer' },
  { value: 'shiba',    label: 'Shiba Inu' },
  { value: 'kelpie',   label: 'Kelpie' },
  { value: 'labrador', label: 'Labrador' },
  { value: 'akita',    label: 'Akita' },
];

const STAGES = [
  { key: '/api/data',   label: 'Fetch Images',        desc: 'Downloading dog images from the API.' },
  { key: '/api/mirror', label: 'Mirror',               desc: 'Flipping each image horizontally.' },
  { key: '/api/smooth', label: 'Gaussian Blur',        desc: 'Converting to grayscale and applying Gaussian smoothing.' },
  { key: '/api/nonmax', label: 'Non-Max Suppression',  desc: 'Computing Sobel gradients and thinning edges.' },
  { key: '/api/final',  label: 'Hysteresis',           desc: 'Applying double threshold and edge-tracking.' },
];

export default function Album() {
  const [data,          setData]          = useState(null);
  const [mirror,        setMirror]        = useState(null);
  const [smooth,        setSmooth]        = useState(null);
  const [nonMax,        setNonMax]        = useState(null);
  const [final,         setFinal]         = useState(null);
  const [selectedBreed, setSelectedBreed] = useState('african');
  const [isLoading,     setIsLoading]     = useState(false);
  const [currentStage,  setCurrentStage]  = useState(null);
  const [error,         setError]         = useState(null);
  const [fetchTimes,    setFetchTimes]    = useState({});
  const [showInfo,      setShowInfo]      = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    setData(null); setMirror(null); setSmooth(null); setNonMax(null); setFinal(null);

    try {
      const fetchWithDelay = async (url, stateSetter) => {
        setCurrentStage(url);
        const start = performance.now();
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Server error at ${url} (${response.status})`);
        const result = await response.json();
        setFetchTimes(prev => ({ ...prev, [url]: performance.now() - start }));
        stateSetter(result);
        await new Promise(resolve => setTimeout(resolve, 1000));
      };

      await fetchWithDelay('/api/data',   setData);
      await fetchWithDelay('/api/mirror', r => setMirror(r.imageUrls));
      await fetchWithDelay('/api/smooth', r => setSmooth(r.smoothUrls));
      await fetchWithDelay('/api/nonmax', r => setNonMax(r.nonMaxUrls));
      await fetchWithDelay('/api/final',  r => setFinal(r.edgeTrack));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setCurrentStage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/breed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ breed: selectedBreed }),
      });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const currentStageIndex = STAGES.findIndex(s => s.key === currentStage);

  return (
    <div className="album-page">

      {/* ── Header ── */}
      <div className="album-header">
        <div>
          <h1>Dog Breed Album</h1>
          <p>Select a breed and watch 5 images pass through every stage of the Canny algorithm.</p>
        </div>
        <button
          className="info-toggle"
          onClick={() => setShowInfo(!showInfo)}
          aria-expanded={showInfo}
        >
          {showInfo ? 'Hide' : 'Show'} Stage Info
        </button>
      </div>

      {/* ── Educational info panel ── */}
      {showInfo && (
        <div className="info-panel">
          <h3>Pipeline Stages Explained</h3>
          <div className="info-grid">
            {STAGES.slice(1).map(stage => (
              <div key={stage.key} className="info-item">
                <strong>{stage.label}</strong>
                <p>{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Controls ── */}
      <div className="album-controls">
        <form className="breed-form" onSubmit={handleSubmit}>
          <label htmlFor="breed-select">Select Breed:</label>
          <select
            id="breed-select"
            className="breed-select"
            value={selectedBreed}
            onChange={e => setSelectedBreed(e.target.value)}
            disabled={isLoading}
          >
            {BREEDS.map(b => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
          <button type="submit" className="breed-submit" disabled={isLoading}>
            {isLoading ? 'Loading…' : 'Load Images'}
          </button>
        </form>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="album-error" role="alert">
          <span>⚠ {error}</span>
          <button onClick={() => setError(null)} aria-label="Dismiss">✕</button>
        </div>
      )}

      {/* ── Progress ── */}
      {isLoading && (
        <div className="album-progress">
          <div className="stage-pills">
            {STAGES.map((stage, i) => {
              const status = i < currentStageIndex ? 'done' : i === currentStageIndex ? 'active' : 'pending';
              return (
                <div key={stage.key} className={`stage-pill ${status}`}>
                  <span className="pill-dot" />
                  <span>{stage.label}</span>
                  {status === 'done'   && <span className="pill-check">✓</span>}
                  {status === 'active' && <span className="pill-spinner" />}
                </div>
              );
            })}
          </div>
          <p className="stage-desc">{STAGES[currentStageIndex]?.desc}</p>
        </div>
      )}

      {/* ── Results ── */}
      {final !== null && (
        <>
          <AlbumTemplate
            data={data}
            mirror={mirror}
            smooth={smooth}
            nonmax={nonMax}
            final={final}
            numberOfElements={5}
          />
          <div className="timing-bar-section">
            <h3>Processing Times</h3>
            <div className="timing-list">
              {STAGES.map(stage => fetchTimes[stage.key] !== undefined && (
                <div key={stage.key} className="timing-entry">
                  <span>{stage.label}</span>
                  <strong>{fetchTimes[stage.key].toFixed(0)} ms</strong>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Empty state ── */}
      {!isLoading && final === null && !error && (
        <div className="album-empty">
          <span className="empty-icon">🐕</span>
          <p>Select a breed and click <strong>Load Images</strong> to begin.</p>
        </div>
      )}

    </div>
  );
}
