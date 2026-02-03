// Производится основная работа
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthInput } from './auth.input';
import { hash, verify } from 'argon2';
import { TAuthTokenData } from './auth.interface';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { isDev } from 'src/utils/is-dev.utils';
import { Pick } from '@prisma/client/runtime/client';

@Injectable()
export class AuthService {
  constructor (
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwt: JwtService,
    private usersService: UsersService
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
          password: (await hash(input.password))  //* Хэширование пароля Argon2
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

  async login(input: AuthInput) {
    const user = await this.validateUser(input)

    const tokens = this.generateTokens({
      id: user.id,
      role: user.role 
    })
    
    return { user, ...tokens }
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync<Pick<TAuthTokenData, 'id'>>(refreshToken)
    if (!result) throw new BadRequestException('Недействительный токен обновления')
    
    const user = await this.usersService.findById(result.id)

    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }

    const tokens = this.generateTokens({
      id: user.id,
      role: user.role
    })

    return {
      user,
      ...tokens
    }
  }

  private async validateUser(input: AuthInput){
    const email = input.email

    const user = await this.usersService.findByEmail(email)
    if (!user) {
      throw new NotFoundException('Неверный адрес электронной почты или пароль')
    }

    const isPasswordValid = await verify(user.password, input.password)

    if (!isPasswordValid) {
      throw new NotFoundException('Неверный адрес электронной почты или пароль')
    }

    return user
  }

  private generateTokens(data: TAuthTokenData){
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
//* Добавление куки
  toggleRefreshTokenCookie(response: Response, token: string | null) {
    const isRemoveCookie = !token

    const experiesIn = isRemoveCookie 
    ? new Date(0) 
    : new Date(
      Date.now() + this.EXPIRE_DAY_REFRESH_TOKEN * 24* 60 * 60 * 1000
    )

//* Удаление куки
    response.cookie(this.REFRESH_TOKEN_NAME, token || '', {
      httpOnly: true,
      domain: 'localhost', 
      expires: experiesIn,
      sameSite: isDev(this.configService) ? 'none' : 'strict', 
      secure: true  
    })
  }


}
