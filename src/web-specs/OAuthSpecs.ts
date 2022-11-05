import { SpecFactory } from '@fangcha/router'
import { URL } from 'url'
import assert from '@fangcha/assert'
import { FangchaSession } from '@fangcha/router/lib/session'
import { AppException } from '@fangcha/app-error'
import { OAuthApis } from '../common/web-api'
import { OAuthHandler } from '../services/web/OAuthHandler'
import { SsoServer } from '../SsoServer'

const factory = new SpecFactory('OAuth 相关')

factory.prepare(OAuthApis.OAuthAuthorize, async (ctx) => {
  await new OAuthHandler(ctx)
    .handleAuthorizeRequest(async (codeData) => {
      const { redirect_uri: redirectUri, state } = ctx.request.query
      const url = new URL(redirectUri as string)
      url.searchParams.append('code', codeData.authorizationCode)
      if (state) {
        url.searchParams.append('state', state as string)
      }
      ctx.redirect(url.toString())
    })
    .catch((err) => {
      if (err.inner instanceof AppException) {
        throw err.inner
      }
      throw err
    })
})
factory.prepare(OAuthApis.OAuthToken, async (ctx) => {
  await new OAuthHandler(ctx)
    .handleTokenRequest(async (tokenData) => {
      ctx.body = tokenData
    })
    .catch((err) => {
      if (err.inner instanceof AppException) {
        throw err.inner
      }
      throw err
    })
})
factory.prepare(OAuthApis.UserInfoGet, async (ctx) => {
  const ssoServer = ctx.ssoServer as SsoServer
  let token = ctx.request.query.token as string
  if (!token) {
    const session = ctx.session as FangchaSession
    token = (session.headers['authorization'] || '').replace(/^Bearer\s+/, '')
  }
  assert.ok(!!token, 'token invalid.')

  const tokenData = (await ssoServer.authModel.getAccessToken(token))!
  assert.ok(!!tokenData, 'tokenData missing.')

  ctx.body = tokenData.user
})

export const OAuthSpecs = factory.buildSpecs()
