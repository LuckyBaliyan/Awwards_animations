import React from 'react';
import VideoPlayer from './VideoPlayer.jsx';

/**
 * Interactive card component representing a film item in the Bento Grid.
 * Styled with fluid hover transitions and tagged with viewTransitionName
 * to seamlessly morph with the detail hero view.
 *
 * @param {object} props - Component properties
 * @param {object} props.film - Film item containing id, title, videoSrc, fallbackSrc, posterSrc, and gridSpan
 * @param {Function} props.onSelect - Callback invoked when user clicks or selects this card
 * @returns {JSX.Element} The rendered bento film card
 */
export default function FilmCard({ film, onSelect }) {
  /**
   * Handles user click on the card to trigger the view transition into the film hero view.
   *
   * @param {React.MouseEvent<HTMLDivElement>} event - Mouse click event
   */
  const handleClick = (event) => {
    event.preventDefault();
    if (onSelect) {
      onSelect(film.id);
    }
  };

  /**
   * Allows keyboard users to navigate and activate the card using Enter or Space.
   *
   * @param {React.KeyboardEvent<HTMLDivElement>} event - Keyboard event
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (onSelect) {
        onSelect(film.id);
      }
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`View ${film.title}`}
      className={`card film relative overflow-hidden rounded-[16px] bg-[#1a1a1c] cursor-pointer transition-transform duration-700 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.012] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${film.gridSpan}`}
      style={{ viewTransitionName: film.id }}
    >
      <VideoPlayer
        src={film.videoSrc}
        fallbackSrc={film.fallbackSrc}
        poster={film.posterSrc}
        title={film.title}
      />
      <span className="absolute left-4 bottom-3.5 text-[17px] font-medium tracking-[-0.01em] [text-shadow:0_1px_14px_rgba(0,0,0,0.45)] text-[#f4f4f2] pointer-events-none select-none">
        {film.title}
      </span>
    </div>
  );
}
