import "./Cards.css";

export default function PlaylistCard({ image, title, onClick }) {
  return (
    <button className="playlist-card ps-card" type="button" onClick={onClick} aria-label={title} title={title}>
      <img className="playlist-card__img" src={image} alt={title} />
      <div className="playlist-card__label">
        <span>{title}</span>
      </div>
    </button>
  );
}