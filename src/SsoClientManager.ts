import { FCDatabase } from 'fc-sql'
import { _SsoClient } from './models/extensions/_SsoClient'
import { _UserAuth } from './models/extensions/_UserAuth'
import assert from '@fangcha/assert'
import { SsoClientParams, SsoValidateUtils } from './common/models'
import { makeRandomStr } from '@fangcha/tools'
import { SsoClientCenter } from './services/SsoClientCenter'

export interface ClientManagerOptions {
  database: FCDatabase

  // Default: fc_sso_client
  tableName_SsoClient?: string

  // Default: fc_user_auth
  tableName_UserAuth?: string
}

export class SsoClientManager {
  public readonly options: ClientManagerOptions

  public readonly database: FCDatabase
  public readonly clientUtils: SsoClientCenter

  public readonly SsoClient!: { new (): _SsoClient } & typeof _SsoClient
  public readonly UserAuth!: { new (): _UserAuth } & typeof _UserAuth

  constructor(options: ClientManagerOptions) {
    this.options = options
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

    this.clientUtils = new SsoClientCenter(SsoClient)
  }

  public async findClient(clientId: string) {
    return (await this.SsoClient.findWithUid(clientId))!
  }

  public async findUserAuth(clientId: string, userUid: string) {
    return (await this.UserAuth.findOne({
      client_id: clientId,
      user_uid: userUid,
    }))!
  }

  public async generateClient(params: SsoClientParams, operator: string) {
    const powerUsers = params.powerUsers || []
    if (operator && !powerUsers.includes(operator)) {
      powerUsers.push(operator)
    }
    params.powerUsers = powerUsers

    const options = SsoValidateUtils.getClearClientParams(params) as SsoClientParams
    assert.ok(!!params.clientId, 'clientId 不能为空')
    assert.ok(!!params.name, 'name 不能为空')

    const client = new this.SsoClient()
    client.clientId = options.clientId!
    client.name = options.name
    client.clientSecret = makeRandomStr(32)
    client.grantsStr = ['authorization_code', 'refresh_token'].join(',')
    client.scopesStr = (options.scopeList || []).join(',')
    client.redirectUrisStr = (options.redirectUriList || []).join(',')
    client.eventsStr = (options.eventList || []).join(',')
    client.accessTokenLifeTime = 7200
    client.refreshTokenLifeTime = 3600 * 24 * 30
    client.isEnabled = 1
    client.autoGranted = options.autoGranted || 0
    client.isPartner = options.isPartner || 0
    client.notifyUrl = options.notifyUrl || ''
    client.powerUsersStr = (params.powerUsers || []).join(',')
    await client.addToDB()
    return client
  }

  public async updateClientUserAuth(client: _SsoClient, userUid: string, scope: string | string[]) {
    assert.ok(!!scope, 'scope invalid.')
    const scopeList = Array.isArray(scope) ? scope : `${scope}`.split(',').map((s) => s.trim())
    assert.ok(client.checkScopeAccessible(...scopeList), `${scope} invalid`)
    let userAuth = await this.findUserAuth(client.clientId, userUid)
    if (!userAuth) {
      userAuth = new this.UserAuth()
      userAuth.clientId = client.clientId
      userAuth.userUid = userUid
      userAuth.scopesStr = scopeList.join(',')
      userAuth.isEnabled = 1
      await userAuth.strongAddToDB()
    } else {
      const scopeData = userAuth.scopeData()
      const scopeListPlus = scopeList.filter((scope) => !scopeData[scope])
      userAuth.fc_edit()
      userAuth.scopesStr = [...userAuth.scopeList(), ...scopeListPlus].join(',')
      userAuth.isEnabled = 1
      await userAuth.updateToDB()
    }
    return userAuth
  }
}
