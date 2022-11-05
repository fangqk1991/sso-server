export interface UserAuthModel {
  clientId: string
  userUid: string
  scopeList: string[]
  isEnabled: number
  createTime: string
  updateTime: string
}

export interface UserAuthModelForWeb extends UserAuthModel {
  appName: string
}
