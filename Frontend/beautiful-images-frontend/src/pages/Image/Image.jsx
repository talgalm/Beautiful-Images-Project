import './image.css';

export default function Image({ img }) {
  return (
    <div className='single-image-container'>
      <img className='single-image' src={`data:image/jpeg;base64,${img}`} alt=''></img>
    </div>
  );
}
