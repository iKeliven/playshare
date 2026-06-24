// src/pages/Favorites/Favorites.jsx
import { useMemo, useState, useCallback } from "react";
import "./Favorites.css";
import search from "/search.svg";
import { useFavorites, usePlayer } from "../../hooks";
import play from "/play-circle.svg";
import pausar from "/pouse-btn.svg";
import playBtn from "/play-btn.svg"

export default function Favorites() {
  const [q, setQ] = useState("");
  const { setQueueAndPlay, track: currentTrack, isPlaying, pause, resume } = usePlayer();
  const { getFavorites, toggleFavorite } = useFavorites();

  const favorites = useMemo(() => getFavorites(), [getFavorites]);

  const filtered = useMemo(() => {
    return favorites.filter((t) => {
      const hay = `${t.title ?? ""} ${t.artist ?? ""} ${t.album ?? ""}`.toLowerCase();
      return hay.includes((q ?? "").toLowerCase());
    });
  }, [favorites, q]);

  const handleToggleFavorite = useCallback(
    (track) => {
      toggleFavorite(track);
    },
    [toggleFavorite]
  );

  const handleSearchChange = useCallback((e) => {
    setQ(e.target.value);
  }, []);

  const handlePlay = useCallback(
    (t, index, list) => {
      if (!t?.previewUrl) return;
      const isSame = currentTrack?.id != null && t?.id != null && String(currentTrack.id) === String(t.id);
      if (isSame) {
        if (isPlaying) pause();
        else resume();
        return;
      }
      setQueueAndPlay(list, index);
    },
    [currentTrack, isPlaying, pause, resume, setQueueAndPlay]
  );

  return (
    <div className="fav-page flex col gap-24 full">
      <div className="fav-header flex jc-between full top-18">
        <div>
          <p className="ps-title">Favoritos</p>
          <p className="ps-description">Suas músicas curtidas ❤️</p>
        </div>

        <div className="ps-search b-pill flex ai-center card-glass">
          <span className="ps-search__icon" aria-hidden="true">
            <img src={search} alt="Buscar" />
          </span>
          <input
            className="ps-search__input"
            type="text"
            placeholder="Pesquisar"
            value={q}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="fav-table card-glass">
        <div className="fav-row fav-row--head">
          <span>#</span>
          <span>Título</span>
          <span className="hide-sm">Álbum</span>
          <span className="hide-sm">Duração</span>
          <span>Remover</span>
        </div>

        {filtered.map((t, idx) => (
          <div key={t.id} className="fav-row">
            <span>{idx + 1}</span>

            <div className="fav-main">
              <div className="fav-mainRow">
                <button
                  type="button"
                  className="fav-playBtn"
                  onClick={() => handlePlay(t, idx, filtered)}
                  disabled={!t.previewUrl}
                  title={
                    currentTrack?.id != null && t?.id != null && String(currentTrack.id) === String(t.id)
                      ? isPlaying
                        ? "Pausar"
                        : "Retomar"
                      : "Reproduzir"
                  }
                >
                  {currentTrack?.id != null && t?.id != null && String(currentTrack.id) === String(t.id) ? (
                    isPlaying ? (
                      <img className="fav-playIcon is-control" src={pausar} alt="Pausar" />
                    ) : (
                      <img className="fav-playIcon is-control" src={playBtn} alt="Retomar" />
                    )
                  ) : (
                    <img className="fav-playIcon" src={play} alt="Reproduzir" />
                  )}
                </button>

                <div className="fav-meta">
                  <p className="fav-track">{t.title}</p>
                  <p className="fav-artist">{t.artist}</p>
                </div>
              </div>
            </div>

            <span className="hide-sm fav-album">{t.album ?? "-"}</span>
            <span className="hide-sm fav-duration">{t.duration ?? "--:--"}</span>

            <button
              className="remove-btn"
              onClick={() => handleToggleFavorite(t)}
              title="Remover dos favoritos"
            >
              ♥
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="fav-empty">
            {favorites.length === 0
              ? "Nenhuma música curtida ainda 😢"
              : "Nenhuma música encontrada 😢"}
          </div>
        )}
      </div>
    </div>
  );
}