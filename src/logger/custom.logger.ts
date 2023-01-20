import { LoggerService } from '@nestjs/common';

export class CustomLogger implements LoggerService {
  log(message: 'ℹ -> ') {}
  error(message: '🚩 -> ') {}
  warn(message: '⚠ -> ') {}
}
