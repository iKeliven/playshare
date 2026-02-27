import "./TitleArea.css";
import left from '/arrow-left.svg'
import right from '/arrow-right.svg'

export default function TitleArea({ title, railRef }) {
  const scrollBy = (dir) => {
    const el = railRef?.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.85);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="title-area">
      <p className="ps-title ">{title}</p>

      <div className="title-area__actions gap-8 flex">
        <button
          type="button"
          className="title-area__btn b-pill"
          onClick={() => scrollBy(-1)}
          aria-label="Voltar"
        >
          <img src={left} alt="esquerda" title="Voltar"/>
        </button>
        <button
          type="button"
          className="title-area__btn gap-8 b-pill"
          onClick={() => scrollBy(1)}
          aria-label="Avançar"
        >
          <img src={right} alt="direita" title="Avançarr"/>
        </button>
      </div>
    </div>
  );
}