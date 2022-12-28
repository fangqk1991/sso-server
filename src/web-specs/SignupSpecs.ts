import { SpecFactory } from '@fangcha/router'
import { SignupApis } from '../common/web-api'
import { LoginService } from '../services/web/LoginService'
import { SsoServer } from '../SsoServer'
import assert from '@fangcha/assert'
import { _FangchaState } from '@fangcha/backend-kit'
import { SsoSession } from '../services/web/SsoSession'

const factory = new SpecFactory('注册')

factory.prepare(SignupApis.SimpleSignup, async (ctx) => {
  assert.ok(_FangchaState.frontendConfig.signupAble, '注册功能已被关闭')
  const session = ctx.session as SsoSession
  const ssoServer = ctx.ssoServer as SsoServer
  const accountV2 = await ssoServer.accountServer.createAccount({
    ...ctx.request.body,
    registerIp: session.realIP,
  })
  await new LoginService(ctx).onLoginSuccess(accountV2)
  const email = session.getAuthInfo().email
  _FangchaState.botProxy.notify(`${email} 在 ${session.getRefererUrl()} 注册了账号.`)
  ctx.status = 200
})

export const SignupSpecs = factory.buildSpecs()
