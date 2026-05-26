import { Injectable } from '@nestjs/common';
import { throwSupabaseError } from '../common/supabase-error';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabase.client
      .from('reservations')
      .select('id, position, status, created_at, users(id, name, email), books(id, title, isbn)')
      .order('created_at', { ascending: false });
    if (error) throwSupabaseError(error);

    return data;
  }

  async create(dto: CreateReservationDto) {
    const { data, error } = await this.supabase.client.rpc('create_reservation', {
      p_user_id: dto.userId,
      p_book_id: dto.bookId,
    });
    if (error) throwSupabaseError(error);

    return data;
  }

  async confirm(id: string) {
    const { data, error } = await this.supabase.client.rpc('confirm_reservation', {
      p_reservation_id: id,
    });
    if (error) throwSupabaseError(error);

    return data;
  }
}
