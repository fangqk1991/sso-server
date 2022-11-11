import { SpecFactory } from '@fangcha/router'
import { ProfileApis } from '../common/web-api'
import { SsoSession } from '../services/web/SsoSession'

const factory = new SpecFactory('个人信息')

factory.prepare(ProfileApis.ProfileInfoGet, async (ctx) => {
  const session = ctx.session as SsoSession
  ctx.body = session.getAuthInfo()
})

export const ProfileSpecs = factory.buildSpecs()
