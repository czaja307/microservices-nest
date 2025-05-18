import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  healthCheck() {
    return {
      status: 'ok',
      service: 'delivery-service',
      timestamp: new Date().toISOString(),
    };
  }
}
