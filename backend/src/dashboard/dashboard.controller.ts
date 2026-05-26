import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  root() {
    return {
      ok: true,
      service: 'sgb-cuc-backend',
      message: 'API activa. Usa /api/health para verificar el backend.',
    };
  }

  @Get('health')
  health() {
    return { ok: true, service: 'sgb-cuc-backend' };
  }

  @Get('dashboard')
  summary() {
    return this.dashboardService.summary();
  }
}
