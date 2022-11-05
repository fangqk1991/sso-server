import * as OAuth2Server from 'oauth2-server'
import { VisitorCoreInfo } from '@fangcha/account/lib/common/models'
import { SsoClientFromOAuth } from '../../common/models'
import { RedisCache } from '@fangcha/tools/lib/redis'

export interface AccessTokenData extends OAuth2Server.Token {
  accessToken: string
  accessTokenExpiresAt: Date
  refreshToken: string
  refreshTokenExpiresAt: Date
  client: SsoClientFromOAuth
  user: VisitorCoreInfo
}

export interface AuthorizationCodeData extends OAuth2Server.AuthorizationCode {
  authorizationCode: string
  expiresAt: Date
  redirectUri: string
  scope: string[]
  client: SsoClientFromOAuth
  user: VisitorCoreInfo
}

export class AuthStorage {
  public cache: RedisCache

  constructor(cache: RedisCache) {
    this.cache = cache
  }

  private redisKeyPartForUserClientAccessTokenGroup(accountUid: string, clientId: string) {
    return `sso:oauth:user:${accountUid}:client:${clientId}:access.token:group`
  }

  private redisKeyPartForUserClientRefreshTokenGroup(accountUid: string, clientId: string) {
    return `sso:oauth:user:${accountUid}:client:${clientId}:refresh.token:group`
  }

  private redisKeyPartForAccessToken(ticket: string) {
    return `sso:oauth:access.token:${ticket}:entity`
  }

  public async getAccessTokenData(accessTokenStr: string): Promise<AccessTokenData | null> {
    const keyPart = this.redisKeyPartForAccessToken(accessTokenStr)
    const content = await this.cache.get(keyPart)
    if (!content) {
      return null
    }
    const data = JSON.parse(content) as AccessTokenData
    if (!data) {
      return null
    }
    if (data.accessTokenExpiresAt) {
      data.accessTokenExpiresAt = new Date(data.accessTokenExpiresAt)
    }
    if (data.refreshTokenExpiresAt) {
      data.refreshTokenExpiresAt = new Date(data.refreshTokenExpiresAt)
    }
    return data
  }

  public async cacheAccessTokenData(tokenData: AccessTokenData) {
    const clientId = tokenData.client.id
    await this.cache.redis.sadd(
      this.redisKeyPartForUserClientAccessTokenGroup(tokenData.user.accountUid, clientId),
      tokenData.accessToken
    )
    await this.cache.cache(
      this.redisKeyPartForAccessToken(tokenData.accessToken),
      JSON.stringify(tokenData),
      Math.floor((tokenData.accessTokenExpiresAt.valueOf() - Date.now()) / 1000)
    )
  }

  private redisKeyPartForRefreshToken(ticket: string) {
    return `sso:oauth:refresh.token:${ticket}:entity`
  }

  public async getRefreshTokenData(refreshTokenStr: string): Promise<OAuth2Server.RefreshToken | null> {
    const keyPart = this.redisKeyPartForRefreshToken(refreshTokenStr)
    const content = await this.cache.get(keyPart)
    if (!content) {
      return null
    }
    const data = JSON.parse(content) as OAuth2Server.RefreshToken
    if (!data) {
      return null
    }
    if (data.refreshTokenExpiresAt) {
      data.refreshTokenExpiresAt = new Date(data.refreshTokenExpiresAt)
    }
    return data
  }

  public async cacheRefreshTokenData(tokenData: AccessTokenData) {
    const clientId = tokenData.client.id
    await this.cache.redis.sadd(
      this.redisKeyPartForUserClientRefreshTokenGroup(tokenData.user.accountUid, clientId),
      tokenData.refreshToken
    )
    await this.cache.cache(
      this.redisKeyPartForRefreshToken(tokenData.refreshToken),
      JSON.stringify(tokenData),
      Math.floor((tokenData.refreshTokenExpiresAt.valueOf() - Date.now()) / 1000)
    )
  }

  public async removeAccessTokenData(ticket: string) {
    const keyPart = this.redisKeyPartForAccessToken(ticket)
    return this.cache.clear(keyPart)
  }

  public async removeRefreshTokenData(ticket: string) {
    const keyPart = this.redisKeyPartForRefreshToken(ticket)
    return this.cache.clear(keyPart)
  }

  public async removeUserAllTokens(userUid: string, clientId: string) {
    {
      const redisKey = this.redisKeyPartForUserClientAccessTokenGroup(userUid, clientId)
      const ticketList = await this.cache.redis.smembers(redisKey)
      for (const ticket of ticketList) {
        await this.removeAccessTokenData(ticket)
      }
      await this.cache.redis.del(redisKey)
    }
    {
      const redisKey = this.redisKeyPartForUserClientRefreshTokenGroup(userUid, clientId)
      const ticketList = await this.cache.redis.smembers(redisKey)
      for (const ticket of ticketList) {
        await this.removeRefreshTokenData(ticket)
      }
      await this.cache.redis.del(redisKey)
    }
  }

  private redisKeyPartForAuthorizationCode(ticket: string) {
    return `sso:oauth:authorization.code:${ticket}:entity`
  }

  public async getAuthorizationCodeData(ticket: string): Promise<AuthorizationCodeData | null> {
    const keyPart = this.redisKeyPartForAuthorizationCode(ticket)
    const content = await this.cache.get(keyPart)
    if (!content) {
      return null
    }
    const data = JSON.parse(content) as AuthorizationCodeData
    if (!data) {
      return null
    }
    data.expiresAt = new Date(data.expiresAt)
    return data
  }

  public async cacheAuthorizationCodeData(codeData: AuthorizationCodeData) {
    const keyPart = this.redisKeyPartForAuthorizationCode(codeData.authorizationCode)
    await this.cache.cache(
      keyPart,
      JSON.stringify(codeData),
      Math.floor((codeData.expiresAt.valueOf() - Date.now()) / 1000)
    )
  }

  public async removeAuthorizationCode(ticket: string) {
    const keyPart = this.redisKeyPartForAuthorizationCode(ticket)
    return this.cache.clear(keyPart)
  }
}
