import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';

@Module({
  imports: [SupabaseModule],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}
