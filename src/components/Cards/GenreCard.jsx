import "./Cards.css";
import play from "/play-circle.svg";

export default function GenreCard({ title, image, onPlay }) {
  return (
    <div className="ps-card genre-card b-neon-soft bg-black-30">
      <img className="genre-card__img" src={image} alt={title} />
      <div className="genre-card__footer gap-8 flex ai-center jc-between ">
        <div>
          <p className="genre-card__title">{title}</p>
        </div>
        <button className="genre-card__play" type="button" onClick={onPlay} aria-label="Play">
          <img src={play} alt="Reproduzir" title="Reproduzir" />
        </button>
      </div>
    </div>
  );
}