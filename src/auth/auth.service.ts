// Производится основная работа
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthInput } from './auth.input';
import { hash } from 'argon2';
import { IAuthTokenData } from './auth.interface';

@Injectable()
export class AuthService {
  constructor (
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwt: JwtService
  ){}

  private EXPIRE_DAY_REFRESH_TOKEN = 3;
  REFRESH_TOKEN_NAME = 'refreshToken'

//* Регистрация пользователя 
  async register (input: AuthInput) {
    try {
      const email = input.email.toLowerCase()  // Проверка на уникальность пользователя (единственный)
      const existingUser = await this.prisma.user.findFirst({ // Проверка на уникальность пользователя по email
        where: { 
          email: {
            equals: email,
            mode: 'insensitive'
          } 
        }
      })

//* Проверка уникальности email адреса при регистрации 
      if (existingUser) {
        throw new BadRequestException('Пользователь с таким email уже существует')
      }

//* Авторизация пользователя   
      const user = await this.prisma.user.create ({
        data: {
          email: email,
          pasword: (await hash(input.password))  //* Хэширование пароля Argon2
        }
      })

      const tokens = this.generateTokens({
        id: user.id,
        role: user.role
      })
      
      return { user, ...tokens }
    } catch (error) {
      throw new BadRequestException('Регистрация не удалась' + error)
    }
  }

  private async generateTokens(data: IAuthTokenData){
    const accessToken = this.jwt.sign(data, {   // Токен доступа
      expiresIn: '1h'
    })
    const refreshToken = this.jwt.sign({        // Токен обновления
      id: data.id
    }, {  
      expiresIn: `${this.EXPIRE_DAY_REFRESH_TOKEN}d`
    })

    return { accessToken, refreshToken }
  }
}
