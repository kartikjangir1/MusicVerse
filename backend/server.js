const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.join(__dirname, ".env"),
});

const app = express();

app.use(cors());
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
app.use(express.json());

// ======================================================
// CONFIG
// ======================================================

const PORT = process.env.PORT || 5000;

// Cache lifetime: 30 minutes
const CACHE_TTL = 30 * 60 * 1000;

// Maximum cached searches
const MAX_CACHE_SIZE = 100;

// ======================================================
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
// IN-MEMORY CACHE
// ======================================================

const searchCache = new Map();

// Track requests currently running
// Prevents multiple identical YouTube API requests
const pendingRequests = new Map();

// ======================================================
// CACHE HELPERS
// ======================================================

function normalizeQuery(query) {
  return query
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function getCachedResult(query) {
  const key = normalizeQuery(query);

  const cached = searchCache.get(key);

  if (!cached) {
    return null;
  }

  const age = Date.now() - cached.timestamp;

  // Cache expired
  if (age > CACHE_TTL) {
    searchCache.delete(key);
    return null;
  }

  return cached.data;
}

function setCachedResult(query, data) {
  const key = normalizeQuery(query);

  // Remove oldest cache entry if limit reached
  if (
    searchCache.size >= MAX_CACHE_SIZE &&
    !searchCache.has(key)
  ) {
    const oldestKey =
      searchCache.keys().next().value;

    if (oldestKey) {
      searchCache.delete(oldestKey);
    }
  }

  searchCache.set(key, {
    timestamp: Date.now(),
    data,
  });
}


const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    likedSongs: { type: Array, default: [] },
    recentlyPlayed: { type: Array, default: [] },
    playlists: { type: Array, default: [] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

function createToken(user) {
  return jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: "7d" });
}

function publicUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email };
}

async function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Authentication required." });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(payload.id);
    if (!req.user) return res.status(401).json({ message: "User not found." });
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session." });
  }
}
// ======================================================
// ROOT
// ======================================================

app.get("/", (req, res) => {
  res.json({
    message: "MusicVerse API is running",
  });
});

// ======================================================
// CACHE STATUS
// ======================================================

app.get("/api/cache-status", (req, res) => {
  const cache = [];

  for (const [query, value] of searchCache.entries()) {
    const age = Date.now() - value.timestamp;

    cache.push({
      query,
      ageSeconds: Math.floor(age / 1000),
      expiresInSeconds: Math.max(
        0,
        Math.floor(
          (CACHE_TTL - age) / 1000
        )
      ),
      results: value.data.length,
    });
  }

  res.json({
    cacheSize: searchCache.size,
    pendingRequests: pendingRequests.size,
    cacheTTLMinutes: CACHE_TTL / 60000,
    cache,
  });
});

// ======================================================
// CLEAR CACHE
// ======================================================

app.post("/api/cache-clear", (req, res) => {
  searchCache.clear();

  res.json({
    success: true,
    message: "Search cache cleared",
  });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!name?.trim() || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
    });
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Unable to create account." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email?.trim().toLowerCase() });
    const valid = user && await bcrypt.compare(req.body.password || "", user.password);
    if (!valid) return res.status(401).json({ message: "Invalid email or password." });
    return res.json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Unable to login." });
  }
});

app.get("/api/auth/me", authenticate, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

app.patch("/api/auth/profile", authenticate, async (req, res) => {
  const name = req.body.name?.trim();
  if (!name) return res.status(400).json({ message: "Name cannot be empty." });
  req.user.name = name;
  await req.user.save();
  res.json({ user: publicUser(req.user) });
});

app.delete("/api/auth/account", authenticate, async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.json({ success: true });
});

app.get("/api/user/data", authenticate, (req, res) => {
  res.json({ likedSongs: req.user.likedSongs, recentlyPlayed: req.user.recentlyPlayed, playlists: req.user.playlists });
});

app.put("/api/user/data", authenticate, async (req, res) => {
  const { likedSongs, recentlyPlayed, playlists } = req.body;
  req.user.likedSongs = Array.isArray(likedSongs) ? likedSongs : [];
  req.user.recentlyPlayed = Array.isArray(recentlyPlayed) ? recentlyPlayed : [];
  req.user.playlists = Array.isArray(playlists) ? playlists : [];
  await req.user.save();
  res.json({ success: true });
});

// ======================================================
// API KEY STATUS
// ======================================================

app.get("/api/key-status", (req, res) => {
  const key =
    process.env.YOUTUBE_API_KEY || "";

  res.json({
    exists: Boolean(key),
    length: key.length,
    prefix: key
      ? `${key.substring(0, 4)}****`
      : null,
  });
});

// ======================================================
// SEARCH YOUTUBE
// ======================================================

app.get("/api/search", async (req, res) => {
  const query = req.query.q;

  console.log("\n==============================");
  console.log("Search query:", query);
  console.log(
    "YouTube key exists:",
    Boolean(process.env.YOUTUBE_API_KEY)
  );
  console.log("==============================");

  try {
    // ==================================================
    // VALIDATE QUERY
    // ==================================================

    if (!query || !query.trim()) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const normalizedQuery =
      normalizeQuery(query);

    // ==================================================
    // CHECK CACHE
    // ==================================================

    const cachedResult =
      getCachedResult(
        normalizedQuery
      );

    if (cachedResult) {
      console.log(
        "✅ CACHE HIT:",
        normalizedQuery
      );

      return res.json(cachedResult);
    }

    console.log(
      "❌ CACHE MISS:",
      normalizedQuery
    );

    // ==================================================
    // CHECK IF SAME REQUEST ALREADY RUNNING
    // ==================================================

    if (
      pendingRequests.has(
        normalizedQuery
      )
    ) {
      console.log(
        "⏳ WAITING FOR EXISTING REQUEST:",
        normalizedQuery
      );

      try {
        const result =
          await pendingRequests.get(
            normalizedQuery
          );

        return res.json(result);
      } catch (error) {
        return res.status(
          error.response?.status || 500
        ).json({
          message:
            "Failed to search YouTube",
          error:
            error.response?.data?.error
              ?.message ||
            error.message,
          code:
            error.response?.data?.error
              ?.code || null,
        });
      }
    }

    // ==================================================
    // VALIDATE API KEY
    // ==================================================

    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(500).json({
        message:
          "YOUTUBE_API_KEY is missing in backend/.env",
      });
    }

    // ==================================================
    // CREATE ONE SHARED REQUEST
    // ==================================================

    const apiRequest = (async () => {
      try {
        // ==============================================
        // STEP 1: YOUTUBE SEARCH
        // ==============================================

        const searchResponse =
          await axios.get(
            "https://www.googleapis.com/youtube/v3/search",
            {
              params: {
                part: "snippet",

                q: `${normalizedQuery} song`,

                type: "video",

                videoCategoryId: "10",

                // Lower to reduce unnecessary quota use
                maxResults: 20,

                regionCode: "IN",

                relevanceLanguage: "hi",

                key:
                  process.env
                    .YOUTUBE_API_KEY,
              },

              timeout: 15000,
            }
          );

        console.log(
          "YouTube search results:",
          searchResponse.data.items
            ?.length || 0
        );

        // ==============================================
        // GET VIDEO IDS
        // ==============================================

        const videoIds =
          searchResponse.data.items
            ?.map(
              (item) =>
                item.id?.videoId
            )
            .filter(Boolean) || [];

        if (videoIds.length === 0) {
          const emptyResult = [];

          setCachedResult(
            normalizedQuery,
            emptyResult
          );

          return emptyResult;
        }

        // ==============================================
        // STEP 2: GET VIDEO DETAILS
        // ==============================================

        const videoResponse =
          await axios.get(
            "https://www.googleapis.com/youtube/v3/videos",
            {
              params: {
                part:
                  "contentDetails,snippet",

                id: videoIds.join(","),

                key:
                  process.env
                    .YOUTUBE_API_KEY,
              },

              timeout: 15000,
            }
          );

        console.log(
          "Video details received:",
          videoResponse.data.items
            ?.length || 0
        );

        // ==============================================
        // STEP 3: FILTER + FORMAT
        // ==============================================

        const songs = (
          videoResponse.data.items ||
          []
        )
          .filter((video) => {
            const title =
              video.snippet?.title
                ?.toLowerCase() || "";

            // Remove Shorts
            if (
              title.includes("#shorts") ||
              title.includes("#short") ||
              title.includes("shorts")
            ) {
              return false;
            }

            // Parse ISO 8601 duration
            const duration =
              video.contentDetails
                ?.duration || "";

            const match =
              duration.match(
                /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
              );

            const hours = Number(
              match?.[1] || 0
            );

            const minutes = Number(
              match?.[2] || 0
            );

            const seconds = Number(
              match?.[3] || 0
            );

            const totalSeconds =
              hours * 3600 +
              minutes * 60 +
              seconds;

            // Remove very short clips
            return totalSeconds > 60;
          })
          .map((video) => ({
            id: video.id,

            title:
              video.snippet?.title ||
              "",

            artist:
              video.snippet
                ?.channelTitle || "",

            image:
              video.snippet?.thumbnails
                ?.high?.url ||
              video.snippet?.thumbnails
                ?.medium?.url ||
              video.snippet?.thumbnails
                ?.default?.url ||
              "",

            description:
              video.snippet
                ?.description || "",

            publishedAt:
              video.snippet
                ?.publishedAt || "",
          }));

        console.log(
          "Final songs:",
          songs.length
        );

        // ==============================================
        // SAVE TO CACHE
        // ==============================================

        setCachedResult(
          normalizedQuery,
          songs
        );

        return songs;
      } catch (error) {
        console.error(
          "\n================================"
        );
        console.error(
          "YOUTUBE API ERROR"
        );
        console.error(
          "================================"
        );

        console.error(
          "STATUS:",
          error.response?.status
        );

        console.error(
          "CODE:",
          error.response?.data?.error
            ?.code
        );

        console.error(
          "MESSAGE:",
          error.response?.data?.error
            ?.message
        );

        console.error(
          "================================\n"
        );

        throw error;
      }
    })();

    // Save pending request
    pendingRequests.set(
      normalizedQuery,
      apiRequest
    );

    try {
      const result =
        await apiRequest;

      return res.json(result);
    } catch (error) {
      return res.status(
        error.response?.status || 500
      ).json({
        message:
          "Failed to search YouTube",

        error:
          error.response?.data?.error
            ?.message ||
          error.message,

        code:
          error.response?.data?.error
            ?.code || null,

        status:
          error.response?.status ||
          500,
      });
    } finally {
      // Remove pending request
      pendingRequests.delete(
        normalizedQuery
      );
    }
  } catch (error) {
    console.error(
      "SEARCH ROUTE ERROR:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

async function startServer() {
  if (!MONGODB_URI || !JWT_SECRET) {
    throw new Error("MONGODB_URI and JWT_SECRET are required in backend/.env");
  }
  await mongoose.connect(MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
    console.log(`Cache TTL: ${CACHE_TTL / 60000} minutes`);
  });
}

startServer().catch((error) => {
  console.error("SERVER START ERROR:", error.message);
  process.exit(1);
});