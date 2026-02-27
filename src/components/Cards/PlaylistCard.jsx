import "./Cards.css";

export default function PlaylistCard({ image, title, onClick }) {
  return (
    <button className="playlist-card ps-card " type="button" onClick={onClick} aria-label={title}>
      <img className="playlist-card__img" src={image} alt={title} />
    </button>
  );
}