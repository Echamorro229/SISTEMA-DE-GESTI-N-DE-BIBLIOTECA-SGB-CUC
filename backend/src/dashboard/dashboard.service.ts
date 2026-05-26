import { Injectable } from '@nestjs/common';
import { throwSupabaseError } from '../common/supabase-error';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class DashboardService {
  constructor(private readonly supabase: SupabaseService) {}

  async summary() {
    const { data, error } = await this.supabase.client.rpc('dashboard_summary');
    if (error) throwSupabaseError(error);

    return data;
  }
}
