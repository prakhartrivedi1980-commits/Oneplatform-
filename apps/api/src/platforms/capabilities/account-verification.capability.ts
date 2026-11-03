import { PlatformProfile } from '../types/platform-profile.interface';

export interface AccountVerificationCapability {
  verifyAccount(username: string): Promise<PlatformProfile>;
}