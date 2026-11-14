import React, { useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import Header from './components/Header.jsx';
import FilmCard from './components/FilmCard.jsx';
import FilmDetail from './components/FilmDetail.jsx';
import { FILMS, getFilmById } from './data/films.js';

/**
 * Reads the initial film identifier from the URL hash if present and valid.
 *
 * @returns {string|null} The valid initial film ID or null for home
 */
function getInitialFilmId() {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.replace('#', '').trim();
  return FILMS.some((film) => film.id === hash) ? hash : null;
}

/**
 * Root Application component orchestrating page transitions using the browser's
 * View Transitions API and React flushSync.
 *
 * @returns {JSX.Element} The rendered React application
 */
export default function App() {
  const [selectedFilmId, setSelectedFilmId] = useState(getInitialFilmId);

  const selectedFilm = selectedFilmId ? getFilmById(selectedFilmId) : null;

  /**
   * Executes a page transition between the Bento Grid and the film detail views.
   * Leverages document.startViewTransition and flushSync to guarantee seamless
   * element-to-element morphing animations matching the native View Transition API behavior.
   *
   * @param {string|null} nextFilmId - Film ID to display, or null to return to home
   * @param {boolean} [pushToHistory=true] - Whether to push a new entry onto browser history
   */
  const navigateWithTransition = useCallback(
    (nextFilmId, pushToHistory = true) => {
      if (nextFilmId === selectedFilmId) return;

      if (pushToHistory) {
        const url = nextFilmId ? `#${nextFilmId}` : window.location.pathname;
        window.history.pushState({ filmId: nextFilmId }, '', url);
      }

      if (!document.startViewTransition) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        setSelectedFilmId(nextFilmId);
        return;
      }

      document.startViewTransition(() => {
        flushSync(() => {
          window.scrollTo({ top: 0, behavior: 'instant' });
          setSelectedFilmId(nextFilmId);
        });
      });
    },
    [selectedFilmId],
  );

  /**
   * Header navigation handler that returns user back to the home grid view.
   */
  const handleGoHome = useCallback(() => {
    navigateWithTransition(null);
  }, [navigateWithTransition]);

  /**
   * Film card selection handler that navigates to the chosen film detail view.
   *
   * @param {string} filmId - The unique identifier of the selected film
   */
  const handleSelectFilm = useCallback(
    (filmId) => {
      navigateWithTransition(filmId);
    },
    [navigateWithTransition],
  );

  /**
   * Synchronizes browser back and forward button navigation with View Transitions.
   */
  useEffect(() => {
    /**
     * Handles popstate events dispatched by browser navigation buttons.
     *
     * @param {PopStateEvent} event - The popstate event
     */
    const handlePopState = (event) => {
      const filmIdFromState = event.state?.filmId;
      const filmIdFromHash = window.location.hash.replace('#', '').trim();
      const targetFilmId = filmIdFromState || (FILMS.some((f) => f.id === filmIdFromHash) ? filmIdFromHash : null);
      navigateWithTransition(targetFilmId, false);
    };

    /**
     * Handles global keyboard shortcuts such as Escape to return to home.
     *
     * @param {KeyboardEvent} event - Keyboard event
     */
    const handleGlobalKeyDown = (event) => {
      if (event.key === 'Escape' && selectedFilmId) {
        navigateWithTransition(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [selectedFilmId, navigateWithTransition]);

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-[#f4f4f2] flex flex-col font-sans">
      <Header onGoHome={handleGoHome} />

      {selectedFilm ? (
        <FilmDetail
          film={selectedFilm}
          onBack={handleGoHome}
        />
      ) : (
        <main className="home grid grid-cols-2 min-[701px]:grid-cols-3 min-[701px]:grid-rows-3 gap-3 h-auto min-[701px]:h-[calc(100svh-58px)] px-5 pb-5">
          {FILMS.map((film) => (
            <FilmCard
              key={film.id}
              film={film}
              onSelect={handleSelectFilm}
            />
          ))}
        </main>
      )}
    </div>
  );
}
