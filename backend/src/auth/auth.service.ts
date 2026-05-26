import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RecoverDto } from './dto/recover.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    const passwordHash = user?.password_hash as string | null | undefined;

    if (!user || !passwordHash || !(await bcrypt.compare(dto.password, passwordHash))) {
      throw new UnauthorizedException('Correo o contrasena invalidos.');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roles,
      },
    };
  }

  async recover(dto: RecoverDto) {
    return {
      accepted: true,
      message: `Si ${dto.email} existe, se debe enviar un enlace desde el servicio institucional.`,
    };
  }
}
