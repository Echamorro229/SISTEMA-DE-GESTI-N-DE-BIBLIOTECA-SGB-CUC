import { Injectable } from '@nestjs/common';
import { throwSupabaseError } from '../common/supabase-error';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(query?: string, availability?: string) {
    let request = this.supabase.client
      .from('books')
      .select('*')
      .order('title', { ascending: true });

    const normalized = query?.trim();
    if (normalized) {
      request = request.or(
        `title.ilike.%${normalized}%,author.ilike.%${normalized}%,isbn.ilike.%${normalized}%,category.ilike.%${normalized}%`,
      );
    }

    if (availability === 'Disponible') {
      request = request.gt('copies', 0);
    }

    if (availability === 'Reservar' || availability === 'Prestado') {
      request = request.eq('copies', 0);
    }

    const { data, error } = await request;
    if (error) throwSupabaseError(error);

    return data;
  }

  async create(dto: CreateBookDto) {
    const { data, error } = await this.supabase.client.from('books').insert(dto).select().single();
    if (error) throwSupabaseError(error);

    return data;
  }

  async update(id: string, dto: UpdateBookDto) {
    const { data, error } = await this.supabase.client
      .from('books')
      .update(dto)
      .eq('id', id)
      .select()
      .single();
    if (error) throwSupabaseError(error);

    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.client.from('books').delete().eq('id', id);
    if (error) throwSupabaseError(error);

    return { deleted: true };
  }
}
