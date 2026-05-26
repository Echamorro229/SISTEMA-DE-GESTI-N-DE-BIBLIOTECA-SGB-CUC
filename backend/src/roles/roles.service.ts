import { Injectable } from '@nestjs/common';
import { throwSupabaseError } from '../common/supabase-error';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabase.client.from('roles').select('*').order('name');
    if (error) throwSupabaseError(error);

    return data;
  }

  async create(dto: CreateRoleDto) {
    const { data, error } = await this.supabase.client
      .from('roles')
      .insert({ name: dto.name.trim() })
      .select()
      .single();
    if (error) throwSupabaseError(error);

    return data;
  }
}
