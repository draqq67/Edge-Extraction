import './AlbumTemplate.css';

export default function AlbumTemplate({ data, mirror,smooth,nonmax,final, numberOfElements }) {

// console.log(data)
// console.log(mirror)
// console.log(smooth)
// console.log(nonmax)
console.log(final)

  const elements = [];
  for (let i = 0; i < numberOfElements; i++) {
    const initialPhoto = data[i];
    const mirrorPhoto = mirror[i];
    const smoothPhoto = smooth[i];
    const nonMaxPhoto = nonmax[i];
    const finalPhoto = final[i];
    elements.push(
      <div className="photocontainer">
        <div className="initialPhoto">
          {initialPhoto !==null ? (
            <img className="photo" src={initialPhoto} alt={`Initial Photo ${i}`} />
          ) : (
            <div className="loading">Loading...</div>
          )}
        </div>
        <div className="transform">
            <p className='transform_text'>Mirror</p>
            <i class="fa fa-arrow-right"></i>
            </div>
        <div className="mirroredPhoto">
          {mirrorPhoto !==null ? (
            <img className="photo" src={mirrorPhoto} alt={`Mirrored Photo ${i}`} />
          ) : (
            <div className="loading">Loading...</div>
          )}
        </div>
        <div className="transform">
            <p className='transform_text'>Smoothen the photo</p>
            <i class="fa fa-arrow-right"></i>
            </div>
        <div className="smoothPhoto">
          {smoothPhoto!==null ? (
            <img className="photo" src={smoothPhoto} alt={`Mirrored Photo ${i}`} />
          ) : (
            <div className="loading">Loading...</div>
          )}
        </div>
        <div className="transform">
            <p className='transform_text'>Finding gradients & supress non-max pixels</p>
            <i class="fa fa-arrow-right"></i>
            </div>
        <div className="nonmaxPhoto">
          {nonMaxPhoto !==null? (
            <img className="photo" src={nonMaxPhoto} alt={`Mirrored Photo ${i}`} />
          ) : (
            <div className="loading">Loading...</div>
          )}
        </div>
        <div className="transform">
            <p className='transform_text'>Double Threshold & Edge Tracking</p>
            <i class="fa fa-arrow-right"></i>
            </div>
        <div className="finalPhoto">
          {finalPhoto !==null ? (
            <img className="photo" src={finalPhoto} alt={`Mirrored Photo ${i}`} />
          ) : (
            <div className="loading">Loading...</div>
          )}
        </div>
      </div>
    );
  }

  return <>{elements}</>;
}
