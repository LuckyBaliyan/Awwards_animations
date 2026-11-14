import React from 'react';
import VideoPlayer from './VideoPlayer.jsx';

/**
 * Detailed film view component featuring an expansive hero video banner,
 * an animated rising title, an accessible circular back navigation button,
 * and an editorial description paragraph.
 *
 * @param {object} props - Component properties
 * @param {object} props.film - Film data object with details to present
 * @param {Function} props.onBack - Callback function to navigate back to the home grid
 * @returns {JSX.Element} The rendered film detail page view
 */
export default function FilmDetail({ film, onBack }) {
  /**
   * Handles user click on the back button to return to the home screen.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} event - The click event
   */
  const handleBackClick = (event) => {
    event.preventDefault();
    if (onBack) {
      onBack();
    }
  };

  /**
   * Keyboard listener allowing keyboard users to trigger back navigation using Escape, Space, or Enter.
   *
   * @param {React.KeyboardEvent<HTMLButtonElement>} event - The keyboard event
   */
  const handleBackKeyDown = (event) => {
    if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (onBack) {
        onBack();
      }
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero section linked to the View Transition API with identical viewTransitionName */}
      <div
        className="hero film relative h-[72svh] min-[701px]:h-[calc(100svh-78px)] mx-5 overflow-hidden rounded-[16px] bg-[#1a1a1c]"
        style={{ viewTransitionName: film.id }}
      >
        <VideoPlayer
          src={film.videoSrc}
          fallbackSrc={film.fallbackSrc}
          poster={film.posterSrc}
          title={film.title}
        />

        {/* Back navigation circular glass button */}
        <button
          type="button"
          onClick={handleBackClick}
          onKeyDown={handleBackKeyDown}
          aria-label="Back to all films"
          className="back absolute z-10 top-[18px] left-[18px] grid place-items-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-[14px] text-[21px] text-white hover:bg-white/30 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16 10H4M9 5l-5 5 5 5" />
          </svg>
        </button>

        {/* Subtle bottom shadow overlay to ensure high contrast for the title */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 via-black/20 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Big film title animated via ::view-transition-new(title) rise keyframes */}
        <h1
          className="absolute z-10 left-[22px] bottom-[6px] pb-[0.1em] text-[clamp(72px,16vw,300px)] font-medium leading-[0.95] tracking-[-0.04em] text-[#f4f4f2] select-none pointer-events-none"
          style={{ viewTransitionName: 'title' }}
        >
          {film.title}
        </h1>
      </div>

      {/* Editorial text description below the hero */}
      <p className="about max-w-[22em] pt-[110px] px-[42px] pb-[140px] text-[clamp(28px,4vw,60px)] leading-[1.08] tracking-[-0.03em] font-normal text-[#f4f4f2]">
        {film.description}
      </p>
    </main>
  );
}
