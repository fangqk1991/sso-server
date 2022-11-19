import { SpecFactory } from '@fangcha/router'
import { SignupApis } from '../common/web-api'
import { LoginService } from '../services/web/LoginService'
import { SsoServer } from '../SsoServer'
import assert from '@fangcha/assert'
import { _FangchaState } from '@fangcha/backend-kit'

const factory = new SpecFactory('注册')

factory.prepare(SignupApis.SimpleSignup, async (ctx) => {
  assert.ok(_FangchaState.frontendConfig.signupAble, '注册功能已被关闭')
  const ssoServer = ctx.ssoServer as SsoServer
  const accountV2 = await ssoServer.accountServer.createAccount(ctx.request.body)
  await new LoginService(ctx).onLoginSuccess(accountV2)
  ctx.status = 200
})

export const SignupSpecs = factory.buildSpecs()
