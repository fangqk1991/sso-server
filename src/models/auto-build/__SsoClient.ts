import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'client_id',
  'client_secret',
  'name',
  'grants_str',
  'scopes_str',
  'redirect_uris_str',
  'access_token_life_time',
  'refresh_token_life_time',
  'auto_granted',
  'is_partner',
  'is_enabled',
  'power_users_str',
  'events_str',
  'notify_url',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'client_id',
  'client_secret',
  'name',
  'grants_str',
  'scopes_str',
  'redirect_uris_str',
  'access_token_life_time',
  'refresh_token_life_time',
  'auto_granted',
  'is_partner',
  'is_enabled',
  'power_users_str',
  'events_str',
  'notify_url',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'client_secret',
  'name',
  'grants_str',
  'scopes_str',
  'redirect_uris_str',
  'access_token_life_time',
  'refresh_token_life_time',
  'auto_granted',
  'is_partner',
  'is_enabled',
  'power_users_str',
  'events_str',
  'notify_url',
  'create_time',
]
const _timestampTypeCols: string[] = [
  // prettier-ignore
  'create_time',
  'update_time',
]

const dbOptions = {
  table: 'fc_sso_client',
  primaryKey: 'client_id',
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
}

export class __SsoClient extends FeedBase {
  /**
   * @description [varchar(64)] Client ID，用户自定义（最好具备语义），具备唯一性
   */
  public clientId!: string
  /**
   * @description [varchar(64)] Client Secret
   */
  public clientSecret!: string
  /**
   * @description [varchar(127)] 应用名称
   */
  public name!: string
  /**
   * @description [text] grants, 以 , 分割
   */
  public grantsStr!: string
  /**
   * @description [text] scopes, 以 , 分割
   */
  public scopesStr!: string
  /**
   * @description [text] redirectUris, 以 , 分割
   */
  public redirectUrisStr!: string
  /**
   * @description [int] accessTokenLifetime, 单位: 秒
   */
  public accessTokenLifeTime!: number
  /**
   * @description [int] refreshTokenLifetime, 单位: 秒
   */
  public refreshTokenLifeTime!: number
  /**
   * @description [tinyint] 无需用户点击，自动获得授权 (针对可信应用)
   */
  public autoGranted!: number
  /**
   * @description [tinyint] 是否为合作商
   */
  public isPartner!: number
  /**
   * @description [tinyint] 是否可用
   */
  public isEnabled!: number
  /**
   * @description [text] powerUsers, 以 , 分割
   */
  public powerUsersStr!: string
  /**
   * @description [text] events, 以 , 分割
   */
  public eventsStr!: string
  /**
   * @description [text] 通知地址
   */
  public notifyUrl!: string
  /**
   * @description [timestamp] 创建时间
   */
  public createTime!: string
  /**
   * @description [timestamp] 更新时间
   */
  public updateTime!: string

  protected static _staticDBOptions: DBProtocolV2
  protected static _staticDBObserver?: DBObserver

  public static setDatabase(database: FCDatabase, dbObserver?: DBObserver) {
    this.addStaticOptions({ database: database }, dbObserver)
  }

  public static setStaticProtocol(protocol: Partial<DBProtocolV2>, dbObserver?: DBObserver) {
    this._staticDBOptions = Object.assign({}, dbOptions, protocol) as DBProtocolV2
    this._staticDBObserver = dbObserver
    this._onStaticDBOptionsUpdate(this._staticDBOptions)
  }

  public static addStaticOptions(protocol: Partial<DBProtocolV2>, dbObserver?: DBObserver) {
    this._staticDBOptions = Object.assign({}, dbOptions, this._staticDBOptions, protocol) as DBProtocolV2
    this._staticDBObserver = dbObserver
    this._onStaticDBOptionsUpdate(this._staticDBOptions)
  }

  public static _onStaticDBOptionsUpdate(_protocol: DBProtocolV2) {}

  public constructor() {
    super()
    this.setDBProtocolV2(this.constructor['_staticDBOptions'])
    this._reloadOnAdded = true
    this._reloadOnUpdated = true
    if (this.constructor['_staticDBObserver']) {
      this.dbObserver = this.constructor['_staticDBObserver']
    }
  }

  public fc_defaultInit() {
    // This function is invoked by constructor of FCModel
    this.name = ''
    this.grantsStr = ''
    this.scopesStr = ''
    this.redirectUrisStr = ''
    this.accessTokenLifeTime = 7200
    this.refreshTokenLifeTime = 0
    this.autoGranted = 0
    this.isPartner = 0
    this.isEnabled = 0
    this.powerUsersStr = ''
    this.eventsStr = ''
    this.notifyUrl = ''
  }

  public fc_propertyMapper() {
    return {
      clientId: 'client_id',
      clientSecret: 'client_secret',
      name: 'name',
      grantsStr: 'grants_str',
      scopesStr: 'scopes_str',
      redirectUrisStr: 'redirect_uris_str',
      accessTokenLifeTime: 'access_token_life_time',
      refreshTokenLifeTime: 'refresh_token_life_time',
      autoGranted: 'auto_granted',
      isPartner: 'is_partner',
      isEnabled: 'is_enabled',
      powerUsersStr: 'power_users_str',
      eventsStr: 'events_str',
      notifyUrl: 'notify_url',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
