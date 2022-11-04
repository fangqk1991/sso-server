import { FCDatabase } from 'fc-sql'
import { _SsoClient } from './models/extensions/_SsoClient'
import { _UserAuth } from './models/extensions/_UserAuth'

interface Options {
  database: FCDatabase
  tableName_SsoClient?: string
  tableName_UserAuth?: string
}

export class SsoServer {
  public readonly database: FCDatabase
  public readonly SsoClient!: { new (): _SsoClient } & typeof _SsoClient
  public readonly UserAuth!: { new (): _UserAuth } & typeof _UserAuth

  constructor(options: Options) {
    this.database = options.database

    class SsoClient extends _SsoClient {}
    SsoClient.addStaticOptions({
      database: options.database,
      table: options.tableName_SsoClient || 'fc_sso_client',
    })
    this.SsoClient = SsoClient

    class UserAuth extends _UserAuth {}
    UserAuth.addStaticOptions({
      database: options.database,
      table: options.tableName_UserAuth || 'fc_user_auth',
    })
    this.UserAuth = UserAuth
  }
}
