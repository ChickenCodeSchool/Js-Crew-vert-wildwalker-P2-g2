import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./LittleCard.css";

type CinemaProps = {
  id: number;
  type: "movie" | "tv" | "person";
  title: string;
  vote_average: number;
  release_date: string;
  overview: string;
  poster_path: string;
  isProfilePage?: boolean;
  onRemoveFav?: (id: number) => void;
  onRemoveWatch?: (id: number) => void;
  listType?: "favorites" | "watchlist";
};

function LittleCard({
  id,
  type,
  title,
  vote_average,
  release_date,
  overview,
  poster_path,
  listType,
  onRemoveFav,
  onRemoveWatch,
}: CinemaProps) {
  const navigate = useNavigate();
  const handleSelectMovie = (id: number) => {
    const mediaType = type || "movie";
    navigate(`/films-series/${mediaType}/${id}`);
  };
  const ratingOutOf5 = Math.round((vote_average / 2) * 2) / 2;

  const [favorite, setFavorite] = useState<boolean>(false);

  const getFavorites = () => {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  };

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorite(favs.some((f: CinemaProps) => f.id === id));
  }, [id]);

  const toggleFavorite = () => {
    let favorites = getFavorites();

    const exists = favorites.find((fav: CinemaProps) => fav.id === id);

    if (exists) {
      favorites = favorites.filter((fav: CinemaProps) => fav.id !== id);
    } else {
      favorites.push({
        id,
        type,
        title,
        vote_average,
        release_date,
        overview,
        poster_path,
      });
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

    setFavorite(favorites.some((fav: CinemaProps) => fav.id === id));
  };

  const [watch, setWatch] = useState<boolean>(false);
  const getWatchs = () => {
    return JSON.parse(localStorage.getItem("towatch") || "[]");
  };

  useEffect(() => {
    const watchs = JSON.parse(localStorage.getItem("towatch") || "[]");
    setWatch(watchs.some((w: CinemaProps) => w.id === id));
  }, [id]);

  const toggleWatch = () => {
    let watches = getWatchs();

    const exists = watches.find((fav: CinemaProps) => fav.id === id);

    if (exists) {
      watches = watches.filter((fav: CinemaProps) => fav.id !== id);
    } else {
      watches.push({
        id,
        type,
        title,
        vote_average,
        release_date,
        overview,
        poster_path,
      });
    }

    localStorage.setItem("towatch", JSON.stringify(watches));

    setWatch(watches.some((w: CinemaProps) => w.id === id));
  };

  return (
    <div className="card">
      <div className="card__side card__side--front card__side--front-1">
        <div className="card__description">
          <img
            src={poster_path}
            alt="img-film"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "/images/default-poster.png";
            }}
          />
          <p className="notes-littlecard">⭐ {ratingOutOf5}</p>
          <h2 className="title-littlecard">{title}</h2>
        </div>
      </div>
      <div className="card__side card__side--back card__side--back-1">
        <div className="card__description">
          {listType !== "watchlist" && (
            <button
              className="favorite-btn"
              type="button"
              onClick={() => {
                if (listType === "favorites" && onRemoveFav) {
                  onRemoveFav(id);
                  toggleFavorite();
                }
              }}
            >
              {listType === "favorites" ? "🗑️" : favorite ? "💖" : "🤍"}
            </button>
          )}
          {listType !== "favorites" && (
            <button
              className="watch-btn"
              type="button"
              onClick={() => {
                if (listType === "watchlist" && onRemoveWatch) {
                  onRemoveWatch(id);
                } else {
                  toggleWatch();
                }
              }}
            >
              {listType === "watchlist" ? "🗑️" : watch ? "🤓" : "😑"}
            </button>
          )}
          <p>{overview}</p>
          <p>Date de sortie: {release_date}</p>
          <button
            className="card__side--back button"
            type="button"
            onClick={() => handleSelectMovie(id)}
          >
            Plus d'infos
          </button>
        </div>
      </div>
    </div>
  );
}

export default LittleCard;

//REFACTO
//if isPageProfile --> masquer le button fav/watch selon la liste dans laquelle est le film
