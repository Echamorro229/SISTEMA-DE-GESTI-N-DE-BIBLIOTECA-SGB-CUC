import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [SupabaseModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
