import React, { useEffect, useRef } from 'react';
import { syncVideo } from '../utils/videoSync.js';

/**
 * Autoplay looping video component with synchronized timing, poster fallback,
 * and automatic failover handling for internet video streams.
 *
 * @param {object} props - Component properties
 * @param {string} props.src - Primary URL source of the MP4 video file
 * @param {string} [props.fallbackSrc] - Optional fallback URL source if primary fails
 * @param {string} props.poster - URL path to the static poster image
 * @param {string} props.title - Accessible description of the video content
 * @param {string} [props.className] - Optional additional CSS class names
 * @returns {JSX.Element} The rendered HTML5 video element
 */
export default function VideoPlayer({ src, fallbackSrc, poster, title, className = '' }) {
  const videoRef = useRef(null);

  /**
   * Event handler called as soon as video duration and metadata have loaded.
   * Immediately synchronizes playback time with the universal epoch timeline.
   *
   * @param {React.SyntheticEvent<HTMLVideoElement>} event - The loadedmetadata event
   */
  const handleLoadedMetadata = (event) => {
    syncVideo(event.currentTarget);
  };

  /**
   * Failover error handler that seamlessly switches to a fallback stream
   * if the primary remote video source fails to load or times out.
   *
   * @param {React.SyntheticEvent<HTMLVideoElement>} event - The error event
   */
  const handleVideoError = (event) => {
    const video = event.currentTarget;
    if (fallbackSrc && video.src !== fallbackSrc) {
      video.src = fallbackSrc;
      video.load();
      video.play().catch(() => {
        // Fallback playback handled
      });
    }
  };

  /**
   * Sets up component lifecycle listeners to synchronize playback on mount,
   * resume playback if paused, and re-sync whenever browser tab visibility changes.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Explicitly guarantee muted state for autoplay compliance across browsers
    video.muted = true;

    // Synchronize if duration is already available
    if (video.readyState >= 1) {
      syncVideo(video);
    }

    // Attempt video playback
    video.play().catch(() => {
      // Handled silently if browser delays autoplay
    });

    /**
     * Re-synchronizes video timing when the user switches tabs or returns to the window.
     */
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && videoRef.current) {
        syncVideo(videoRef.current);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      title={title}
      autoPlay
      muted
      loop
      playsInline
      onLoadedMetadata={handleLoadedMetadata}
      onError={handleVideoError}
      className={`block w-full h-full object-cover ${className}`}
    />
  );
}
