import StarRating from "./StarRating";
import { useState } from "react";
import { useEffect } from "react";
import Loader from "./Loader";
import { API_KEY } from "../config";

const KEY = API_KEY;

export default function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  console.log(title, year);

  useEffect(function() {
    function callback(e) {
      if (e.key === "Escape") {
        onCloseMovie();
      }
    }
    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, [onCloseMovie]);

  function handleAddWatched() {
    const newWatchedMovie ={
      imdbID: selectedId,
      title,
      year,
      poster,
      runtime: runtime.split(" ").at(0),
      imbdRating: Number(imdbRating),
      userRating,
    }
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(function() {
    if (!title) return;
    document.title = `Movie | ${title}`;
    return () => document.title = "usePopcorn";
  }, [title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              ←
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>
          <section>
        
              <div className="rating">
              {!isWatched ? (
                <>
                          <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                          {userRating > 0 && <button className="btn-add" onClick={() => handleAddWatched()}>
                          + Add to watched list
                          </button>}
                </>
                  ) : (
                    <p>
                      You rated this movie {watchedUserRating} ⭐
                    </p>
                  )}
              </div>
          
          </section>
          <section>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
