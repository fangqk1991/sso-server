import { AccountServer } from '@fangcha/account'
import { RedisCache, RedisConfig } from '@fangcha/tools/lib/redis'
import { AuthModel } from './services/oauth/AuthModel'
import { AuthStorage } from './services/oauth/AuthStorage'
import * as OAuth2Server from 'oauth2-server'
import { JointOAuthHandler } from './services/oauth/JointOAuthHandler'
import { Context } from 'koa'
import { ClientManagerOptions, SsoClientManager } from './SsoClientManager'

interface Options extends ClientManagerOptions {
  accountServer: AccountServer
  redisConfig: RedisConfig
}

export class SsoServer extends SsoClientManager {
  public readonly options: Options

  public readonly accountServer: AccountServer
  public readonly cache: RedisCache

  public readonly authStorage: AuthStorage
  public readonly authModel: AuthModel
  public readonly oAuth2Server: OAuth2Server

  constructor(options: Options) {
    super(options)
    this.options = options

    this.accountServer = options.accountServer
    this.cache = new RedisCache(options.redisConfig)

    this.authStorage = new AuthStorage(this.cache)
    this.authModel = new AuthModel(this.authStorage, this.clientUtils)
    this.oAuth2Server = new OAuth2Server({
      model: this.authModel,
    })
  }

  public makeJointOAuthHandler(ctx: Context) {
    return new JointOAuthHandler(ctx, this.cache)
  }
}
