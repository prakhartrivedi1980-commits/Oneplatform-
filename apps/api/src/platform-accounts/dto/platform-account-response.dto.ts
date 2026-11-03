import { Platform } from '@oneplatform/database';

export class PlatformAccountResponseDto {
  id: string;
  platform: Platform;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}
