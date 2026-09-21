import {
  Heart,
  Music,
  Play,
  Trash2,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useState } from "react";

import { usePlayer } from "../context/PlayerContext";

function Library() {
  const {
    likedSongs,
    playlists,
    recentlyPlayed,
    playSong,
    clearRecentlyPlayed,
  } = usePlayer();

  const [showClearModal, setShowClearModal] =
    useState(false);

  // =========================
  // CLEAR RECENTLY PLAYED
  // =========================

  const handleClearRecentlyPlayed = () => {
    clearRecentlyPlayed();
    setShowClearModal(false);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-6">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="mb-7 md:mb-8">

        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Your Library
        </h1>

        <p className="text-gray-400 text-sm sm:text-base">
          Your music, playlists and listening history
        </p>

      </div>

      {/* ========================= */}
      {/* LIKED SONGS */}
      {/* ========================= */}

      <section className="mb-10 md:mb-12">

        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5">
          Liked Songs
        </h2>

        <Link
          to="/liked"
          className="block w-full sm:max-w-sm"
        >
          <div className="bg-gradient-to-br from-purple-700 to-blue-500 rounded-xl p-5 sm:p-6 hover:scale-[1.02] transition">

            <Heart
              size={40}
              className="text-white mb-5 sm:mb-6"
              fill="white"
            />

            <h3 className="text-lg sm:text-xl font-bold">
              Liked Songs
            </h3>

            <p className="text-gray-200 mt-1 text-sm sm:text-base">
              {likedSongs.length} songs
            </p>

          </div>
        </Link>

      </section>

      {/* ========================= */}
      {/* PLAYLISTS */}
      {/* ========================= */}

      <section>

        <div className="flex items-center justify-between mb-4 sm:mb-5">

          <div>
            <h2 className="text-lg sm:text-xl font-bold">
              Your Playlists
            </h2>

            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              {playlists.length} playlists
            </p>
          </div>

        </div>

        {playlists.length === 0 ? (

          <div className="py-12 sm:py-16 text-center">

            <Music
              size={45}
              className="mx-auto text-gray-600 mb-4"
            />

            <h3 className="text-base sm:text-lg font-semibold mb-2">
              No playlists yet
            </h3>

            <p className="text-gray-400 text-sm">
              Create a playlist to see it here.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">

            {playlists.map(
              (playlist) => (

                <Link
                  key={playlist.id}
                  to={`/playlist/${playlist.id}`}
                  className="bg-[#181818] hover:bg-[#282828] rounded-xl p-3 sm:p-4 transition min-w-0"
                >

                  <div className="aspect-square rounded-lg bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center mb-3 sm:mb-4">

                    <Music
                      size={42}
                      className="text-white sm:w-[55px] sm:h-[55px]"
                    />

                  </div>

                  <h3 className="font-semibold truncate text-sm sm:text-base">
                    {playlist.name}
                  </h3>

                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    {playlist.songs?.length || 0} songs
                  </p>

                </Link>

              )
            )}

          </div>

        )}

      </section>

      {/* ========================= */}
      {/* RECENTLY PLAYED */}
      {/* ========================= */}

      <section className="mt-10 md:mt-12 pb-10">

        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

          <div>

            <h2 className="text-lg sm:text-xl font-bold">
              Recently Played
            </h2>

            {recentlyPlayed.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {recentlyPlayed.length} recent songs
              </p>
            )}

          </div>

          {/* CLEAR BUTTON */}

          {recentlyPlayed.length > 0 && (

            <button
              type="button"
              onClick={() =>
                setShowClearModal(true)
              }
              className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-[#282828] transition text-sm"
            >

              <Trash2 size={17} />

              <span>
                Clear All
              </span>

            </button>

          )}

        </div>

        {/* ========================= */}
        {/* EMPTY STATE */}
        {/* ========================= */}

        {recentlyPlayed.length === 0 ? (

          <div className="py-12 sm:py-16 text-center px-4">

            <Music
              size={45}
              className="mx-auto text-gray-600 mb-4"
            />

            <h3 className="text-base sm:text-lg font-semibold mb-2">
              No recently played songs
            </h3>

            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Start playing music and your history will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-2">

            {recentlyPlayed.map(
              (song, index) => (

                <div
                  key={`${song.id}-${index}`}
                  onClick={() =>
                    playSong(
                      song,
                      recentlyPlayed
                    )
                  }
                  className="flex items-center gap-2 sm:gap-4 p-2.5 sm:p-3 rounded-lg hover:bg-[#282828] cursor-pointer transition"
                >

                  {/* NUMBER */}

                  <div className="w-5 sm:w-8 text-gray-500 text-center text-xs sm:text-sm flex-shrink-0">
                    {index + 1}
                  </div>

                  {/* IMAGE */}

                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded object-cover flex-shrink-0"
                  />

                  {/* INFO */}

                  <div className="flex-1 min-w-0">

                    <h3 className="font-semibold truncate text-sm sm:text-base">
                      {song.title}
                    </h3>

                    <p className="text-gray-400 text-xs sm:text-sm truncate mt-0.5">
                      {song.artist}
                    </p>

                  </div>

                  {/* PLAY */}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      playSong(
                        song,
                        recentlyPlayed
                      );
                    }}
                    className="bg-white text-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:scale-105 transition flex-shrink-0"
                    title="Play"
                  >
                    <Play
                      size={15}
                      fill="black"
                    />
                  </button>

                </div>

              )
            )}

          </div>

        )}

      </section>

      {/* ================================================= */}
      {/* CLEAR RECENTLY PLAYED MODAL */}
      {/* ================================================= */}

      {showClearModal && (

        <div className="fixed inset-0 z-[9999]">

          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() =>
              setShowClearModal(false)
            }
          />

          <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">

            <div
              onClick={(e) =>
                e.stopPropagation()
              }
              className="w-full max-w-[420px] bg-[#181818] rounded-2xl border border-[#333] shadow-2xl p-5 sm:p-6"
            >

              {/* HEADER */}

              <div className="flex items-start justify-between gap-3 mb-5">

                <div className="flex items-center gap-3 min-w-0">

                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">

                    <Trash2
                      size={20}
                      className="text-red-500"
                    />

                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Clear recently played?
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowClearModal(
                      false
                    )
                  }
                  className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-[#282828] transition flex-shrink-0"
                  title="Close"
                >
                  <X size={20} />
                </button>

              </div>

              {/* MESSAGE */}

              <p className="text-gray-400 text-sm leading-6 mb-7">

                This will remove all{" "}

                <span className="text-white font-semibold">
                  {recentlyPlayed.length} recently played songs
                </span>{" "}

                from your listening history.

                <br />

                This action cannot be undone.

              </p>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowClearModal(
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

    </div>
  );
}

export default Library;