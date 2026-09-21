import { Play } from "lucide-react";

function SongCard({ title, artist, image }) {
  return (
    <div className="bg-[#181818] hover:bg-[#282828] p-4 rounded-lg group cursor-pointer transition">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full aspect-square object-cover rounded-md"
        />

        <button className="absolute bottom-2 right-2 bg-green-500 text-black rounded-full p-3 opacity-0 group-hover:opacity-100 transition">
          <Play fill="black" size={20} />
        </button>
      </div>

      <h3 className="font-semibold mt-4 truncate">
        {title}
      </h3>

      <p className="text-gray-400 text-sm truncate">
        {artist}
      </p>
    </div>
  );
}

export default SongCard;