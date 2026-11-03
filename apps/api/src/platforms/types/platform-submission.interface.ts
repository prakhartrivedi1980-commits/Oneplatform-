import { Platform, SubmissionStatus } from '@oneplatform/database';

export interface PlatformSubmission {
  externalSubmissionId: string;
  platform: Platform;
  problemExternalId: string;
  problemName: string;
  problemUrl?: string;
  problemRating?: number;
  problemTags: string[];
  status: SubmissionStatus;
  language?: string;
  submittedAt: Date;
}