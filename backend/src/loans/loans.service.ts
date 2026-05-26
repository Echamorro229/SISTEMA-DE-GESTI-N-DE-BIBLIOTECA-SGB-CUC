import { Injectable } from '@nestjs/common';
import { throwSupabaseError } from '../common/supabase-error';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateLoanDto } from './dto/create-loan.dto';

@Injectable()
export class LoansService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll() {
    await this.markOverdueLoans();

    const { data, error } = await this.supabase.client
      .from('loans')
      .select('id, due_date, returned_at, status, created_at, users(id, name, email), books(id, title, isbn)')
      .order('created_at', { ascending: false });
    if (error) throwSupabaseError(error);

    return data;
  }

  private async markOverdueLoans() {
    const today = new Date().toISOString().slice(0, 10);
    const { error } = await this.supabase.client
      .from('loans')
      .update({ status: 'Vencido' })
      .lt('due_date', today)
      .eq('status', 'Activo');

    if (error) throwSupabaseError(error);
  }

  async create(dto: CreateLoanDto) {
    const { data, error } = await this.supabase.client.rpc('create_loan', {
      p_user_id: dto.userId,
      p_book_id: dto.bookId,
      p_due_date: dto.dueDate,
    });
    if (error) throwSupabaseError(error);

    return data;
  }

  async returnLoan(id: string) {
    const { data, error } = await this.supabase.client.rpc('return_loan', {
      p_loan_id: id,
    });
    if (error) throwSupabaseError(error);

    return data;
  }
}
