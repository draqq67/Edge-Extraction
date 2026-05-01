import { Link } from 'react-router-dom';
import './Home.css';

const STEPS = [
  {
    number: '01',
    title: 'Grayscale & Gaussian Blur',
    icon: '🔲',
    description: 'The image is first converted to grayscale — color is irrelevant for edge detection. A Gaussian filter then smooths the image to reduce noise that could create false edges.',
    detail: 'The Gaussian kernel applies a weighted average to each pixel, giving more weight to nearby pixels. This removes high-frequency noise before gradient computation.',
    formula: 'Kernel (3×3, divisor=16):\n[[1, 2, 1],\n [2, 4, 2],\n [1, 2, 1]]',
    color: '#667eea',
  },
  {
    number: '02',
    title: 'Sobel Gradient',
    icon: '↗',
    description: 'Two Sobel kernels compute the image gradient in the horizontal (Gx) and vertical (Gy) directions. The magnitude and direction are calculated for every pixel.',
    detail: 'Gradient magnitude G = √(Gx² + Gy²) tells how sharp the edge is. Direction θ = atan2(Gy, Gx) tells which way the edge runs. Brighter pixels in the output mean stronger edges.',
    formula: 'Kx = [[-1,0,1],[-2,0,2],[-1,0,1]]\nKy = [[1,2,1],[0,0,0],[-1,-2,-1]]\nG = √(Gx² + Gy²)',
    color: '#f59e0b',
  },
  {
    number: '03',
    title: 'Non-Maximum Suppression',
    icon: '✂',
    description: 'Only local maximum pixels along the gradient direction are kept. All others are suppressed, thinning wide edge bands into crisp single-pixel-wide lines.',
    detail: 'For each pixel, its two neighbors in the gradient direction are checked. If it is not a local maximum it is set to zero. This eliminates thick, blurry edges and keeps only the strongest peak.',
    formula: 'If G(x,y) < G(neighbor₁) OR\n   G(x,y) < G(neighbor₂):\n   → suppress pixel (set to 0)',
    color: '#10b981',
  },
  {
    number: '04',
    title: 'Hysteresis Thresholding',
    icon: '🎯',
    description: 'Two thresholds classify pixels as strong edges, weak edges, or non-edges. Weak edges connected to strong edges are kept; isolated weak edges are discarded.',
    detail: 'Intensity > highThreshold → strong edge (always kept). Intensity < lowThreshold → non-edge (always removed). Between the two → weak edge, kept only if it touches a strong edge. This removes noise while preserving real edge continuity.',
    formula: 'I > T_high  →  strong edge ✓\nI < T_low   →  non-edge  ✗\nT_low ≤ I ≤ T_high  →  weak edge\n  (kept if adjacent to strong edge)',
    color: '#ef4444',
  },
];

export default function Home() {
  return (
    <div className="home">

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Canny Edge Detector</h1>
          <p className="hero-subtitle">
            An interactive educational platform for learning the Canny edge detection algorithm —
            one of the most widely used techniques in computer vision and image processing.
          </p>
          <div className="hero-actions">
            <Link to="/convert" className="btn-primary">Try It Now</Link>
            <Link to="/album" className="btn-secondary">View Album</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="pipeline-preview">
            {['Original', 'Grayscale', 'Gradient', 'Edges'].map((label, i) => (
              <div key={i} className="pipeline-step">
                <div className="step-box" style={{ opacity: 0.3 + i * 0.18 }}>
                  <span>{label}</span>
                </div>
                {i < 3 && <div className="pipeline-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="algorithm-section">
        <div className="section-inner">
          <h2 className="section-title">How the Algorithm Works</h2>
          <p className="section-desc">
            Canny produces thinner, cleaner, and more robust edges compared to simpler filters like Sobel alone.
            It combines four sequential steps into a complete pipeline. Expand each card to see the math.
          </p>
          <div className="steps-grid">
            {STEPS.map((step) => (
              <div className="step-card" key={step.number}>
                <div className="step-header" style={{ borderLeftColor: step.color }}>
                  <span className="step-number" style={{ color: step.color }}>{step.number}</span>
                  <span className="step-icon">{step.icon}</span>
                  <h3 className="step-title">{step.title}</h3>
                </div>
                <p className="step-desc">{step.description}</p>
                <details className="step-details">
                  <summary>Learn more</summary>
                  <div className="step-detail-content">
                    <p>{step.detail}</p>
                    <code className="step-formula">{step.formula}</code>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="guide-section">
        <div className="section-inner">
          <h2 className="section-title">Get Started</h2>
          <p className="section-desc">
            Two pages let you explore the algorithm interactively.
          </p>
          <div className="guide-cards">
            <div className="guide-card">
              <div className="guide-icon" style={{ background: '#eef2ff', color: '#667eea' }}>📷</div>
              <h3>Convert Page</h3>
              <p>
                Paste any image URL and watch the Canny algorithm process it step-by-step.
                Adjust the low and high thresholds in real time and see how they change the output.
              </p>
              <Link to="/convert" className="guide-link">Go to Convert →</Link>
            </div>
            <div className="guide-card">
              <div className="guide-icon" style={{ background: '#d1fae5', color: '#10b981' }}>🐕</div>
              <h3>Album Page</h3>
              <p>
                Select a dog breed and see 5 images processed simultaneously through each stage
                of the algorithm — perfect for visual side-by-side comparison.
              </p>
              <Link to="/album" className="guide-link">Go to Album →</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
