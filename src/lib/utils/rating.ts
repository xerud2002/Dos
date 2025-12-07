// Rating color utilities - matching the original daiostea.ro design
export const ratingColors = {
  1: '#ef4444', // roșu (red)
  2: '#f97316', // portocaliu (orange)
  3: '#facc15', // galben (yellow)
  4: '#10b981', // verde smarald (emerald)
  5: '#06b6d4', // turcoaz (turquoise)
} as const;

export const ratingLabels = {
  1: 'Foarte slab',
  2: 'Slab',
  3: 'Acceptabil',
  4: 'Bun',
  5: 'Excelent',
} as const;

export const getRatingColor = (rating: number): string => {
  const roundedRating = Math.round(rating) as keyof typeof ratingColors;
  return ratingColors[roundedRating] || ratingColors[1];
};

export const getRatingLabel = (rating: number): string => {
  const roundedRating = Math.round(rating) as keyof typeof ratingLabels;
  return ratingLabels[roundedRating] || '';
};

export const getRatingIconName = (rating: number): string => {
  const roundedRating = Math.round(rating);
  switch (roundedRating) {
    case 5: return 'ico-turquoise.png';
    case 4: return 'ico-emerald.png';
    case 3: return 'ico-yellow.png';
    case 2: return 'ico-orange.png';
    default: return 'ico-red.png';
  }
};
