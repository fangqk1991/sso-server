import { SpecFactory } from '@fangcha/router'
import { SignupApis } from '../common/web-api'
import { LoginService } from '../services/web/LoginService'
import { SsoServer } from '../SsoServer'

const factory = new SpecFactory('注册')

factory.prepare(SignupApis.SimpleSignup, async (ctx) => {
  const ssoServer = ctx.ssoServer as SsoServer
  const accountV2 = await ssoServer.accountServer.createAccount(ctx.request.body)
  await new LoginService(ctx).onLoginSuccess(accountV2)
  ctx.status = 200
})

export const SignupSpecs = factory.buildSpecs()
