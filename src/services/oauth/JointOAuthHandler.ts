import { makeUUID } from '@fangcha/tools'
import { Context } from 'koa'
import { AppException } from '@fangcha/app-error'
import { SsoErrorPhrase } from '../../common/models'
import { RedisCache } from '@fangcha/tools/lib/redis'

export interface JointStateParams {
  redirectUri: string
  accountUid?: string
}

export class JointOAuthHandler {
  public static readonly AliveTime = 5 * 60

  public readonly ctx: Context
  public readonly cache: RedisCache

  constructor(ctx: Context, cache: RedisCache) {
    this.ctx = ctx
    this.cache = cache
  }

  private static redisKeyPartForJointOAuth(ticket: string) {
    return `sso:joint:oauth:${ticket}`
  }

  private static cookieKeyPartForJointOAuth(ticket: string) {
    return `oauth-login-${ticket}`
  }

  public async handleOAuthRequest(params: JointStateParams) {
    const ticket = makeUUID()
    await this.cache.cache(
      JointOAuthHandler.redisKeyPartForJointOAuth(ticket),
      JSON.stringify(params),
      JointOAuthHandler.AliveTime
    )
    this.ctx.cookies.set(JointOAuthHandler.cookieKeyPartForJointOAuth(ticket), '1', {
      maxAge: JointOAuthHandler.AliveTime * 1000,
    })
    return ticket
  }

  public async handleOAuthCallback(ticket: string): Promise<JointStateParams> {
    const keyPart = JointOAuthHandler.redisKeyPartForJointOAuth(ticket)
    const content = await this.cache.get(keyPart)
    if (!content) {
      throw AppException.exception(SsoErrorPhrase.OAuthStateError)
    }
    const data = JSON.parse(content) as JointStateParams
    if (!data) {
      throw AppException.exception(SsoErrorPhrase.OAuthStateError)
    }
    this.ctx.cookies.set(JointOAuthHandler.cookieKeyPartForJointOAuth(ticket), '', {
      maxAge: 0,
    })
    return data
  }
}
