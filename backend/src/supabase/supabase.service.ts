import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  readonly client: SupabaseClient;

  constructor(config: ConfigService) {
    const url = config.get<string>('SUPABASE_URL');
    const key = config.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!url || !key) {
      throw new InternalServerErrorException('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.');
    }

    if (!url.includes('.supabase.co')) {
      throw new InternalServerErrorException(
        'SUPABASE_URL debe ser el Project URL de Supabase, por ejemplo https://xxxxx.supabase.co. No uses la URL del dashboard.',
      );
    }

    this.client = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
}
