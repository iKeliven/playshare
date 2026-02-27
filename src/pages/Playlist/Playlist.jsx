import { useMemo, useState, useCallback } from "react";
import "./Playlist.css";
import { useFavorites } from "../../hooks";

export default function Playlist() {
  const initial = useMemo(
    () => [
      {
        id: "p1",
        name: "Dynamite",
        cover: "/mock/dynamite.jpg",
        tracks: [
          { id: 11, title: "Without Me", artist: "Halsey", duration: "4:25" },
          { id: 12, title: "Levitating", artist: "Dua Lipa", duration: "3:23" },
        ],
      },
      {
        id: "p2",
        name: "Chill Vibes",
        cover: "/mock/p2.jpg",
        tracks: [
          { id: 21, title: "Lose You To Love Me", artist: "Selena Gomez", duration: "3:26" },
          { id: 22, title: "7 rings", artist: "Ariana Grande", duration: "2:58" },
        ],
      },
      {
        id: "p3",
        name: "Classics",
        cover: "/mock/p3.jpg",
        tracks: [{ id: 31, title: "Billie Jean", artist: "Michael Jackson", duration: "4:54" }],
      },
    ],
    []
  );

  const [playlists] = useState(initial);
  const [activeId, setActiveId] = useState(initial[0]?.id);

  const { toggleFavorite, isFavorite } = useFavorites();

  const active = playlists.find((p) => p.id === activeId);

  const toggleLike = useCallback(
    (track) => {
      toggleFavorite(track);
    },
    [toggleFavorite]
  );

  return (
    <div className="pl-page flex col gap-24">
      <div className="pl-titleWrap flex col gap-8 top-18">
        <p className="ps-title">Playlists</p>
        <p className="ps-description">Selecione uma playlist e curta as músicas</p>
      </div>

      <div className="pl-grid">
        <section className="pl-list card-glass">
          {playlists.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`pl-item flex gap-12 ai-center full ${p.id === activeId ? "is-active" : ""}`}
              onClick={() => setActiveId(p.id)}
            >
              <img className="pl-cover" src={p.cover} alt={p.name} />
              <div className="pl-info">
                <p className="pl-name">{p.name}</p>
                <p className="pl-meta">{p.tracks.length} músicas</p>
              </div>
            </button>
          ))}
        </section>

        <section className="pl-detail card-glass">
          {active ? (
            <>
              <div className="pl-detailTop">
                <img className="pl-detailCover" src={active.cover} alt={active.name} />
                <div>
                  <p className="pl-detailName">{active.name}</p>
                  <p className="pl-detailMeta">{active.tracks.length} músicas</p>
                </div>
              </div>

              <div className="pl-tracks">
                <div className="pl-track pl-track--head">
                  <span>Título</span>
                  <span>Artista</span>
                  <span className="pl-right">Duração</span>
                  <span className="pl-likeCol" aria-hidden="true">♥</span>
                </div>

                {active.tracks.map((t) => {
                  const liked = isFavorite(t.id);

                  return (
                    <div key={t.id} className="pl-track">
                      <span className="pl-tTitle">{t.title}</span>
                      <span className="pl-tArtist">{t.artist}</span>
                      <span className="pl-right pl-tDur">{t.duration}</span>

                      <button
                        type="button"
                        className={`like-btn ${liked ? "is-liked" : ""}`}
                        onClick={() => toggleLike(t)}
                        aria-label={liked ? "Descurtir música" : "Curtir música"}
                        title={liked ? "Curtida" : "Curtir"}
                      >
                        {liked ? "♥" : "♡"}
                      </button>
                    </div>
                  );
                })}

                {active.tracks.length === 0 && (
                  <div className="pl-empty">Essa playlist está vazia 😅</div>
                )}
              </div>
            </>
          ) : (
            <div className="pl-empty">Selecione uma playlist</div>
          )}
        </section>
      </div>
    </div>
  );
}