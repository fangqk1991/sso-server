import { SpecFactory } from '@fangcha/router'
import { SessionApis } from '../common/web-api'
import { Session } from '../services/web/Session'
import { SsoSessionInfo } from '../common/models'

const factory = new SpecFactory('当前会话')

factory.prepare(SessionApis.SessionInfoGet, async (ctx) => {
  const session = ctx.session as Session
  const data: SsoSessionInfo = {
    userInfo: null,
  } as SsoSessionInfo
  if (session.checkLogin()) {
    data.userInfo = session.getAuthInfo()
  }
  ctx.body = data
})

export const SessionSpecs = factory.buildSpecs()
