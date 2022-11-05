import { SpecFactory } from '@fangcha/router'
import { LoginApis } from '../common/web-api'
import { LoginService } from '../services/web/LoginService'
import { Session } from '../services/web/Session'

const factory = new SpecFactory('注册')

factory.prepare(LoginApis.LoginWithEmail, async (ctx) => {
  await new LoginService(ctx).loginWithEmail(ctx.request.body)
  ctx.status = 200
})

factory.prepare(LoginApis.Logout, async (ctx) => {
  const session = ctx.session as Session
  await session.logout(ctx)
  ctx.redirect((ctx.request.query.redirect_uri as string) || '/')
})

export const LoginSpecs = factory.buildSpecs()
