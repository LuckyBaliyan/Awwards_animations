export const heroImages = Array.from(
      { length: 68 },
      (_, i) => ({
            img: `https://picsum.photos/seed/hero${i}/600/400`,
            id: i + 1,
      })
);