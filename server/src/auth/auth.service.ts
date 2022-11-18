import { Injectable } from '@nestjs/common';
import { CipherUtils } from 'src/common/utils/cipher.util';
import { UserService } from 'src/user/user.service';
import { SignInUnauthorizedException } from '../common/exceptions/sign-in-unauthorized.exception';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly cipherUtils: CipherUtils,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.loadUserByEmail({ email: email });

    // 유저 정보가 없을 경우, 예외를 반환한다.
    if (user === null) {
      throw new SignInUnauthorizedException();
    }

    if (await this.cipherUtils.hashMatches(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
  }

  /**
   * 로그인을 수행한다.
   * JWT(Access Token, Refresh Token) 를 생성하고, 이를 DB 에 기록한다.
   * 최종적으로 생성한 JWT 토큰들을 반환한다.
   * @param user JWT Strategy 로부터 반환된 Request 객체 내 유저 정보
   * @return Access Token 및 갱신을 위한 Refresh Token
   */
  async signIn(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '1d',
    });

    const decAccessToken: any = this.jwtService.decode(accessToken);
    const decRefreshToken: any = this.jwtService.decode(refreshToken);
    const accessTokenExpiresAt = dayjs(decAccessToken.exp * 1000);
    const refreshTokenExpiresAt = dayjs(decRefreshToken.exp * 1000);

    const authTokenCreateInput: Prisma.AuthTokenCreateInput = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {
        connect: { id: user.id },
      },
      aTExpiredAt: accessTokenExpiresAt.toDate(),
      rTExpiredAt: refreshTokenExpiresAt.toDate(),
    };

    await this.prismaService.authToken.create({
      data: authTokenCreateInput,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
