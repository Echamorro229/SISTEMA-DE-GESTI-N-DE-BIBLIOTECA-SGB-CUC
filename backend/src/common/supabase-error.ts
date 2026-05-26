import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PostgrestError } from '@supabase/supabase-js';

export function throwSupabaseError(error: PostgrestError | null): never {
  if (error?.code === 'PGRST116') {
    throw new NotFoundException('Recurso no encontrado.');
  }

  throw new BadRequestException(error?.message ?? 'Operacion rechazada por la base de datos.');
}
