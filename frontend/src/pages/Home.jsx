import {
  Play,
  Heart,
  Plus,
  X,
  Trash2,
  MoreVertical,
  ListPlus,
  SkipForward,
  Smile,
  Frown,
  HeartHandshake,
  Flame,
  Moon,
  Leaf,
  Search,
  RefreshCw,
  AlertCircle,
  Music2,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { searchSongs } from "../services/api";
import { usePlayer } from "../context/PlayerContext";

const moods = [
  {
    id: "happy",
    name: "Happy",
    emoji: "😊",
    icon: Smile,
    query: "happy feel good songs",
  },
  {
    id: "sad",
    name: "Sad",
    emoji: "😔",
    icon: Frown,
    query: "sad emotional songs",
  },
  {
    id: "romantic",
    name: "Romantic",
    emoji: "❤️",
    icon: HeartHandshake,
    query: "romantic love songs",
  },
  {
    id: "energetic",
    name: "Energetic",
    emoji: "🔥",
    icon: Flame,
    query: "energetic workout songs",
  },
  {
    id: "late-night",
    name: "Late Night",
    emoji: "🌙",
    icon: Moon,
    query: "late night chill songs",
  },
  {
    id: "chill",
    name: "Chill",
    emoji: "🧘",
    icon: Leaf,
    query: "chill relaxing songs",
  },
];

const languages = [
  {
    id: "all",
    name: "All",
    query: "",
  },
  {
    id: "hindi",
    name: "Hindi",
    query: "Hindi",
  },
  {
    id: "english",
    name: "English",
    query: "English",
  },
  {
    id: "punjabi",
    name: "Punjabi",
    query: "Punjabi",
  },
  {
    id: "rajasthani",
    name: "Rajasthani",
    query: "Rajasthani",
  },
];

function Home() {
  const [songs, setSongs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedMood, setSelectedMood] =
    useState(null);

  const [selectedLanguage, setSelectedLanguage] =
    useState("all");

  const [selectedSong, setSelectedSong] =
    useState(null);

  const [menuSongId, setMenuSongId] =
    useState(null);

  const [
    showClearRecentModal,
    setShowClearRecentModal,
  ] = useState(false);

  const [lastQuery, setLastQuery] =
    useState(
      "popular latest Hindi songs"
    );

  const hasLoaded =
    useRef(false);

  const {
    playSong,
    toggleLike,
    isSongLiked,
    recentlyPlayed,
    playlists,
    addSongToPlaylist,
    clearRecentlyPlayed,
    addToQueue,
    playNext,
  } = usePlayer();

  // =========================
  // BUILD QUERY
  // =========================

  const buildQuery = (
    mood = selectedMood,
    language = selectedLanguage
  ) => {
    const moodData =
      moods.find(
        (item) => item.id === mood
      );

    const languageData =
      languages.find(
        (item) =>
          item.id === language
      );

    const parts = [];

    if (moodData?.query) {
      parts.push(moodData.query);
    } else {
      parts.push(
        "popular latest songs"
      );
    }

    if (languageData?.query) {
      parts.push(
        languageData.query
      );
    }

    return parts.join(" ");
  };

  // =========================
  // LOAD DEFAULT
  // =========================

  useEffect(() => {
    if (hasLoaded.current) {
      return;
    }

    hasLoaded.current = true;

    loadSongs(
      "popular latest Hindi songs"
    );
  }, []);

  // =========================
  // LOAD SONGS
  // =========================

  const loadSongs = async (
    query
  ) => {
    try {
      setLoading(true);
      setError("");
      setLastQuery(query);

      const data =
        await searchSongs(query);

      setSongs(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "HOME SEARCH ERROR:",
        err
      );

      setSongs([]);

      const apiMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "";

      if (
        apiMessage
          .toLowerCase()
          .includes("quota")
      ) {
        setError(
          "YouTube search limit has been reached. Please try again later."
        );
      } else if (
        apiMessage
          .toLowerCase()
          .includes("api key")
      ) {
        setError(
          "YouTube API is currently unavailable. Please check the API configuration."
        );
      } else {
        setError(
          "We couldn't load your music right now."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RETRY
  // =========================

  const handleRetry = () => {
    loadSongs(lastQuery);
  };

  // =========================
  // MOOD
  // =========================

  const handleMoodSelect = (
    moodId
  ) => {
    setSelectedMood(moodId);

    const query = buildQuery(
      moodId,
      selectedLanguage
    );

    loadSongs(query);
  };

  // =========================
  // LANGUAGE
  // =========================

  const handleLanguageSelect = (
    languageId
  ) => {
    setSelectedLanguage(
      languageId
    );

    const query = buildQuery(
      selectedMood,
      languageId
    );

    loadSongs(query);
  };

  // =========================
  // RESET
  // =========================

  const handleReset = () => {
    setSelectedMood(null);
    setSelectedLanguage(
      "all"
    );

    loadSongs(
      "popular latest Hindi songs"
    );
  };

  // =========================
  // PLAY
  // =========================

  const handlePlay = (
    e,
    song,
    list
  ) => {
    e.stopPropagation();

    playSong(song, list);
  };

  // =========================
  // LIKE
  // =========================

  const handleLike = (
    e,
    song
  ) => {
    e.stopPropagation();

    toggleLike(song);
    setMenuSongId(null);
  };

  // =========================
  // PLAYLIST
  // =========================

  const handleAddToPlaylist = (
    e,
    song
  ) => {
    e.stopPropagation();

    setSelectedSong(song);
    setMenuSongId(null);
  };

  const handleSelectPlaylist = (
    playlistId
  ) => {
    if (!selectedSong) {
      return;
    }

    addSongToPlaylist(
      playlistId,
      selectedSong
    );

    setSelectedSong(null);
  };

  // =========================
  // CLEAR RECENT
  // =========================

  const handleClearRecentlyPlayed =
    () => {
      clearRecentlyPlayed();

      setShowClearRecentModal(
        false
      );
    };

  // =========================
  // SONG CARD
  // =========================

  const SongCard = ({
    song,
    list,
  }) => {
    const liked =
      isSongLiked(song.id);

    const menuOpen =
      menuSongId === song.id;

    return (
      <div
        onClick={() =>
          playSong(song, list)
        }
        className="group relative bg-[#181818] hover:bg-[#282828] rounded-xl p-4 cursor-pointer transition duration-300"
      >
        {/* IMAGE */}

        <div className="relative mb-4">

          <img
            src={song.image}
            alt={song.title}
            className="w-full aspect-square object-cover rounded-lg"
          />

          {/* PLAY */}

          <button
            type="button"
            onClick={(e) =>
              handlePlay(
                e,
                song,
                list
              )
            }
            className="absolute right-2 bottom-2 w-11 h-11 bg-green-500 text-black rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105 transition-all shadow-lg"
            title="Play"
          >
            <Play
              size={20}
              fill="black"
            />
          </button>

        </div>

        {/* LIKE */}

        <button
          type="button"
          onClick={(e) =>
            handleLike(
              e,
              song
            )
          }
          className={`absolute top-5 right-14 p-2 rounded-full bg-black/70 transition ${
            liked
              ? "text-green-500"
              : "text-white opacity-0 group-hover:opacity-100"
          }`}
          title={
            liked
              ? "Unlike"
              : "Like"
          }
        >
          <Heart
            size={18}
            fill={
              liked
                ? "currentColor"
                : "none"
            }
          />
        </button>

        {/* MORE */}

        <div className="absolute top-5 right-4">

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();

              setMenuSongId(
                menuOpen
                  ? null
                  : song.id
              );
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 hover:bg-[#333] transition"
            title="More"
          >
            <MoreVertical
              size={18}
            />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() =>
                  setMenuSongId(
                    null
                  )
                }
              />

              <div
                className="absolute right-0 top-10 w-48 bg-[#282828] border border-[#3a3a3a] rounded-xl shadow-2xl p-1 z-50"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                {/* PLAY NOW */}

                <button
                  type="button"
                  onClick={() => {
                    playSong(
                      song,
                      songs
                    );

                    setMenuSongId(
                      null
                    );
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-[#3a3a3a]"
                >
                  <Play size={17} />
                  Play Now
                </button>

                {/* PLAY NEXT */}

                <button
                  type="button"
                  onClick={() => {
                    playNext(song);

                    setMenuSongId(
                      null
                    );
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-[#3a3a3a]"
                >
                  <SkipForward
                    size={17}
                  />
                  Play Next
                </button>

                {/* ADD QUEUE */}

                <button
                  type="button"
                  onClick={() => {
                    addToQueue(song);

                    setMenuSongId(
                      null
                    );
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-[#3a3a3a]"
                >
                  <ListPlus
                    size={17}
                  />
                  Add to Queue
                </button>

                {/* PLAYLIST */}

                <button
                  type="button"
                  onClick={(e) =>
                    handleAddToPlaylist(
                      e,
                      song
                    )
                  }
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-[#3a3a3a]"
                >
                  <Plus size={17} />
                  Add to Playlist
                </button>

                {/* LIKE */}

                <button
                  type="button"
                  onClick={(e) =>
                    handleLike(
                      e,
                      song
                    )
                  }
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-[#3a3a3a]"
                >
                  <Heart
                    size={17}
                    fill={
                      liked
                        ? "currentColor"
                        : "none"
                    }
                  />

                  {liked
                    ? "Unlike"
                    : "Like"}
                </button>

              </div>
            </>
          )}

        </div>

        {/* TITLE */}

        <h3 className="font-semibold truncate">
          {song.title}
        </h3>

        <p className="text-gray-400 text-sm truncate mt-1">
          {song.artist}
        </p>

      </div>
    );
  };

  // =========================
  // SKELETON CARD
  // =========================

  const SkeletonCard = () => {
    return (
      <div className="bg-[#181818] rounded-xl p-4 animate-pulse">

        <div className="w-full aspect-square rounded-lg bg-[#282828] mb-4" />

        <div className="h-4 bg-[#282828] rounded w-4/5 mb-3" />

        <div className="h-3 bg-[#282828] rounded w-3/5" />

      </div>
    );
  };

  const activeMoodData =
    moods.find(
      (mood) =>
        mood.id === selectedMood
    );

  const activeLanguageData =
    languages.find(
      (language) =>
        language.id ===
        selectedLanguage
    );

  return (
    <>
      <div className="p-8">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold mb-2">
            Discover Your Sound
          </h1>

          <p className="text-gray-400">
            Tell MusicVerse your mood and language.
          </p>

        </div>

        {/* ================================================= */}
        {/* MOOD */}
        {/* ================================================= */}

        <section className="mb-10">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-xl font-bold">
                How are you feeling?
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Choose a mood
              </p>

            </div>

            {(selectedMood ||
              selectedLanguage !==
                "all") && (

              <button
                type="button"
                onClick={
                  handleReset
                }
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Reset
              </button>

            )}

          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

            {moods.map((mood) => {

              const Icon =
                mood.icon;

              const active =
                selectedMood ===
                mood.id;

              return (
                <button
                  type="button"
                  key={mood.id}
                  onClick={() =>
                    handleMoodSelect(
                      mood.id
                    )
                  }
                  className={`p-5 rounded-xl text-left transition hover:-translate-y-1 ${
                    active
                      ? "bg-green-500 text-black"
                      : "bg-[#181818] hover:bg-[#282828]"
                  }`}
                >

                  <div className="text-3xl mb-4">
                    {mood.emoji}
                  </div>

                  <Icon
                    size={20}
                    className="mb-2"
                  />

                  <h3 className="font-semibold">
                    {mood.name}
                  </h3>

                </button>
              );
            })}

          </div>

        </section>

        {/* ================================================= */}
        {/* LANGUAGE */}
        {/* ================================================= */}

        <section className="mb-12">

          <div className="mb-4">

            <h2 className="text-xl font-bold">
              Choose Language
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Pick a language for better results
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            {languages.map(
              (language) => {

                const active =
                  selectedLanguage ===
                  language.id;

                return (
                  <button
                    type="button"
                    key={language.id}
                    onClick={() =>
                      handleLanguageSelect(
                        language.id
                      )
                    }
                    className={`px-5 py-2.5 rounded-full font-medium transition ${
                      active
                        ? "bg-green-500 text-black"
                        : "bg-[#282828] text-gray-300 hover:bg-[#3a3a3a] hover:text-white"
                    }`}
                  >
                    {language.name}
                  </button>
                );
              }
            )}

          </div>

        </section>

        {/* ================================================= */}
        {/* ACTIVE FILTER */}
        {/* ================================================= */}

        {(selectedMood ||
          selectedLanguage !==
            "all") && (

          <div className="mb-8 bg-[#181818] border border-[#2f2f2f] rounded-xl p-4 flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-xs uppercase">
                MusicVerse Discovery
              </p>

              <p className="font-semibold mt-1">

                {activeMoodData
                  ? `${activeMoodData.emoji} ${activeMoodData.name}`
                  : "All moods"}

                {" • "}

                {activeLanguageData?.name ||
                  "All"}

              </p>

            </div>

            <button
              type="button"
              onClick={
                handleReset
              }
              className="text-gray-400 hover:text-white"
            >
              Clear Filters
            </button>

          </div>
        )}

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading && (

          <section>

            <div className="flex items-center gap-3 mb-5">

              <div className="w-5 h-5 rounded-full border-2 border-[#444] border-t-green-500 animate-spin" />

              <div>

                <h2 className="font-bold">
                  Finding music for you...
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  This may take a moment
                </p>

              </div>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

              {Array.from({
                length: 10,
              }).map((_, index) => (
                <SkeletonCard
                  key={index}
                />
              ))}

            </div>

          </section>
        )}

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {!loading &&
          error && (

            <div className="min-h-[350px] flex items-center justify-center">

              <div className="w-full max-w-lg bg-[#181818] border border-red-500/20 rounded-2xl p-8 text-center">

                <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5">

                  <AlertCircle
                    size={28}
                    className="text-red-400"
                  />

                </div>

                <h2 className="text-xl font-bold mb-2">
                  Music unavailable
                </h2>

                <p className="text-gray-400 leading-6 mb-6">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={
                    handleRetry
                  }
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black rounded-full font-semibold hover:scale-105 transition"
                >
                  <RefreshCw
                    size={17}
                  />
                  Try Again
                </button>

              </div>

            </div>
          )}

        {/* ================================================= */}
        {/* EMPTY RESULT */}
        {/* ================================================= */}

        {!loading &&
          !error &&
          songs.length === 0 && (

            <div className="min-h-[300px] flex flex-col items-center justify-center text-center">

              <div className="w-16 h-16 rounded-full bg-[#181818] flex items-center justify-center mb-5">

                <Search
                  size={28}
                  className="text-gray-500"
                />

              </div>

              <h2 className="text-xl font-semibold mb-2">
                No music found
              </h2>

              <p className="text-gray-500 max-w-md mb-5">
                We couldn't find music for this selection.
                Try another mood or language.
              </p>

              <button
                type="button"
                onClick={
                  handleReset
                }
                className="px-5 py-2.5 rounded-full bg-[#282828] hover:bg-[#3a3a3a] text-white transition"
              >
                Reset Discovery
              </button>

            </div>
          )}

        {/* ================================================= */}
        {/* RESULTS */}
        {/* ================================================= */}

        {!loading &&
          !error &&
          songs.length > 0 && (

            <>

              {/* MAIN RESULTS */}

              <section>

                <div className="flex items-center justify-between mb-5">

                  <div>

                    <h2 className="text-xl font-bold">

                      {activeMoodData
                        ? `${activeMoodData.emoji} ${activeMoodData.name} Music`
                        : "Made For You"}

                    </h2>

                    <p className="text-gray-500 text-sm mt-1">

                      {activeLanguageData &&
                      activeLanguageData.id !==
                        "all"
                        ? `${activeLanguageData.name} music`
                        : "Fresh music for you"}

                    </p>

                  </div>

                  <span className="text-xs text-gray-600">
                    {songs.length} results
                  </span>

                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

                  {songs
                    .slice(0, 10)
                    .map((song) => (
                      <SongCard
                        key={song.id}
                        song={song}
                        list={songs}
                      />
                    ))}

                </div>

              </section>

              {/* ================================================= */}
              {/* TRENDING */}
              {/* ================================================= */}

              {!selectedMood &&
                songs.length > 10 && (

                <section className="mt-12">

                  <div className="mb-5">

                    <h2 className="text-xl font-bold">
                      🔥 Trending Now
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                      More music you might enjoy
                    </p>

                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

                    {songs
                      .slice(10, 20)
                      .map((song) => (
                        <SongCard
                          key={`trending-${song.id}`}
                          song={song}
                          list={songs}
                        />
                      ))}

                  </div>

                </section>
              )}

            </>
          )}

        {/* ================================================= */}
        {/* RECENTLY PLAYED */}
        {/* ================================================= */}

        {recentlyPlayed.length >
          0 && (

          <section className="mt-12 pb-10">

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-xl font-bold">
                  Recently Played
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {recentlyPlayed.length} recent songs
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowClearRecentModal(
                    true
                  )
                }
                className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-[#282828] transition"
              >
                <Trash2 size={17} />
                Clear All
              </button>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

              {recentlyPlayed.map(
                (song) => (
                  <SongCard
                    key={`recent-${song.id}`}
                    song={song}
                    list={recentlyPlayed}
                  />
                )
              )}

            </div>

          </section>
        )}

        {/* ================================================= */}
        {/* RECENT EMPTY */}
        {/* ================================================= */}

        {recentlyPlayed.length ===
          0 && (
          <section className="mt-12 pb-10">

            <div className="bg-[#181818] border border-[#242424] rounded-2xl p-8 text-center">

              <div className="w-14 h-14 rounded-full bg-[#242424] flex items-center justify-center mx-auto mb-4">

                <Music2
                  size={25}
                  className="text-gray-500"
                />

              </div>

              <h2 className="font-semibold mb-2">
                Your listening history is empty
              </h2>

              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Play a song and it will appear here
                so you can quickly find it again.
              </p>

            </div>

          </section>
        )}

      </div>

      {/* ================================================= */}
      {/* ADD TO PLAYLIST MODAL */}
      {/* ================================================= */}

      {selectedSong && (

        <div className="fixed inset-0 z-[9999]">

          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() =>
              setSelectedSong(
                null
              )
            }
          />

          <div className="absolute inset-0 flex items-center justify-center p-4">

            <div
              className="w-full max-w-md bg-[#181818] rounded-2xl border border-[#333] shadow-2xl p-6"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="flex items-center justify-between mb-6">

                <div className="min-w-0">

                  <h2 className="text-xl font-bold">
                    Add to Playlist
                  </h2>

                  <p className="text-gray-400 text-sm mt-1 truncate">
                    {selectedSong.title}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedSong(
                      null
                    )
                  }
                  className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-[#282828]"
                >
                  <X size={20} />
                </button>

              </div>

              {playlists.length ===
              0 ? (

                <div className="text-center py-8">

                  <Music2
                    size={40}
                    className="mx-auto text-gray-600 mb-3"
                  />

                  <p className="text-gray-400 mb-2">
                    No playlists found.
                  </p>

                  <p className="text-sm text-gray-500">
                    Create a playlist first.
                  </p>

                </div>

              ) : (

                <div className="space-y-2 max-h-[350px] overflow-y-auto">

                  {playlists.map(
                    (playlist) => {

                      const alreadyAdded =
                        playlist.songs?.some(
                          (item) =>
                            item.id ===
                            selectedSong.id
                        );

                      return (
                        <button
                          type="button"
                          key={playlist.id}
                          disabled={
                            alreadyAdded
                          }
                          onClick={() =>
                            handleSelectPlaylist(
                              playlist.id
                            )
                          }
                          className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition ${
                            alreadyAdded
                              ? "opacity-50 cursor-not-allowed bg-[#222]"
                              : "hover:bg-[#282828]"
                          }`}
                        >

                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center flex-shrink-0">

                            <Plus
                              size={22}
                              className="text-white"
                            />

                          </div>

                          <div className="flex-1 min-w-0">

                            <h3 className="font-semibold truncate">
                              {playlist.name}
                            </h3>

                            <p className="text-gray-400 text-sm">
                              {alreadyAdded
                                ? "Already added"
                                : `${
                                    playlist.songs?.length ||
                                    0
                                  } songs`}
                            </p>

                          </div>

                          {alreadyAdded && (

                            <span className="text-xs text-gray-500">
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
                  setSelectedSong(
                    null
                  )
                }
                className="w-full mt-5 py-3 rounded-full bg-[#303030] hover:bg-[#404040] transition font-semibold"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================================================= */}
      {/* CLEAR RECENT MODAL */}
      {/* ================================================= */}

      {showClearRecentModal && (

        <div className="fixed inset-0 z-[10000]">

          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() =>
              setShowClearRecentModal(
                false
              )
            }
          />

          <div className="absolute inset-0 flex items-center justify-center p-4">

            <div
              className="w-full max-w-[420px] bg-[#181818] rounded-2xl border border-[#333] shadow-2xl p-6"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="flex items-center justify-between mb-5">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-full bg-red-500/10 flex items-center justify-center">

                    <Trash2
                      size={21}
                      className="text-red-500"
                    />

                  </div>

                  <h2 className="text-xl font-bold">
                    Clear recently played?
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowClearRecentModal(
                      false
                    )
                  }
                  className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-[#282828]"
                >
                  <X size={20} />
                </button>

              </div>

              <p className="text-gray-400 text-sm leading-6 mb-7">

                This will remove all{" "}

                <span className="text-white font-semibold">
                  {recentlyPlayed.length} recent songs
                </span>{" "}

                from your listening history.

                <br />

                This action cannot be undone.

              </p>

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowClearRecentModal(
                      false
                    )
                  }
                  className="px-5 py-2.5 rounded-full bg-[#303030] text-white hover:bg-[#404040] transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleClearRecentlyPlayed
                  }
                  className="px-5 py-2.5 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                >
                  Clear All
                </button>

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default Home;