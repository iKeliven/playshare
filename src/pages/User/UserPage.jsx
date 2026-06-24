// src/pages/User/UserPage.jsx
import User from "./User";
import HomeLayout from "../Home/HomeLayout";
import Player from "../../components/Player/Player";
import { usePlayer } from "../../hooks";
import { msToMinSec } from "../../services/itunes";

export default function UserPage() {
  const { track, isPlaying, current, total, pause, resume, seek, repeat, toggleRepeat, next, prev, seekBy, queue, queueIndex } = usePlayer();

  const canPrev = queueIndex > 0;
  const canNext = queueIndex >= 0 && queueIndex < (queue?.length ?? 0) - 1;

  const progress = total ? current / total : 0;

  const now = track
    ? {
        title: track.title,
        artist: track.artist,
        cover: track.artwork,
        isPlaying,
        current: msToMinSec(current * 1000),
        total: msToMinSec(total * 1000),
        progress,
        canPlay: true,
        onToggle: isPlaying ? pause : resume,
        onSeek: (ratio) => seek(ratio * total),
        repeat,
        onRepeat: toggleRepeat,
        onPrev: canPrev ? prev : null,
        onNext: canNext ? next : null,
        onForward: () => seekBy(10),
      }
    : {
        title: "—",
        artist: "Nenhuma música tocando",
        cover: "",
        isPlaying: false,
        current: "0:00",
        total: "0:00",
        progress: 0,
        canPlay: false,
        onToggle: null,
        onSeek: null,
        repeat: false,
        onRepeat: null,
        onPrev: null,
        onNext: null,
        onForward: null,
      };

  return (
    <HomeLayout right={<Player track={now} />}>
      <User />
    </HomeLayout>
  );
}