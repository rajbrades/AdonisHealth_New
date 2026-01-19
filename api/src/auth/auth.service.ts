import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, dob, gender } = registerDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and profile transaction
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'PATIENT',
        patientProfile: {
          create: {
            firstName,
            lastName,
            dob: new Date(dob),
            gender,
            goals: {
              create: [
                ...(registerDto.goals || []).map(g => ({ type: 'SHORT_TERM', description: g, status: 'ACTIVE' })),
                ...(registerDto.symptoms || []).map(s => ({ type: 'SYMPTOM', description: s, status: 'ACTIVE' }))
              ]
            }
          },
        },
      },
    });

    return this.login({ email, password });
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) { // Or pass user object directly
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    };
  }
}
