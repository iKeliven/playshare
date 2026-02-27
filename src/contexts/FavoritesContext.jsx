import { createContext, useCallback, useEffect, useMemo, useState } from "react";

const FavoritesContext = createContext();

const FAV_IDS_KEY = "playshare_favorites_ids";
const FAV_CACHE_KEY = "playshare_favorites_cache";

function loadFavIds() {
  try {
    const raw = localStorage.getItem(FAV_IDS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set((Array.isArray(arr) ? arr : []).map((id) => String(id)));
  } catch {
    return new Set();
  }
}

function saveFavIds(set) {
  try {
    localStorage.setItem(FAV_IDS_KEY, JSON.stringify(Array.from(set)));
  } catch {
    void 0;
  }
}

function loadCache() {
  try {
    const raw = localStorage.getItem(FAV_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCache(obj) {
  try {
    localStorage.setItem(FAV_CACHE_KEY, JSON.stringify(obj));
  } catch {
    void 0;
  }
}

export function FavoritesProvider({ children }) {
  const [favIds, setFavIds] = useState(() => loadFavIds());
  const [cache, setCache] = useState(() => loadCache());

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== FAV_IDS_KEY && e.key !== FAV_CACHE_KEY) return;
      setFavIds(loadFavIds());
      setCache(loadCache());
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleFavorite = useCallback(
    (track) => {
      const id = String(track?.id ?? "");
      if (!id) return;

      setFavIds((prev) => {
        const next = new Set(prev);
        const isLiked = next.has(id);

        if (isLiked) {
          next.delete(id);
          setCache((c) => {
            const newCache = { ...c };
            delete newCache[id];
            saveCache(newCache);
            return newCache;
          });
        } else {
          next.add(id);
          setCache((c) => {
            const newCache = { ...c, [id]: { ...track, id } };
            saveCache(newCache);
            return newCache;
          });
        }

        saveFavIds(next);
        return next;
      });
    },
    [setFavIds, setCache]
  );

  const isFavorite = useCallback(
    (trackId) => {
      const id = String(trackId ?? "");
      return favIds.has(id);
    },
    [favIds]
  );

  const getFavorites = useCallback(() => {
    return Array.from(favIds)
      .map((id) => cache[id])
      .filter(Boolean);
  }, [favIds, cache]);

  const value = useMemo(
    () => ({ favIds, toggleFavorite, isFavorite, getFavorites }),
    [favIds, toggleFavorite, isFavorite, getFavorites]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesContext;
