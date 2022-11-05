import { __SsoClient } from '../auto-build/__SsoClient'
import { FilterOptions } from 'fc-feed'
import { SsoClientFromOAuth, SsoClientModel, SsoClientParams, SsoValidateUtils } from '../../common/models'

export class _SsoClient extends __SsoClient {
  public constructor() {
    super()
  }

  public fc_searcher(params: FilterOptions = {}) {
    const searcher = super.fc_searcher(params)
    const keywords = params.keywords || ''
    if (keywords) {
      searcher.processor().addSpecialCondition('client_id LIKE ? OR name LIKE ?', `%${keywords}%`, `%${keywords}%`)
    }
    if (params['lockedUser']) {
      searcher.processor().addSpecialCondition('FIND_IN_SET(?, power_users_str)', params['lockedUser'])
    }
    return searcher
  }

  public redirectUriList() {
    return (this.redirectUrisStr || '')
      .split(/[,;]/)
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public scopeList() {
    return (this.scopesStr || '')
      .split(/[,;]/)
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public grantList() {
    return (this.grantsStr || '')
      .split(/[,;]/)
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public eventList() {
    return (this.eventsStr || '')
      .split(/[,;]/)
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public getClientModel() {
    const scopes = this.scopeList()
    const data: SsoClientFromOAuth = {
      id: this.clientId,
      redirectUris: this.redirectUriList(),
      grants: this.grantList(),
      scopes: scopes,
      allScopesAccessible: scopes.includes('*'),
      accessTokenLifetime: this.accessTokenLifeTime,
      refreshTokenLifetime: this.refreshTokenLifeTime,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      appName: this.name,
      isPartner: this.isPartner,
    }
    return data
  }

  public scopeData(): { [scope: string]: boolean } {
    return this.scopeList().reduce((result, cur) => {
      result[cur] = true
      return result
    }, {})
  }

  public checkScopeAccessible(...scopeList: string[]) {
    const scopeData = this.scopeData()
    for (const scope of scopeList) {
      if (!scopeData[scope]) {
        return false
      }
    }
    return true
  }

  public powerUsers() {
    return (this.powerUsersStr || '')
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public getModelForAdmin(): SsoClientModel {
    return {
      clientId: this.clientId,
      clientSecret: '****',
      name: this.name,
      grantList: this.grantList(),
      scopeList: this.scopeList(),
      eventList: this.eventList(),
      redirectUriList: this.redirectUriList(),
      autoGranted: this.autoGranted,
      isPartner: this.isPartner,
      isEnabled: this.isEnabled,
      accessTokenLifeTime: this.accessTokenLifeTime,
      refreshTokenLifeTime: this.refreshTokenLifeTime,
      powerUsers: this.powerUsers(),
      notifyUrl: this.notifyUrl || '',
      createTime: this.createTime,
      updateTime: this.updateTime,
    }
  }

  public async updateInfos(params: SsoClientParams, operator: string) {
    const powerUsers = params.powerUsers || []
    if (operator && !powerUsers.includes(operator)) {
      powerUsers.push(operator)
    }
    params.powerUsers = powerUsers

    const options = SsoValidateUtils.getClearClientParams(params) as SsoClientParams

    this.fc_edit()
    if (options.name !== undefined) {
      this.name = options.name
    }
    if (Array.isArray(options.scopeList)) {
      this.scopesStr = options.scopeList.join(',')
    }
    if (Array.isArray(options.redirectUriList)) {
      this.redirectUrisStr = options.redirectUriList.join(',')
    }
    if (Array.isArray(options.eventList)) {
      this.eventsStr = options.eventList.join(',')
    }
    if (options.autoGranted !== undefined) {
      this.autoGranted = options.autoGranted
    }
    if (options.isPartner !== undefined) {
      this.isPartner = options.isPartner
    }
    if (options.notifyUrl !== undefined) {
      this.notifyUrl = options.notifyUrl
    }
    this.powerUsersStr = (params.powerUsers || []).join(',')
    await this.updateToDB()
  }

  public toJSON() {
    return this.getModelForAdmin()
  }
}
