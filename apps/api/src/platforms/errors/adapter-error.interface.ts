export enum AdapterErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  UPSTREAM_UNAVAILABLE = 'UPSTREAM_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

export class AdapterError extends Error {
  public readonly code: AdapterErrorCode;
  public readonly isRetryable: boolean;
  public readonly isSafeToExpose: boolean;

  constructor(params: {
    code: AdapterErrorCode;
    message: string;
    isRetryable: boolean;
    isSafeToExpose: boolean;
  }) {
    super(params.message);
    this.name = 'AdapterError';
    this.code = params.code;
    this.isRetryable = params.isRetryable;
    this.isSafeToExpose = params.isSafeToExpose;
  }
}
