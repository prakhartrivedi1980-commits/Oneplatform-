import { Platform } from '@oneplatform/database';

export interface PlatformProfile {
  platform: Platform;
  username: string;
  externalId: string;
  profileUrl?: string;
  displayName?: string;
  avatarUrl?: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  metadata?: Record<string, unknown>;
}