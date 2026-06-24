// src/components/Player/Player.jsx
import { useCallback, useMemo } from "react";
import "./Player.css";
import playbtn from "/play-btn.svg";
import pausebtn from "/pouse-btn.svg";
import next from "/next-btn.svg";
import back from "/back-btn.svg";
import nextview from "/next-vuesax-btn.svg";
import backview from "/back-vuesax-btn.svg";

export default function Player({ track }) {
  const safe = useMemo(
    () =>
      track ?? {
        title: "—",
        artist: "Nenhuma música tocando",
        cover: "",
        isPlaying: false,
        current: "0:00",
        total: "0:00",
      },
    [track]
  );

  const handleToggle = useCallback(() => {
    if (safe.onToggle) safe.onToggle();
  }, [safe.onToggle]);

  const handleSeek = useCallback(
    (e) => {
      if (!safe.onSeek) return;
      const bar = e.currentTarget;
      const rect = bar.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      safe.onSeek(Math.max(0, Math.min(1, ratio)));
    },
    [safe.onSeek]
  );

  const handleRepeat = useCallback(() => {
    if (safe.onRepeat) safe.onRepeat();
  }, [safe.onRepeat]);

  const handlePrev = useCallback(() => {
    if (safe.onPrev) safe.onPrev();
  }, [safe.onPrev]);

  const handleNext = useCallback(() => {
    if (safe.onNext) safe.onNext();
  }, [safe.onNext]);

  const handleForward = useCallback(() => {
    if (safe.onForward) safe.onForward();
  }, [safe.onForward]);

  return (
    <aside className="now-playing card-glass round-bottom-xl gap-16 flex col center">
      <p className="ps-subtitle">{safe.title}</p>
      <p className="ps-description">{safe.artist}</p>

      <div className="now-playing__coverWrap bottom-18">
        {safe.cover ? (
          <img className="now-playing__cover b-neon-soft b-pill" src={safe.cover} alt={safe.title} />
        ) : (
          <div className="now-playing__coverPlaceholder b-pill b-neon-soft"></div>
        )}
      </div>

      <div className="now-playing__controls gap-24 center flex">
        <button
          type="button"
          className="np-btn"
          onClick={handleRepeat}
          disabled={!safe.canPlay || !safe.onRepeat}
          title={safe.repeat ? "Repetir (ativado)" : "Repetir"}
          aria-pressed={!!safe.repeat}
        >
          <img src={backview} alt="repetir" />
        </button>
        <button
          type="button"
          className="np-btn"
          onClick={handlePrev}
          disabled={!safe.canPlay || !safe.onPrev}
          title="Anterior"
        >
          <img src={back} alt="voltar" />
        </button>
        <button
          type="button"
          className="np-btn"
          onClick={handleToggle}
          disabled={!safe.canPlay}
          title={safe.isPlaying ? "Pausar" : "Reproduzir"}
        >
          {safe.isPlaying ? <img src={pausebtn} alt="pause" /> : <img src={playbtn} alt="play" />}
        </button>
        <button
          type="button"
          className="np-btn"
          onClick={handleNext}
          disabled={!safe.canPlay || !safe.onNext}
          title="Próximo"
        >
          <img src={next} alt="próximo" />
        </button>
        <button
          type="button"
          className="np-btn"
          onClick={handleForward}
          disabled={!safe.canPlay || !safe.onForward}
          title="Avançar"
        >
          <img src={nextview} alt="avançar" />
        </button>
      </div>

      <div className="now-playing__progress bottom-18">
        <span>{safe.current}</span>
        <div className="np-bar" onClick={handleSeek} style={{ cursor: safe.canPlay ? "pointer" : "default" }}>
          <div className="np-bar__fill" style={{ width: `${(safe.progress || 0) * 100}%` }} />
        </div>
        <span>{safe.total}</span>
      </div>
    </aside>
  );
}