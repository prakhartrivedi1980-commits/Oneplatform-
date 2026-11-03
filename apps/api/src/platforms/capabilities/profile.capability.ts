import { PlatformProfile } from '../types/platform-profile.interface';

export interface ProfileCapability {
  fetchProfile(username: string): Promise<PlatformProfile>;
}