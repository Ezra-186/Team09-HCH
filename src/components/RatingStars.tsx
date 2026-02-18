import styles from './RatingStars.module.css';

type RatingStarsProps = {
  rating: number;
  count?: number;
};

const MAX_STARS = 5;

export default function RatingStars({ rating, count }: RatingStarsProps) {
  const displayRating = Number.isFinite(rating) ? Math.max(0, Math.min(MAX_STARS, rating)) : 0;
  const filledStar = '\u2605';
  const emptyStar = '\u2606';

  return (
    <div
      className={styles.wrapper}
      role="img"
      aria-label={
        count && count > 0
          ? `Rated ${displayRating.toFixed(1)} out of 5 from ${count} review${count === 1 ? '' : 's'}`
          : `Rated ${displayRating.toFixed(1)} out of 5`
      }
    >
      <span className={styles.stars} aria-hidden="true">
        {Array.from({ length: MAX_STARS }, (_, index) => {
          const starValue = index + 1;
          const isFilled = displayRating >= starValue - 0.25;
          return (
            <span key={starValue} className={isFilled ? styles.filled : styles.empty}>
              {isFilled ? filledStar : emptyStar}
            </span>
          );
        })}
      </span>
      <span className={styles.label}>
        {count !== undefined ? `${displayRating.toFixed(1)} (${count})` : displayRating.toFixed(1)}
      </span>
    </div>
  );
}
