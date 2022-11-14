import { Context } from 'koa'
import * as OAuthServer from 'oauth2-server'
import { SsoSession } from './SsoSession'
import { OAuthToken } from '@fangcha/tools/lib/oauth-client'
import assert from '@fangcha/assert'
import { RedirectBreak } from '@fangcha/app-error'
import { SsoServer } from '../../SsoServer'
import { RetainPagePath, SsoConstants } from '../../common/models'
import { _SessionApp } from '@fangcha/router/lib/session'

export class OAuthHandler {
  public readonly ctx: Context

  constructor(ctx: Context) {
    this.ctx = ctx
  }

  public async handleAuthorizeRequest(handler: (codeData: OAuthServer.AuthorizationCode) => Promise<void>) {
    const context = this.ctx
    const session = context.session as SsoSession
    const ssoServer = context.ssoServer as SsoServer
    const webBaseURL = _SessionApp.baseURL
    let { toPage } = context.request.query
    let clientId = context.request.query.client_id as string
    if (Array.isArray(clientId)) {
      clientId = clientId[0]
    }
    if (toPage !== 'signup' && toPage !== 'login') {
      toPage = 'login'
    }
    if (!session.checkLogin()) {
      const authUrl = `${webBaseURL}${RetainPagePath.OAuthAuthorizePath}?${context.request.querystring}`
      throw RedirectBreak.breakWithRedirectUri(`/${toPage}?redirectUri=${encodeURIComponent(authUrl)}`)
    }
    if (!(await session.checkVisitorAvailable())) {
      await session.logout(context)
      const authUrl = `${webBaseURL}${RetainPagePath.OAuthAuthorizePath}?${context.request.querystring}`
      throw RedirectBreak.breakWithRedirectUri(`/${toPage}?redirectUri=${encodeURIComponent(authUrl)}`)
    }

    const { scope: scope } = context.request.query
    assert.ok(!!clientId, `client_id[${clientId}] invalid.`)
    const scopeList = Array.isArray(scope) ? scope : `${scope}`.split(',').map((s) => s.trim())
    const client = await ssoServer.findClient(clientId)
    assert.ok(!!client, `client(${clientId}) invalid.`)
    const userUid = session.curUserUid()
    if (client.autoGranted) {
      await ssoServer.updateClientUserAuth(client, userUid, scopeList)
    }
    // const userAuth = await UserAuth.findUserAuth(clientId, userUid)
    // if (!userAuth || !userAuth.isEnabled || !userAuth.checkScopeAccessible(...scopeList)) {
    //   const authViewUrl = `${AuthConfig.webBaseURL}${RetainPagePath.OAuthAuthorizeView}?${context.request.querystring}`
    //   throw RedirectBreak.breakWithRedirectUri(authViewUrl)
    // }

    const request = new OAuthServer.Request(context.request)
    const response = new OAuthServer.Response(context.response)
    const codeData = await ssoServer.oAuth2Server.authorize(request, response, {
      authorizationCodeLifetime: SsoConstants.AuthorizationCodeExpireTime,
      authenticateHandler: {
        handle: function (_request: OAuthServer.Request, _response: OAuthServer.Response) {
          return session.getAuthInfo()
        },
      },
      allowEmptyState: true,
    })
    await handler(codeData)
  }

  public async handleTokenRequest(handler: (codeData: OAuthToken) => Promise<void>) {
    const context = this.ctx
    const ssoServer = context.ssoServer as SsoServer
    const bodyData = context.request.body as any
    if (bodyData.grant_type === 'authorization_code' && !bodyData.redirect_uri) {
      const codeData = await ssoServer.authStorage.getAuthorizationCodeData(bodyData.code)
      bodyData.redirect_uri = codeData?.redirectUri || ''
    }
    const request = new OAuthServer.Request(context.request)
    const response = new OAuthServer.Response(context.response)
    await ssoServer.oAuth2Server.token(request, response, {
      requireClientAuthentication: {
        // authorization_code: false,
      },
    })
    await handler(response.body)
  }
}
