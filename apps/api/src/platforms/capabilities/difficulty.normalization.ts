import { Difficulty } from '@oneplatform/database';

export function normalizeDifficulty(rating?: number): Difficulty {
  if (rating === undefined) {
    return Difficulty.UNKNOWN;
  }
  if (rating < 1200) {
    return Difficulty.EASY;
  } else if (rating <= 1599) {
    return Difficulty.MEDIUM;
  } else {
    return Difficulty.HARD;
  }
}