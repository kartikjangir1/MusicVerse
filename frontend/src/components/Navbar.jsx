import {
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  X,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();

  const [searchQuery, setSearchQuery] =
    useState("");

  // =========================
  // SEARCH
  // =========================

  const handleSearch = (e) => {
    e.preventDefault();

    const query =
      searchQuery.trim();

    if (!query) {
      return;
    }

    navigate(
      `/search?q=${encodeURIComponent(
        query
      )}`
    );
  };

  // =========================
  // CLEAR SEARCH
  // =========================

  const handleClearSearch = () => {
    setSearchQuery("");

    if (
      location.pathname ===
      "/search"
    ) {
      navigate("/search");
    }
  };

  // =========================
  // BACK
  // =========================

  const handleBack = () => {
    navigate(-1);
  };

  // =========================
  // FORWARD
  // =========================

  const handleForward = () => {
    navigate(1);
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = () => {
    navigate("/login");
  };

  // =========================
  // PROFILE
  // =========================

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <header
      className="
        h-16
        md:h-20
        flex
        items-center
        gap-2
        md:gap-4
        px-3
        sm:px-4
        md:px-8
        bg-[#121212]
        sticky
        top-0
        z-30
      "
    >

      {/* ================================================= */}
      {/* DESKTOP BACK / FORWARD */}
      {/* ================================================= */}

      <div className="
        hidden
        md:flex
        items-center
        gap-3
        flex-shrink-0
      ">

        {/* BACK */}

        <button
          type="button"
          onClick={handleBack}
          className="
            w-10
            h-10
            flex
            items-center
            justify-center
            bg-black
            rounded-full
            text-gray-300
            hover:text-white
            hover:bg-[#282828]
            transition
          "
          title="Go Back"
        >
          <ChevronLeft size={22} />
        </button>

        {/* FORWARD */}

        <button
          type="button"
          onClick={handleForward}
          className="
            w-10
            h-10
            flex
            items-center
            justify-center
            bg-black
            rounded-full
            text-gray-300
            hover:text-white
            hover:bg-[#282828]
            transition
          "
          title="Go Forward"
        >
          <ChevronRight size={22} />
        </button>

      </div>

      {/* ================================================= */}
      {/* SEARCH BAR */}
      {/* ================================================= */}

      <form
        onSubmit={handleSearch}
        className="
          flex
          items-center
          bg-white
          text-black
          rounded-full
          h-10
          md:h-11
          px-3
          sm:px-4
          flex-1
          min-w-0
          mx-auto
          md:max-w-xl
        "
      >

        {/* LEFT SEARCH ICON */}

        <Search
          size={18}
          className="
            flex-shrink-0
            text-gray-700
            md:w-5
            md:h-5
          "
        />

        {/* INPUT */}

        <input
          type="text"
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(
              e.target.value
            )
          }
          placeholder="What do you want to play?"
          className="
            flex-1
            min-w-0
            bg-transparent
            outline-none
            ml-2
            sm:ml-3
            text-sm
            md:text-base
            text-black
            placeholder:text-gray-500
          "
        />

        {/* CLEAR BUTTON */}

        {searchQuery && (
          <button
            type="button"
            onClick={
              handleClearSearch
            }
            className="
              w-7
              h-7
              flex
              items-center
              justify-center
              rounded-full
              text-gray-500
              hover:text-black
              hover:bg-gray-200
              transition
              flex-shrink-0
              mr-1
            "
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}

        {/* MOBILE SEARCH BUTTON */}

        <button
          type="submit"
          disabled={!searchQuery.trim()}
          className="
            md:hidden
            w-8
            h-8
            flex
            items-center
            justify-center
            rounded-full
            bg-black
            text-white
            disabled:opacity-30
            disabled:cursor-not-allowed
            transition
            hover:scale-105
            flex-shrink-0
          "
          title="Search"
        >
          <Search size={15} />
        </button>

        {/* DESKTOP SEARCH BUTTON */}

        <button
          type="submit"
          disabled={!searchQuery.trim()}
          className="
            hidden
            md:flex
            w-8
            h-8
            items-center
            justify-center
            rounded-full
            text-gray-600
            hover:bg-gray-200
            hover:text-black
            disabled:opacity-30
            transition
            flex-shrink-0
          "
          title="Search"
        >
          <Search size={17} />
        </button>

      </form>

      {/* ================================================= */}
      {/* USER AREA */}
      {/* ================================================= */}

      <div className="
        flex
        items-center
        ml-1
        md:ml-4
        flex-shrink-0
      ">

        {user ? (

          <button
            type="button"
            onClick={
              handleProfile
            }
            className="
              flex
              items-center
              justify-center
              gap-2
              bg-white
              text-black
              w-9
              h-9
              md:w-auto
              md:h-auto
              md:px-3
              md:py-2
              rounded-full
              hover:scale-105
              transition
            "
            title="Profile"
          >

            {/* AVATAR */}

            <div className="
              w-7
              h-7
              rounded-full
              bg-green-500
              flex
              items-center
              justify-center
              font-bold
              text-sm
              flex-shrink-0
            ">
              {user.name
                ?.charAt(0)
                ?.toUpperCase() ||
                "U"}
            </div>

            {/* NAME DESKTOP */}

            <span className="
              hidden
              lg:block
              font-semibold
              max-w-[120px]
              truncate
            ">
              {user.name}
            </span>

          </button>

        ) : (

          <button
            type="button"
            onClick={
              handleLogin
            }
            className="
              bg-white
              text-black
              px-4
              sm:px-5
              md:px-6
              py-2
              md:py-2.5
              rounded-full
              font-bold
              text-sm
              md:text-base
              hover:scale-105
              transition
            "
          >
            Login
          </button>

        )}

      </div>

    </header>
  );
}

export default Navbar;