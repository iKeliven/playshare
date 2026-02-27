import "./Cards.css";

export default function ArtistCard({ name, image, onClick }) {
  return (
    <button className=" artist-card" type="button" onClick={onClick}>
      <img className="artist-card__avatar ps-card " src={image} alt={name} />
      <p className="artist-card__name">{name}</p>
    </button>
  );
}