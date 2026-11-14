import React from 'react';

/**
 * Top navigation header component displaying the brand logo and project title.
 * Provides a clickable home link that triggers the view transition back to the main grid.
 *
 * @param {object} props - Component properties
 * @param {Function} props.onGoHome - Callback function invoked when user clicks the logo
 * @returns {JSX.Element} The rendered header element
 */
export default function Header({ onGoHome }) {
  /**
   * Handles user click on the header logo link.
   * Prevents default anchor navigation and triggers smooth SPA transition back to home.
   *
   * @param {React.MouseEvent<HTMLAnchorElement>} event - The mouse click event
   */
  const handleLogoClick = (event) => {
    event.preventDefault();
    if (onGoHome) {
      onGoHome();
    }
  };

  return (
    <header className="flex items-center justify-between px-5 py-[18px] text-[17px] tracking-[-0.01em]">
      <a
        href="#"
        onClick={handleLogoClick}
        className="font-medium text-[#f4f4f2] hover:opacity-80 transition-opacity cursor-pointer"
        aria-label="Return to colour studies home"
      >
        DiMaac
      </a>
      <span className="text-[#f4f4f2] opacity-55 select-none">
        Colour studies
      </span>
    </header>
  );
}

