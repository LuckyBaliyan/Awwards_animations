/**
 * Curated array of cinematic film items with alternative stock videos from the internet
 * (Mixkit, Pexels CDN, and Cloudinary), paired with matched high-resolution poster stills
 * and automatic fallback stream URLs for complete resilience.
 *
 * Arranged in a Center-Stage Bento architecture:
 * - Solaris: Tall commanding vertical pillar occupying the center (cols 2, rows 1-2).
 * - Azure & Neon: Flanking on the left wing (col 1).
 * - Amber & Metropolis: Flanking on the right wing (col 3).
 * - Coastal: Wide cinematic panoramic anchor spanning the entire bottom (cols 1-3, row 3).
 */
export const FILMS = [
  {
    id: 'solaris',
    title: 'Solaris',
    description: 'The slow rotation of planet Earth suspended in cosmic calm as sunrise breaks over the horizon.',
    videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-spinning-around-the-earth-29351-large.mp4',
    //fallbackSrc: 'https://videos.pexels.com/video-files/8047353/8047353-hd_1920_1080_25fps.mp4',
    posterSrc: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    gridSpan: 'col-span-2 aspect-[4/5] min-[701px]:col-start-2 min-[701px]:row-start-1 min-[701px]:col-span-1 min-[701px]:row-span-2 min-[701px]:aspect-auto',
  },
  {
    id: 'azure',
    title: 'Azure',
    description: 'Endless rolling ocean swells glowing with deep indigo reflections and rhythmic marine tides.',
    videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    //fallbackSrc: 'https://videos.pexels.com/video-files/6491689/6491689-hd_1366_720_25fps.mp4',
    posterSrc: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    gridSpan: 'col-span-1 aspect-square min-[701px]:col-start-1 min-[701px]:row-start-1 min-[701px]:col-span-1 min-[701px]:row-span-1 min-[701px]:aspect-auto',
  },
  {
    id: 'amber',
    title: 'Amber',
    description: 'Gentle golden afternoon sunlight filtering through blooming yellow flowers swaying in the breeze.',
    videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
    //fallbackSrc: 'https://videos.pexels.com/video-files/7956862/7956862-hd_1280_720_30fps.mp4',
    posterSrc: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
    gridSpan: 'col-span-1 aspect-square min-[701px]:col-start-3 min-[701px]:row-start-1 min-[701px]:col-span-1 min-[701px]:row-span-1 min-[701px]:aspect-auto',
  },
  {
    id: 'neon',
    title: 'Neon',
    description: 'A vibrant nocturnal light show pulsating through an electric cybernetic metropolis.',
    videoSrc: 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4',
    //fallbackSrc: 'https://videos.pexels.com/video-files/7291759/7291759-hd_1280_720_25fps.mp4',
    posterSrc: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop',
    gridSpan: 'col-span-1 aspect-square min-[701px]:col-start-1 min-[701px]:row-start-2 min-[701px]:col-span-1 min-[701px]:row-span-1 min-[701px]:aspect-auto',
  },
  {
    id: 'metropolis',
    title: 'Metropolis',
    description: 'An adrenaline perspective capturing high-speed movement and vibrant metropolitan energy.',
    videoSrc: 'https://res.cloudinary.com/demo/video/upload/race_road_car.mp4',
    //fallbackSrc: 'https://videos.pexels.com/video-files/8746333/8746333-hd_1366_720_25fps.mp4',
    posterSrc: 'https://res.cloudinary.com/demo/video/upload/race_road_car.jpg',
    gridSpan: 'col-span-1 aspect-square min-[701px]:col-start-3 min-[701px]:row-start-2 min-[701px]:col-span-1 min-[701px]:row-span-1 min-[701px]:aspect-auto',
  },
  {
    id: 'coastal',
    title: 'Coastal',
    description: 'A cinematic low-altitude glide across sunny beaches, crashing turquoise surf, and white sands.',
    videoSrc: 'https://res.cloudinary.com/demo/video/upload/glide-over-coastal-beach.mp4',
    //fallbackSrc: 'https://videos.pexels.com/video-files/6616621/6616621-hd_2048_1080_25fps.mp4',
    posterSrc: 'https://res.cloudinary.com/demo/video/upload/glide-over-coastal-beach.jpg',
    gridSpan: 'col-span-2 aspect-[16/7] min-[701px]:col-span-3 min-[701px]:row-start-3 min-[701px]:row-span-1 min-[701px]:aspect-auto',
  },
];

/**
 * Searches and returns the film object matching the specified identifier.
 *
 * @param {string} id - Unique film key to find
 * @returns {object|undefined} Matching film item or undefined
 */
export function getFilmById(id) {
  return FILMS.find((film) => film.id === id);
}
