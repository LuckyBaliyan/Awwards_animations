/**
 * Synchronizes the playback time of a HTML5 video element with universal epoch time.
 * This guarantees that whether the video is viewed in a home grid card or an expanded hero,
 * playback continues uninterrupted from the exact same frame without stutter.
 *
 * @param {HTMLVideoElement|null} video - The HTML video element to synchronize
 */
export function syncVideo(video) {
  if (!video || !video.duration || Number.isNaN(video.duration) || video.duration <= 0) {
    return;
  }
  const targetCurrentTime = (Date.now() / 1000) % video.duration;
  // Apply update if current time has drifted away from the calculated epoch position
  if (Math.abs(video.currentTime - targetCurrentTime) > 0.35) {
    video.currentTime = targetCurrentTime;
  }
}

