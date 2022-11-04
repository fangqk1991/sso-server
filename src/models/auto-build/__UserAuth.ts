import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'client_id',
  'user_uid',
  'scopes_str',
  'is_enabled',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'client_id',
  'user_uid',
  'scopes_str',
  'is_enabled',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'client_id',
  'user_uid',
  'scopes_str',
  'is_enabled',
  'create_time',
]
const _timestampTypeCols: string[] = [
  // prettier-ignore
  'create_time',
  'update_time',
]

const dbOptions = {
  table: 'fc_user_auth',
  primaryKey: ['client_id', 'user_uid'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
}

export class __UserAuth extends FeedBase {
  /**
   * @description [varchar(64)] Client ID，-> fc_sso_client.client_id
   */
  public clientId!: string
  /**
   * @description [varchar(127)] 用户 ID
   */
  public userUid!: string
  /**
   * @description [text] scopes, 以 , 分割
   */
  public scopesStr!: string
  /**
   * @description [tinyint] 是否可用
   */
  public isEnabled!: number
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
    this.scopesStr = ''
    this.isEnabled = 0
  }

  public fc_propertyMapper() {
    return {
      clientId: 'client_id',
      userUid: 'user_uid',
      scopesStr: 'scopes_str',
      isEnabled: 'is_enabled',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
