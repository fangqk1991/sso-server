export interface SsoClientFromOAuth {
  id: string
  redirectUris: string[]
  grants: string[]
  accessTokenLifetime: number
  refreshTokenLifetime: number
  // Custom
  scopes: string[]
  allScopesAccessible: boolean
  clientId: string
  clientSecret: string
  appName: string
  isPartner: number
}

export interface SsoClientParams {
  clientId?: string
  name: string
  grantList: string[]
  scopeList: string[]
  redirectUriList: string[]
  accessTokenLifeTime: number
  refreshTokenLifeTime: number
  isPartner: number
  autoGranted: number
  isEnabled: number
  powerUsers: string[]
  notifyUrl: string
  eventList: string[]
}

export interface SsoClientModel extends SsoClientParams {
  clientId: string
  clientSecret: string
  name: string
  grantList: string[]
  scopeList: string[]
  redirectUriList: string[]
  accessTokenLifeTime: number
  refreshTokenLifeTime: number
  isPartner: number
  autoGranted: number
  isEnabled: number
  createTime: string
  updateTime: string
}

export interface SsoClientBasicInfo {
  clientId: string
  name: string
}
