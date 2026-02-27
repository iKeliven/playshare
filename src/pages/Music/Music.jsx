// src/pages/Music/Music.jsx
import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "./Music.css";
import search from "/search.svg";
import { searchSongs } from "../../services/itunes";
import { useFavorites, usePlayer } from "../../hooks";

const DEBOUNCE_MS = 400;

export default function Music() {
  const [params, setParams] = useSearchParams();
  const { setQueueAndPlay, track: currentTrack, isPlaying, pause, resume, current, total, seek } = usePlayer();
  const { toggleFavorite, isFavorite } = useFavorites();

  // State
  const [qDraft, setQDraft] = useState(() => params.get("q") || "");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const term = (params.get("q") || "").trim();
  const lastUrlQRef = useRef(params.get("q") || "");

  // Mantém o input em sync quando a URL muda (ex: link direto, back/forward)
  useEffect(() => {
    const urlQ = params.get("q") || "";
    if (urlQ !== lastUrlQRef.current) {
      lastUrlQRef.current = urlQ;
      setQDraft(urlQ);
    }
  }, [params]);

  // Busca só quando o termo "confirmado" (URL) muda
  useEffect(() => {
    if (!term) {
      setTracks([]);
      setError("");
      setLoading(false);
      return;
    }

    setError("");
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const results = await searchSongs(term, { limit: 30, country: "BR" });
        if (!alive) return;
        setTracks(results);
      } catch (err) {
        console.error("Erro na busca:", err);
        if (!alive) return;
        setError("Erro ao buscar músicas. Tente novamente.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [term]);

  const handleToggleFavorite = useCallback(
    (track) => {
      toggleFavorite(track);
    },
    [toggleFavorite]
  );

  const handleSearchChange = useCallback((e) => {
    setQDraft(e.target.value);
  }, []);

  const handleSubmitSearch = useCallback(() => {
    const nextQ = qDraft.trim();
    const currentQ = (params.get("q") || "").trim();
    if (nextQ === currentQ) return;
    if (nextQ) setParams({ q: nextQ }, { replace: true });
    else setParams({}, { replace: true });
  }, [params, qDraft, setParams]);

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

  const formatTime = useCallback((seconds) => {
    const s = Number(seconds);
    if (!Number.isFinite(s) || s <= 0) return "0:00";
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${String(r).padStart(2, "0")}`;
  }, []);

  const handleSeek = useCallback(
    (e) => {
      if (!total) return;
      const bar = e.currentTarget;
      const rect = bar.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      const next = Math.max(0, Math.min(1, ratio)) * total;
      seek(next);
    },
    [seek, total]
  );

  return (
    <div className="music-page flex col gap-24">
      <div className="music-header flex jc-between gap-16 top-18">
        <div className="flex col gap-8">
          <p className="ps-title">Músicas</p>
          <p className="ps-description">Pesquise no iTunes e ouça prévias 🎧</p>
        </div>

        <div className="ps-search b-pill flex ai-center card-glass">
          <button
            type="button"
            className="ps-search__icon"
            onClick={handleSubmitSearch}
            title="Buscar"
          >
            <img src={search} alt="Buscar" />
          </button>
          <input
            className="ps-search__input"
            type="text"
            placeholder="Pesquisar (ex: dua lipa, billie jean...)"
            value={qDraft}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmitSearch();
              }
            }}
          />
        </div>
      </div>

      <div className="music-table card-glass">
        <div className="music-row music-row--head">
          <span>#</span>
          <span>Título</span>
          <span className="hide-sm">Álbum</span>
          <span className="hide-sm">Duração</span>
          <span className="music-likeCol" aria-hidden="true">♥</span>
        </div>

        {loading && (
          <div className="music-empty">Carregando músicas... ⏳</div>
        )}

        {!loading && error && (
          <div className="music-empty">
            Deu erro 😢 {error}
          </div>
        )}

        {!loading && !error && tracks.map((t, idx) => {
          const active =
            currentTrack?.id != null && t?.id != null && String(currentTrack.id) === String(t.id);
          const progress = active && total ? Math.max(0, Math.min(1, current / total)) : 0;
          const fillColor = `hsl(${210 + Math.round(progress * 90)}, 90%, 60%)`;

          return (
          <div key={t.id} className={`music-row ${active ? "is-active" : ""}`}>
            <span className="music-idx">{idx + 1}</span>

            <div className="music-main">
              <div className="music-mainRow">
                <button
                  type="button"
                  className="music-playBtn"
                  onClick={() => handlePlay(t, idx, tracks)}
                  disabled={!t.previewUrl}
                  title={active ? (isPlaying ? "Pausar" : "Retomar") : "Reproduzir"}
                >
                  {active ? (
                    isPlaying ? (
                      <img className="music-playIcon is-control" src="/pouse-btn.svg" alt="Pausar" />
                    ) : (
                      <img className="music-playIcon is-control" src="/play-btn.svg" alt="Retomar" />
                    )
                  ) : (
                    <img className="music-playIcon" src="/play-circle.svg" alt="Reproduzir" />
                  )}
                </button>

                <div className="music-meta">
                  <p className="music-track">{t.title}</p>
                  <p className="music-artist">{t.artist}</p>
                </div>
              </div>

              {active && (
                <div className="music-progress">
                  <span>{formatTime(current)}</span>
                  <div className="music-bar" onClick={handleSeek} style={{ cursor: total ? "pointer" : "default" }}>
                    <div className="music-bar__fill" style={{ width: `${progress * 100}%`, background: fillColor }} />
                  </div>
                  <span>{formatTime(total)}</span>
                </div>
              )}
            </div>

            <span className="hide-sm music-album">{t.album}</span>
            <span className="hide-sm music-duration">{t.duration}</span>

            <button
              type="button"
              className={`like-btn ${isFavorite(t.id) ? "is-liked" : ""}`}
              onClick={() => handleToggleFavorite(t)}
              aria-label={isFavorite(t.id) ? "Descurtir música" : "Curtir música"}
              title={isFavorite(t.id) ? "Curtida" : "Curtir"}
            >
              {isFavorite(t.id) ? "♥" : "♡"}
            </button>
          </div>
          );
        })}

        {!loading && !error && term && tracks.length === 0 && (
          <div className="music-empty">Nenhuma música encontrada 😢</div>
        )}

        {!loading && !error && !term && (
          <div className="music-empty">
            Digite algo na busca pra carregar músicas 🎶
          </div>
        )}
      </div>
    </div>
  );
}
