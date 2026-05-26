import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { throwSupabaseError } from '../common/supabase-error';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabase.client
      .from('users')
      .select('id, name, email, created_at, roles(id, name)')
      .order('name');
    if (error) throwSupabaseError(error);

    return data;
  }

  async create(dto: CreateUserDto) {
    const { data, error } = await this.supabase.client
      .from('users')
      .insert({
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        role_id: dto.roleId,
        password_hash: dto.password ? await bcrypt.hash(dto.password, 10) : null,
      })
      .select('id, name, email, created_at, roles(id, name)')
      .single();
    if (error) throwSupabaseError(error);

    return data;
  }

  async findByEmail(email: string) {
    const { data, error } = await this.supabase.client
      .from('users')
      .select('id, name, email, password_hash, created_at, roles(id, name)')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();
    if (error) throwSupabaseError(error);

    return data;
  }

  async updatePassword(id: string, password: string) {
    const { data, error } = await this.supabase.client
      .from('users')
      .update({ password_hash: await bcrypt.hash(password, 10) })
      .eq('id', id)
      .select('id, name, email, created_at, roles(id, name)')
      .single();
    if (error) throwSupabaseError(error);

    return data;
  }
}
