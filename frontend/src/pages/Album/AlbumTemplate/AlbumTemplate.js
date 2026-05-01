import './AlbumTemplate.css';

const STAGES = [
  { key: 'initial', label: 'Original',    color: '#6b7280' },
  { key: 'mirror',  label: 'Mirror',      color: '#8b5cf6' },
  { key: 'smooth',  label: 'Smooth',      color: '#667eea' },
  { key: 'nonmax',  label: 'Non-Max',     color: '#10b981' },
  { key: 'final',   label: 'Final',       color: '#ef4444' },
];

export default function AlbumTemplate({ data, mirror, smooth, nonmax, final, numberOfElements }) {
  const rows = [];
  for (let i = 0; i < numberOfElements; i++) {
    const photos = [data?.[i], mirror?.[i], smooth?.[i], nonmax?.[i], final?.[i]];
    rows.push(
      <div className="dog-row" key={i}>
        <div className="dog-index">#{i + 1}</div>
        <div className="pipeline-row">
          {STAGES.map((stage, j) => (
            <div className="stage-cell" key={stage.key}>
              <span className="stage-label" style={{ color: stage.color }}>{stage.label}</span>
              <div className={`stage-photo${stage.key === 'final' ? ' stage-final' : ''}`}>
                {photos[j] ? (
                  <img
                    src={photos[j]}
                    alt={`${stage.label} ${i + 1}`}
                    className="stage-img"
                  />
                ) : (
                  <div className="stage-loading">
                    <div className="mini-spinner" style={{ borderTopColor: stage.color }} />
                  </div>
                )}
              </div>
              {j < STAGES.length - 1 && <span className="stage-arrow">›</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return <div className="album-template">{rows}</div>;
}
