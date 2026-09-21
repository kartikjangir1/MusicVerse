import { useEffect, useState } from "react";
import YouTube from "react-youtube";

import {
  Heart,
  Plus,
  X,
  ListMusic,
  Trash2,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Volume2,
  Shuffle,
  Repeat,
  Repeat1,
  Moon,
  Timer,
} from "lucide-react";

import { usePlayer } from "../context/PlayerContext";

function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    nextSong,
    previousSong,

    isShuffle,
    repeatMode,
    toggleShuffle,
    toggleRepeat,

    toggleLike,
    isSongLiked,

    playlists,
    addSongToPlaylist,

    queue,
    currentIndex,
    playQueueSong,
    removeFromQueue,
    clearQueue,
  } = usePlayer();

  const [player, setPlayer] = useState(null);

  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [showPlaylistPopup, setShowPlaylistPopup] =
    useState(false);

  const [showQueue, setShowQueue] = useState(false);

  const [showSleepTimer, setShowSleepTimer] =
    useState(false);

  const [sleepTimerSeconds, setSleepTimerSeconds] =
    useState(null);

  const [sleepTimerMode, setSleepTimerMode] =
    useState(null);

  const [showMobileFullPlayer, setShowMobileFullPlayer] =
    useState(false);

  const opts = {
    height: "0",
    width: "0",

    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  // =========================
  // YOUTUBE READY
  // =========================

  const handleReady = (event) => {
    setPlayer(event.target);

    event.target.setVolume(volume);
    event.target.playVideo();

    setDuration(event.target.getDuration());
  };

  // =========================
  // SONG CHANGE
  // =========================

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [currentSong]);

  // =========================
  // PROGRESS
  // =========================

  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      try {
        setCurrentTime(
          player.getCurrentTime()
        );

        setDuration(
          player.getDuration()
        );
      } catch {
        // Player not ready
      }
    }, 500);

    return () => clearInterval(interval);
  }, [player]);

  // =========================
  // SLEEP TIMER
  // =========================

  useEffect(() => {
    if (sleepTimerSeconds === null) {
      return;
    }

    if (sleepTimerSeconds <= 0) {
      if (player) {
        player.pauseVideo();
      }

      setSleepTimerSeconds(null);
      setSleepTimerMode(null);

      return;
    }

    const interval = setInterval(() => {
      setSleepTimerSeconds((prev) => {
        if (prev === null || prev <= 1) {
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerSeconds, player]);

  // =========================
  // SONG END
  // =========================

  const handleSongEnd = () => {
    if (!player) return;

    if (sleepTimerMode === "end-of-song") {
      player.pauseVideo();

      setSleepTimerSeconds(null);
      setSleepTimerMode(null);

      return;
    }

    if (repeatMode === "one") {
      player.seekTo(0, true);
      player.playVideo();

      return;
    }

    nextSong();
  };

  // =========================
  // PLAY / PAUSE
  // =========================

  const handlePlayPause = () => {
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }

    togglePlay();
  };

  // =========================
  // VOLUME
  // =========================

  const handleVolume = (e) => {
    const value = Number(e.target.value);

    setVolume(value);

    if (player) {
      player.setVolume(value);
    }
  };

  // =========================
  // SEEK
  // =========================

  const handleSeek = (e) => {
    const value = Number(e.target.value);

    setCurrentTime(value);

    if (player) {
      player.seekTo(value, true);
    }
  };

  // =========================
  // ADD TO PLAYLIST
  // =========================

  const handleAddToPlaylist = (playlistId) => {
    if (!currentSong) return;

    addSongToPlaylist(
      playlistId,
      currentSong
    );

    setShowPlaylistPopup(false);
  };

  // =========================
  // PLAY QUEUE SONG
  // =========================

  const handlePlayQueueSong = (index) => {
    if (
      index < 0 ||
      index >= queue.length
    ) {
      return;
    }

    playQueueSong(index);
  };

  // =========================
  // SLEEP TIMER
  // =========================

  const startSleepTimer = (minutes) => {
    setSleepTimerSeconds(
      minutes * 60
    );

    setSleepTimerMode(
      "countdown"
    );

    setShowSleepTimer(false);
  };

  const startEndOfSongTimer = () => {
    setSleepTimerSeconds(null);

    setSleepTimerMode(
      "end-of-song"
    );

    setShowSleepTimer(false);
  };

  const cancelSleepTimer = () => {
    setSleepTimerSeconds(null);

    setSleepTimerMode(null);

    setShowSleepTimer(false);
  };

  // =========================
  // FORMAT TIME
  // =========================

  const formatTime = (time) => {
    if (
      !time ||
      Number.isNaN(time)
    ) {
      return "0:00";
    }

    const minutes =
      Math.floor(time / 60);

    const seconds =
      Math.floor(time % 60);

    return `${minutes}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  // =========================
  // FORMAT TIMER
  // =========================

  const formatTimer = (seconds) => {
    if (
      seconds === null ||
      seconds < 0
    ) {
      return "";
    }

    const minutes =
      Math.floor(seconds / 60);

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // =========================
  // NO CURRENT SONG
  // =========================

  if (!currentSong) {
    return (
      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          md:left-64
          h-16
          md:h-24
          bg-[#181818]
          border-t
          border-gray-700
          flex
          items-center
          justify-center
          text-gray-400
          text-sm
          px-4
          text-center
          z-[100]
        "
      >
        Select a song to start playing
      </div>
    );
  }

  const liked =
    isSongLiked(currentSong.id);

  const timerActive =
    sleepTimerSeconds !== null ||
    sleepTimerMode ===
      "end-of-song";

  return (
    <>
      {/* ================================================= */}
      {/* HIDDEN YOUTUBE PLAYER */}
      {/* ================================================= */}

      <YouTube
        videoId={currentSong.id}
        opts={opts}
        onReady={handleReady}
        onEnd={handleSongEnd}
      />

      {/* ================================================= */}
      {/* DESKTOP + MOBILE MINI PLAYER */}
      {/* ================================================= */}

      <div
        onClick={() => {
          /*
            On mobile, the complete mini player
            is clickable and opens full player.
          */

          if (
            window.innerWidth < 768
          ) {
            setShowMobileFullPlayer(
              true
            );
          }
        }}
        className="
          fixed
          bottom-0
          left-0
          right-0
          md:left-64
          h-16
          md:h-24
          bg-[#181818]
          border-t
          border-gray-700
          z-[100]
          px-2
          sm:px-4
          md:px-6
          cursor-pointer
        "
      >
        <div className="h-full flex items-center">

          {/* ================================================= */}
          {/* SONG INFO */}
          {/* ================================================= */}

          <div
            className="
              flex
              items-center
              gap-2
              md:gap-4
              w-[45%]
              sm:w-[40%]
              md:w-1/4
              min-w-0
            "
          >
            <img
              src={currentSong.image}
              alt={currentSong.title}
              className="
                w-10
                h-10
                sm:w-11
                sm:h-11
                md:w-14
                md:h-14
                rounded
                object-cover
                flex-shrink-0
              "
            />

            <div className="min-w-0 flex-1">

              <h4
                className="
                  font-semibold
                  text-xs
                  sm:text-sm
                  md:text-base
                  truncate
                "
              >
                {currentSong.title}
              </h4>

              <p
                className="
                  text-gray-400
                  text-[11px]
                  sm:text-xs
                  md:text-sm
                  truncate
                "
              >
                {currentSong.artist}
              </p>

            </div>

            {/* ================================================= */}
            {/* LIKE + PLAYLIST + FULLSCREEN                     */}
            {/* HIDDEN ON MOBILE                                 */}
            {/* ================================================= */}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();

                toggleLike(
                  currentSong
                );
              }}
              className={`
                hidden
                md:block
                flex-shrink-0
                transition
                ${
                  liked
                    ? "text-green-500"
                    : "text-gray-400 hover:text-white"
                }
              `}
              title="Like"
            >
              <Heart
                size={20}
                fill={
                  liked
                    ? "currentColor"
                    : "none"
                }
              />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();

                setShowPlaylistPopup(
                  true
                );
              }}
              className="
                hidden
                md:block
                flex-shrink-0
                text-gray-400
                hover:text-white
                transition
              "
              title="Add to Playlist"
            >
              <Plus size={21} />
            </button>
          </div>

          {/* ================================================= */}
          {/* CENTER CONTROLS */}
          {/* ================================================= */}

          <div
            className="
              flex-1
              md:w-1/2
              flex
              flex-col
              items-center
              min-w-0
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                sm:gap-3
                md:gap-5
              "
            >

              {/* SHUFFLE */}

              <button
                type="button"
                onClick={() => {
                  toggleShuffle();
                }}
                className={`
                  hidden
                  sm:block
                  transition
                  ${
                    isShuffle
                      ? "text-green-500"
                      : "text-gray-400 hover:text-white"
                  }
                `}
                title="Shuffle"
              >
                <Shuffle size={17} />
              </button>

              {/* PREVIOUS */}

              <button
                type="button"
                onClick={() => {
                  previousSong();
                }}
                className="
                  text-gray-300
                  hover:text-white
                  transition
                "
                title="Previous"
              >
                <SkipBack
                  size={18}
                  className="
                    sm:w-[19px]
                    sm:h-[19px]
                    md:w-5
                    md:h-5
                  "
                />
              </button>

              {/* PLAY */}

              <button
                type="button"
                onClick={() => {
                  handlePlayPause();
                }}
                className="
                  bg-white
                  text-black
                  rounded-full
                  p-2
                  hover:scale-105
                  transition
                  flex-shrink-0
                "
                title="Play/Pause"
              >
                {isPlaying ? (
                  <Pause
                    size={17}
                    fill="black"
                    className="
                      sm:w-[19px]
                      sm:h-[19px]
                      md:w-5
                      md:h-5
                    "
                  />
                ) : (
                  <Play
                    size={17}
                    fill="black"
                    className="
                      sm:w-[19px]
                      sm:h-[19px]
                      md:w-5
                      md:h-5
                    "
                  />
                )}
              </button>

              {/* NEXT */}

              <button
                type="button"
                onClick={() => {
                  nextSong();
                }}
                className="
                  text-gray-300
                  hover:text-white
                  transition
                "
                title="Next"
              >
                <SkipForward
                  size={18}
                  className="
                    sm:w-[19px]
                    sm:h-[19px]
                    md:w-5
                    md:h-5
                  "
                />
              </button>

              {/* REPEAT */}

              <button
                type="button"
                onClick={() => {
                  toggleRepeat();
                }}
                className={`
                  hidden
                  sm:block
                  transition
                  ${
                    repeatMode !==
                    "off"
                      ? "text-green-500"
                      : "text-gray-400 hover:text-white"
                  }
                `}
                title="Repeat"
              >
                {repeatMode ===
                "one" ? (
                  <Repeat1 size={17} />
                ) : (
                  <Repeat size={17} />
                )}
              </button>

              {/* QUEUE */}
              {/* Desktop only */}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();

                  setShowQueue(
                    (prev) =>
                      !prev
                  );
                }}
                className={`
                  hidden
                  md:block
                  transition
                  ${
                    showQueue
                      ? "text-green-500"
                      : "text-gray-400 hover:text-white"
                  }
                `}
                title="Queue"
              >
                <ListMusic size={18} />
              </button>

              {/* SLEEP TIMER */}
              {/* Desktop only */}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();

                  setShowSleepTimer(
                    (prev) =>
                      !prev
                  );
                }}
                className={`
                  hidden
                  md:block
                  relative
                  transition
                  ${
                    timerActive
                      ? "text-green-500"
                      : "text-gray-400 hover:text-white"
                  }
                `}
                title="Sleep Timer"
              >
                <Moon size={18} />

                {timerActive && (
                  <span
                    className="
                      absolute
                      -top-1
                      -right-1
                      w-2
                      h-2
                      bg-green-500
                      rounded-full
                    "
                  />
                )}
              </button>
            </div>

            {/* ================================================= */}
            {/* DESKTOP PROGRESS */}
            {/* ================================================= */}

            <div
              className="
                hidden
                md:flex
                w-full
                max-w-xl
                items-center
                gap-3
                mt-2
              "
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <span
                className="
                  text-xs
                  text-gray-400
                  w-10
                  text-right
                "
              >
                {formatTime(
                  currentTime
                )}
              </span>

              <input
                type="range"
                min="0"
                max={duration || 0}
                value={Math.min(
                  currentTime,
                  duration || 0
                )}
                onChange={
                  handleSeek
                }
                className="
                  flex-1
                  accent-white
                  cursor-pointer
                "
              />

              <span
                className="
                  text-xs
                  text-gray-400
                  w-10
                "
              >
                {formatTime(
                  duration
                )}
              </span>
            </div>
          </div>

          {/* ================================================= */}
          {/* DESKTOP VOLUME */}
          {/* ================================================= */}

          <div
            className="
              hidden
              md:flex
              w-1/4
              justify-end
              items-center
              gap-3
            "
          >
            {sleepTimerSeconds !==
              null && (
              <span
                className="
                  text-xs
                  text-green-500
                  font-mono
                "
              >
                {formatTimer(
                  sleepTimerSeconds
                )}
              </span>
            )}

            {sleepTimerMode ===
              "end-of-song" && (
              <span
                className="
                  text-xs
                  text-green-500
                "
              >
                End
              </span>
            )}

            <Volume2 size={20} />

            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={
                handleVolume
              }
              onClick={(e) =>
                e.stopPropagation()
              }
              className="
                w-24
                accent-white
                cursor-pointer
              "
            />
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* MOBILE PROGRESS */}
      {/* ================================================= */}

      <div
        className="
          md:hidden
          fixed
          bottom-[63px]
          left-0
          right-0
          h-[2px]
          bg-[#333]
          z-[101]
        "
      >
        <div
          className="
            h-full
            bg-green-500
          "
          style={{
            width:
              duration > 0
                ? `${Math.min(
                    100,
                    Math.max(
                      0,
                      (currentTime /
                        duration) *
                        100
                    )
                  )}%`
                : "0%",
          }}
        />
      </div>

      {/* ================================================= */}
      {/* MOBILE FULL PLAYER */}
      {/* ================================================= */}

      {showMobileFullPlayer && (
        <div
          className="
            md:hidden
            fixed
            inset-0
            z-[20000]
            bg-[#101010]
            text-white
            overflow-y-auto
          "
        >
          {/* BACKGROUND IMAGE */}

          <div
            className="
              absolute
              inset-0
              opacity-20
              bg-cover
              bg-center
              blur-3xl
              scale-110
            "
            style={{
              backgroundImage: `url(${currentSong.image})`,
            }}
          />

          <div
            className="
              absolute
              inset-0
              bg-[#101010]/90
            "
          />

          {/* CONTENT */}

          <div
            className="
              relative
              z-10
              min-h-screen
              flex
              flex-col
              px-5
            "
          >
            {/* HEADER */}

            <div
              className="
                h-16
                flex
                items-center
                justify-between
                flex-shrink-0
              "
            >
              <div>
                <p
                  className="
                    text-[10px]
                    tracking-[0.2em]
                    text-gray-500
                  "
                >
                  NOW PLAYING
                </p>

                <p
                  className="
                    text-sm
                    text-gray-300
                    mt-1
                  "
                >
                  MusicVerse
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowMobileFullPlayer(
                    false
                  )
                }
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-white/10
                  flex
                  items-center
                  justify-center
                  hover:bg-white/20
                "
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* ARTWORK */}

            <div
              className="
                flex
                justify-center
                mt-5
              "
            >
              <img
                src={currentSong.image}
                alt={currentSong.title}
                className="
                  w-full
                  max-w-[380px]
                  aspect-square
                  object-cover
                  rounded-2xl
                  shadow-2xl
                "
              />
            </div>

            {/* SONG INFO */}

            <div className="mt-7">
              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >
                <div
                  className="
                    flex-1
                    min-w-0
                  "
                >
                  <h1
                    className="
                      text-2xl
                      font-bold
                      truncate
                    "
                  >
                    {currentSong.title}
                  </h1>

                  <p
                    className="
                      text-gray-400
                      mt-1
                      truncate
                    "
                  >
                    {currentSong.artist}
                  </p>
                </div>

                {/* LIKE - FULL PLAYER ONLY */}

                <button
                  type="button"
                  onClick={() =>
                    toggleLike(
                      currentSong
                    )
                  }
                  className={`
                    flex-shrink-0
                    ${
                      liked
                        ? "text-green-500"
                        : "text-gray-400"
                    }
                  `}
                  title="Like"
                >
                  <Heart
                    size={25}
                    fill={
                      liked
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </div>

              {/* ================================================= */}
              {/* FULL PLAYER PROGRESS */}
              {/* ================================================= */}

              <div className="mt-8">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={Math.min(
                    currentTime,
                    duration || 0
                  )}
                  onChange={
                    handleSeek
                  }
                  className="
                    w-full
                    accent-white
                  "
                />

                <div
                  className="
                    flex
                    justify-between
                    text-xs
                    text-gray-500
                    mt-2
                  "
                >
                  <span>
                    {formatTime(
                      currentTime
                    )}
                  </span>

                  <span>
                    {formatTime(
                      duration
                    )}
                  </span>
                </div>
              </div>

              {/* ================================================= */}
              {/* MAIN CONTROLS */}
              {/* ================================================= */}

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-7
                  mt-7
                "
              >
                <button
                  type="button"
                  onClick={
                    toggleShuffle
                  }
                  className={
                    isShuffle
                      ? "text-green-500"
                      : "text-gray-400"
                  }
                  title="Shuffle"
                >
                  <Shuffle size={22} />
                </button>

                <button
                  type="button"
                  onClick={
                    previousSong
                  }
                  className="text-white"
                  title="Previous"
                >
                  <SkipBack size={27} />
                </button>

                <button
                  type="button"
                  onClick={
                    handlePlayPause
                  }
                  className="
                    w-16
                    h-16
                    bg-white
                    text-black
                    rounded-full
                    flex
                    items-center
                    justify-center
                    hover:scale-105
                    transition
                  "
                  title="Play/Pause"
                >
                  {isPlaying ? (
                    <Pause
                      size={28}
                      fill="black"
                    />
                  ) : (
                    <Play
                      size={28}
                      fill="black"
                    />
                  )}
                </button>

                <button
                  type="button"
                  onClick={nextSong}
                  className="text-white"
                  title="Next"
                >
                  <SkipForward size={27} />
                </button>

                <button
                  type="button"
                  onClick={
                    toggleRepeat
                  }
                  className={
                    repeatMode !==
                    "off"
                      ? "text-green-500"
                      : "text-gray-400"
                  }
                  title="Repeat"
                >
                  {repeatMode ===
                  "one" ? (
                    <Repeat1 size={22} />
                  ) : (
                    <Repeat size={22} />
                  )}
                </button>
              </div>

              {/* ================================================= */}
              {/* EXTRA ACTIONS - FULL PLAYER ONLY */}
              {/* ================================================= */}

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-8
                  mt-8
                "
              >
                {/* PLAYLIST */}

                <button
                  type="button"
                  onClick={() =>
                    setShowPlaylistPopup(
                      true
                    )
                  }
                  className="
                    w-11
                    h-11
                    rounded-full
                    bg-white/10
                    hover:bg-white/20
                    flex
                    items-center
                    justify-center
                  "
                  title="Add to Playlist"
                >
                  <Plus size={21} />
                </button>

                {/* QUEUE */}

                <button
                  type="button"
                  onClick={() =>
                    setShowQueue(true)
                  }
                  className="
                    w-11
                    h-11
                    rounded-full
                    bg-white/10
                    hover:bg-white/20
                    flex
                    items-center
                    justify-center
                  "
                  title="Queue"
                >
                  <ListMusic size={21} />
                </button>

                {/* SLEEP */}

                <button
                  type="button"
                  onClick={() =>
                    setShowSleepTimer(
                      (prev) =>
                        !prev
                    )
                  }
                  className={`
                    w-11
                    h-11
                    rounded-full
                    flex
                    items-center
                    justify-center
                    ${
                      timerActive
                        ? "bg-green-500 text-black"
                        : "bg-white/10 hover:bg-white/20"
                    }
                  `}
                  title="Sleep Timer"
                >
                  <Moon size={21} />
                </button>
              </div>

              {/* ================================================= */}
              {/* VOLUME - FULL PLAYER */}
              {/* ================================================= */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  mt-8
                  mb-8
                "
              >
                <Volume2
                  size={18}
                  className="text-gray-400"
                />

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={
                    handleVolume
                  }
                  className="
                    flex-1
                    accent-white
                  "
                />

                {sleepTimerSeconds !==
                  null && (
                  <span
                    className="
                      text-green-500
                      text-xs
                      font-mono
                    "
                  >
                    {formatTimer(
                      sleepTimerSeconds
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* SLEEP TIMER POPUP */}
      {/* ================================================= */}

      {showSleepTimer && (
        <div
          className="
            fixed
            bottom-[72px]
            sm:bottom-28
            left-2
            right-2
            sm:left-1/2
            sm:right-auto
            sm:-translate-x-1/2
            w-auto
            sm:w-[330px]
            max-w-[calc(100vw-1rem)]
            bg-[#181818]
            border
            border-[#333]
            rounded-2xl
            shadow-2xl
            z-[30000]
            overflow-hidden
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              px-4
              sm:px-5
              py-4
              border-b
              border-[#333]
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  w-9
                  h-9
                  rounded-full
                  bg-green-500/10
                  flex
                  items-center
                  justify-center
                "
              >
                <Moon
                  size={19}
                  className="text-green-500"
                />
              </div>

              <div>
                <h2 className="font-bold">
                  Sleep Timer
                </h2>

                <p
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  Automatically pause music
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowSleepTimer(
                  false
                )
              }
              className="
                w-8
                h-8
                flex
                items-center
                justify-center
                rounded-full
                text-gray-400
                hover:text-white
                hover:bg-[#282828]
              "
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-3">
            {[15, 30, 45, 60].map(
              (minutes) => (
                <button
                  type="button"
                  key={minutes}
                  onClick={() =>
                    startSleepTimer(
                      minutes
                    )
                  }
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-lg
                    hover:bg-[#282828]
                    transition
                    text-left
                  "
                >
                  <Timer
                    size={18}
                    className="text-gray-400"
                  />

                  <span>
                    {minutes} minutes
                  </span>
                </button>
              )
            )}

            <button
              type="button"
              onClick={
                startEndOfSongTimer
              }
              className="
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-lg
                hover:bg-[#282828]
                transition
                text-left
              "
            >
              <Moon
                size={18}
                className="text-gray-400"
              />

              <span>
                End of Song
              </span>
            </button>

            {timerActive && (
              <>
                <div
                  className="
                    h-px
                    bg-[#333]
                    my-2
                  "
                />

                <button
                  type="button"
                  onClick={
                    cancelSleepTimer
                  }
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-lg
                    text-red-400
                    hover:bg-red-500/10
                    transition
                    text-left
                  "
                >
                  Cancel Timer
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* QUEUE POPUP */}
      {/* ================================================= */}

      {showQueue && (
        <div
          className="
            fixed
            bottom-[72px]
            sm:bottom-28
            right-2
            sm:right-4
            left-2
            sm:left-auto
            w-auto
            sm:w-[380px]
            max-w-[calc(100vw-1rem)]
            bg-[#181818]
            border
            border-[#333]
            rounded-2xl
            shadow-2xl
            z-[30000]
            overflow-hidden
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              px-4
              sm:px-5
              py-4
              border-b
              border-[#333]
            "
          >
            <div>
              <h2 className="text-lg font-bold">
                Queue
              </h2>

              <p
                className="
                  text-xs
                  text-gray-500
                  mt-1
                "
              >
                {queue.length} songs
              </p>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              {queue.length > 1 && (
                <button
                  type="button"
                  onClick={clearQueue}
                  className="
                    text-xs
                    text-gray-400
                    hover:text-red-400
                    px-2
                    py-1
                  "
                >
                  Clear
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  setShowQueue(
                    false
                  )
                }
                className="
                  w-8
                  h-8
                  flex
                  items-center
                  justify-center
                  rounded-full
                  text-gray-400
                  hover:text-white
                  hover:bg-[#282828]
                "
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div
            className="
              px-4
              sm:px-5
              py-4
              border-b
              border-[#333]
            "
          >
            <p
              className="
                text-xs
                uppercase
                text-gray-500
                mb-3
              "
            >
              Now Playing
            </p>

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <img
                src={currentSong.image}
                alt={currentSong.title}
                className="
                  w-12
                  h-12
                  rounded
                  object-cover
                  flex-shrink-0
                "
              />

              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <p
                  className="
                    font-semibold
                    truncate
                  "
                >
                  {currentSong.title}
                </p>

                <p
                  className="
                    text-xs
                    text-green-500
                    truncate
                  "
                >
                  {currentSong.artist}
                </p>
              </div>

              <Play
                size={16}
                className="text-green-500"
                fill="currentColor"
              />
            </div>
          </div>

          <div
            className="
              max-h-[55vh]
              sm:max-h-[420px]
              overflow-y-auto
            "
          >
            <div
              className="
                px-4
                sm:px-5
                pt-4
                pb-2
              "
            >
              <p
                className="
                  text-xs
                  uppercase
                  text-gray-500
                "
              >
                Up Next
              </p>
            </div>

            {queue.length <= 1 ? (
              <div
                className="
                  px-5
                  py-10
                  text-center
                "
              >
                <ListMusic
                  size={42}
                  className="
                    mx-auto
                    text-gray-600
                    mb-3
                  "
                />

                <p
                  className="
                    text-gray-400
                    text-sm
                  "
                >
                  Queue is empty
                </p>
              </div>
            ) : (
              <div className="pb-3">
                {queue.map(
                  (song, index) => {
                    const isCurrent =
                      index ===
                      currentIndex;

                    return (
                      <div
                        key={`${song.id}-${index}`}
                        onClick={() =>
                          handlePlayQueueSong(
                            index
                          )
                        }
                        className={`
                          flex
                          items-center
                          gap-2
                          sm:gap-3
                          px-4
                          sm:px-5
                          py-3
                          cursor-pointer
                          ${
                            isCurrent
                              ? "bg-[#303030]"
                              : "hover:bg-[#282828]"
                          }
                        `}
                      >
                        <div
                          className={`
                            w-5
                            text-xs
                            text-center
                            flex-shrink-0
                            ${
                              isCurrent
                                ? "text-green-500"
                                : "text-gray-600"
                            }
                          `}
                        >
                          {index + 1}
                        </div>

                        <img
                          src={song.image}
                          alt={song.title}
                          className="
                            w-10
                            h-10
                            sm:w-11
                            sm:h-11
                            rounded
                            object-cover
                            flex-shrink-0
                          "
                        />

                        <div
                          className="
                            flex-1
                            min-w-0
                          "
                        >
                          <p
                            className={`
                              text-sm
                              font-medium
                              truncate
                              ${
                                isCurrent
                                  ? "text-green-500"
                                  : "text-white"
                              }
                            `}
                          >
                            {song.title}
                          </p>

                          <p
                            className="
                              text-xs
                              text-gray-500
                              truncate
                            "
                          >
                            {song.artist}
                          </p>
                        </div>

                        {isCurrent && (
                          <span
                            className="
                              hidden
                              sm:block
                              text-green-500
                              text-xs
                            "
                          >
                            Playing
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            removeFromQueue(
                              song.id
                            );
                          }}
                          className="
                            w-8
                            h-8
                            flex
                            items-center
                            justify-center
                            rounded-full
                            text-gray-500
                            hover:text-red-400
                            hover:bg-[#333]
                            flex-shrink-0
                          "
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* ADD TO PLAYLIST POPUP */}
      {/* ================================================= */}

      {showPlaylistPopup && (
        <div
          className="
            fixed
            inset-0
            z-[40000]
          "
        >
          <div
            className="
              absolute
              inset-0
              bg-black/80
              backdrop-blur-sm
            "
            onClick={() =>
              setShowPlaylistPopup(
                false
              )
            }
          />

          <div
            className="
              absolute
              inset-0
              flex
              items-end
              sm:items-center
              justify-center
              p-2
              sm:p-4
            "
          >
            <div
              className="
                w-full
                max-w-md
                max-h-[85vh]
                bg-[#181818]
                rounded-2xl
                border
                border-[#333]
                shadow-2xl
                p-5
                sm:p-6
                overflow-hidden
              "
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  mb-5
                "
              >
                <div
                  className="
                    min-w-0
                  "
                >
                  <h2
                    className="
                      text-lg
                      sm:text-xl
                      font-bold
                    "
                  >
                    Add to Playlist
                  </h2>

                  <p
                    className="
                      text-gray-400
                      text-sm
                      mt-1
                      truncate
                    "
                  >
                    {currentSong.title}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowPlaylistPopup(
                      false
                    )
                  }
                  className="
                    w-9
                    h-9
                    flex
                    items-center
                    justify-center
                    rounded-full
                    text-gray-400
                    hover:text-white
                    hover:bg-[#282828]
                    flex-shrink-0
                  "
                >
                  <X size={20} />
                </button>
              </div>

              {playlists.length ===
              0 ? (
                <div
                  className="
                    text-center
                    py-8
                  "
                >
                  <Plus
                    size={38}
                    className="
                      mx-auto
                      text-gray-600
                      mb-3
                    "
                  />

                  <p
                    className="
                      text-gray-400
                      mb-2
                    "
                  >
                    No playlists found.
                  </p>

                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    Create a playlist first.
                  </p>
                </div>
              ) : (
                <div
                  className="
                    space-y-2
                    max-h-[50vh]
                    overflow-y-auto
                  "
                >
                  {playlists.map(
                    (playlist) => {
                      const alreadyAdded =
                        playlist.songs?.some(
                          (song) =>
                            song.id ===
                            currentSong.id
                        );

                      return (
                        <button
                          type="button"
                          key={
                            playlist.id
                          }
                          disabled={
                            alreadyAdded
                          }
                          onClick={() =>
                            handleAddToPlaylist(
                              playlist.id
                            )
                          }
                          className={`
                            w-full
                            flex
                            items-center
                            gap-3
                            sm:gap-4
                            p-3
                            rounded-lg
                            text-left
                            transition
                            ${
                              alreadyAdded
                                ? "opacity-50 cursor-not-allowed bg-[#222]"
                                : "hover:bg-[#282828]"
                            }
                          `}
                        >
                          <div
                            className="
                              w-11
                              h-11
                              sm:w-12
                              sm:h-12
                              rounded-lg
                              bg-gradient-to-br
                              from-green-600
                              to-blue-600
                              flex
                              items-center
                              justify-center
                              flex-shrink-0
                            "
                          >
                            <Plus
                              size={22}
                              className="text-white"
                            />
                          </div>

                          <div
                            className="
                              flex-1
                              min-w-0
                            "
                          >
                            <h3
                              className="
                                font-semibold
                                truncate
                                text-sm
                                sm:text-base
                              "
                            >
                              {
                                playlist.name
                              }
                            </h3>

                            <p
                              className="
                                text-gray-400
                                text-xs
                                sm:text-sm
                              "
                            >
                              {alreadyAdded
                                ? "Already added"
                                : `${
                                    playlist
                                      .songs
                                      ?.length ||
                                    0
                                  } songs`}
                            </p>
                          </div>

                          {alreadyAdded && (
                            <span
                              className="
                                text-xs
                                text-gray-500
                              "
                            >
                              Added
                            </span>
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  setShowPlaylistPopup(
                    false
                  )
                }
                className="
                  w-full
                  mt-4
                  py-3
                  rounded-full
                  bg-[#303030]
                  hover:bg-[#404040]
                  transition
                  font-semibold
                "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MusicPlayer;