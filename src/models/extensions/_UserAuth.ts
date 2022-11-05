import { __UserAuth } from '../auto-build/__UserAuth'
import { UserAuthModel } from '../../common/models'

export class _UserAuth extends __UserAuth {
  public constructor() {
    super()
  }

  public scopeList() {
    return (this.scopesStr || '')
      .split(/[,;]/)
      .map((item) => item.trim())
      .filter((item) => !!item)
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

  public toJSON(): UserAuthModel {
    return {
      clientId: this.clientId,
      userUid: this.userUid,
      scopeList: this.scopeList(),
      isEnabled: this.isEnabled,
      createTime: this.createTime,
      updateTime: this.updateTime,
    }
  }
}
