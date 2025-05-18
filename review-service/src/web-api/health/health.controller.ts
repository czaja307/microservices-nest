import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  healthCheck() {
    return {
      status: 'ok',
      service: 'review-service',
      timestamp: new Date().toISOString(),
    };
  }
}
