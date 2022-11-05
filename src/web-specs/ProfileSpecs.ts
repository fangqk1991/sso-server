import { SpecFactory } from '@fangcha/router'
import { ProfileApis } from '../common/web-api'
import { Session } from '../services/web/Session'

const factory = new SpecFactory('个人信息')

factory.prepare(ProfileApis.ProfileInfoGet, async (ctx) => {
  const session = ctx.session as Session
  ctx.body = session.getAuthInfo()
})

export const ProfileSpecs = factory.buildSpecs()
