// Получаем - отправляем
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthInput } from './auth.input';
import { AuthResponse } from './auth.interface';
import type { IGqlContext } from 'src/app.interface';
import { BadRequestException } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor (private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(@Args('data') input: AuthInput, @Context(){ res }: IGqlContext) {
  const { refreshToken, ...response } = await this.authService.login(input)

  this.authService.toggleRefreshTokenCookie(res, refreshToken)

  return response
}

  @Mutation(() => AuthResponse)
  async register(
    @Args('data') input: AuthInput,
    @Context() { res }: IGqlContext
  ) { 
    const { refreshToken, ...response } = await this.authService.register(input)

    this.authService.toggleRefreshTokenCookie(res, refreshToken)
    

    return response
  }

  @Query(() => AuthResponse)
  async newTokens(@Context() { req, res }: IGqlContext) {
    const initialRefreshToken =
      req.cookies?.[this.authService.REFRESH_TOKEN_NAME]

    if (!initialRefreshToken) {
      this.authService.toggleRefreshTokenCookie(res, null)
      throw new BadRequestException('Отсутствует токен обновления')
    }

    const { refreshToken, ...response } =
      await this.authService.getNewTokens(initialRefreshToken)

    this.authService.toggleRefreshTokenCookie(res, refreshToken)

    return response
  }

  @Mutation(() => Boolean) 
  logout(@Context() { res, req }: IGqlContext) {
    const initialRefreshToken =
      req.cookies?.[this.authService.REFRESH_TOKEN_NAME]

    if (!initialRefreshToken) {
      this.authService.toggleRefreshTokenCookie(res, null)
      throw new BadRequestException('Отсутствует токен обновления')
    }

    this.authService.toggleRefreshTokenCookie(res, null)

    return true
  }
}
