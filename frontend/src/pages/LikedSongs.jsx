import {
  Play,
  Heart,
} from "lucide-react";

import { usePlayer } from "../context/PlayerContext";

function LikedSongs() {
  const {
    likedSongs,
    playSong,
    toggleLike,
  } = usePlayer();

  const handlePlayAll = () => {
    if (
      likedSongs.length === 0
    ) {
      return;
    }

    playSong(
      likedSongs[0],
      likedSongs
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-6 mb-7 md:mb-8">

        {/* ARTWORK */}

        <div className="
          w-32
          h-32
          sm:w-40
          sm:h-40
          md:w-48
          md:h-48
          bg-gradient-to-br
          from-purple-700
          to-blue-400
          rounded-xl
          flex
          items-center
          justify-center
          flex-shrink-0
        ">

          <Heart
            size={58}
            className="text-white sm:w-[70px] sm:h-[70px] md:w-20 md:h-20"
            fill="white"
          />

        </div>

        {/* INFO */}

        <div className="min-w-0">

          <p className="text-xs sm:text-sm text-gray-400 mb-2">
            PLAYLIST
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3">
            Liked Songs
          </h1>

          <p className="text-gray-400 text-sm sm:text-base">
            {likedSongs.length} songs
          </p>

        </div>

      </div>

      {/* ================================================= */}
      {/* PLAY ALL */}
      {/* ================================================= */}

      {likedSongs.length > 0 && (

        <button
          type="button"
          onClick={
            handlePlayAll
          }
          className="
            bg-green-500
            text-black
            rounded-full
            w-12
            h-12
            sm:w-14
            sm:h-14
            flex
            items-center
            justify-center
            mb-6
            hover:scale-105
            transition
          "
          title="Play All"
        >

          <Play
            size={21}
            fill="black"
          />

        </button>

      )}

      {/* ================================================= */}
      {/* EMPTY STATE */}
      {/* ================================================= */}

      {likedSongs.length === 0 && (

        <div className="text-center py-16 sm:py-20 px-4">

          <Heart
            size={52}
            className="mx-auto text-gray-600 mb-4"
          />

          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            No liked songs yet
          </h2>

          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Songs you like will appear here.
          </p>

        </div>

      )}

      {/* ================================================= */}
      {/* SONGS */}
      {/* ================================================= */}

      {likedSongs.length > 0 && (

        <div className="space-y-2">

          {likedSongs.map(
            (song, index) => (

              <div
                key={`${song.id}-${index}`}
                onClick={() =>
                  playSong(
                    song,
                    likedSongs
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  sm:gap-4
                  p-2.5
                  sm:p-3
                  rounded-lg
                  hover:bg-[#282828]
                  cursor-pointer
                  transition
                "
              >

                {/* NUMBER */}

                <div className="w-5 sm:w-8 text-gray-400 text-center text-xs sm:text-sm flex-shrink-0">
                  {index + 1}
                </div>

                {/* IMAGE */}

                <img
                  src={song.image}
                  alt={song.title}
                  className="w-11 h-11 sm:w-14 sm:h-14 rounded object-cover flex-shrink-0"
                />

                {/* SONG INFO */}

                <div className="flex-1 min-w-0">

                  <h3 className="font-semibold truncate text-sm sm:text-base">
                    {song.title}
                  </h3>

                  <p className="text-gray-400 text-xs sm:text-sm truncate mt-0.5">
                    {song.artist}
                  </p>

                </div>

                {/* LIKE */}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();

                    toggleLike(song);
                  }}
                  className="p-2 sm:p-3 text-green-500 hover:text-red-500 transition flex-shrink-0"
                  title="Remove from Liked Songs"
                >

                  <Heart
                    size={18}
                    className="sm:w-5 sm:h-5"
                    fill="currentColor"
                  />

                </button>

                {/* PLAY */}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();

                    playSong(
                      song,
                      likedSongs
                    );
                  }}
                  className="
                    bg-white
                    text-black
                    rounded-full
                    w-9
                    h-9
                    sm:w-10
                    sm:h-10
                    flex
                    items-center
                    justify-center
                    hover:scale-105
                    transition
                    flex-shrink-0
                  "
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

    </div>
  );
}

export default LikedSongs;