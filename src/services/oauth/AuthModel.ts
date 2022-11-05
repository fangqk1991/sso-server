import * as OAuth2Server from 'oauth2-server'
import { AccessTokenData, AuthorizationCodeData, AuthStorage } from './AuthStorage'
import { SsoClientCenter } from '../SsoClientCenter'
import { AppException } from '@fangcha/app-error'
import { VisitorCoreInfo } from '@fangcha/account/lib/common/models'
import { AuthScopeDescriptor, SsoClientFromOAuth, SsoErrorPhrase } from '../../common/models'

/**
 * @description
 * 授权处理逻辑流程: https://github.com/oauthjs/node-oauth2-server/blob/master/lib/handlers/authorize-handler.js
 * 框架固定了 clientId 参数: request.body.client_id || request.query.client_id;
 * 框架固定了 redirectUri 参数: request.body.redirect_uri || request.query.redirect_uri;
 * 框架强制要求 redirectUri 匹配，未提供通配校验的选项
 */
export class AuthModel implements OAuth2Server.AuthorizationCodeModel, OAuth2Server.RefreshTokenModel {
  private readonly storage: AuthStorage
  private readonly clientCenter: SsoClientCenter

  public constructor(storage: AuthStorage, clientCenter: SsoClientCenter) {
    this.storage = storage
    this.clientCenter = clientCenter
  }

  public async getAccessToken(accessTokenStr: string) {
    return this.storage.getAccessTokenData(accessTokenStr)
  }

  public async getAuthorizationCode(ticket: string) {
    return this.storage.getAuthorizationCodeData(ticket)
  }

  public async getClient(clientId: string, _clientSecret: string) {
    /**
     * @description
     * 在 authorization_code 方式下，无需 clientSecret
     * 返回 null 时，前端会有错误信息: Invalid client: client credentials are invalid
     */
    return this.clientCenter.getOAuthClient(clientId)
  }

  /**
   * @description 保存的 Token 信息包含 client 和 user 信息
   */
  public async saveToken(tokenData: AccessTokenData, client: SsoClientFromOAuth, user: VisitorCoreInfo) {
    tokenData.client = client
    tokenData.user = user
    await this.storage.cacheAccessTokenData(tokenData)
    await this.storage.cacheRefreshTokenData(tokenData)
    return tokenData
  }

  /**
   * @description 保存的授权码信息包含 client 和 user 信息
   */
  public async saveAuthorizationCode(
    codeData: AuthorizationCodeData,
    client: SsoClientFromOAuth,
    user: VisitorCoreInfo
  ) {
    codeData.client = client
    codeData.user = user
    await this.storage.cacheAuthorizationCodeData(codeData)
    return codeData
  }

  public async revokeAuthorizationCode(codeData: OAuth2Server.AuthorizationCode) {
    return this.storage.removeAuthorizationCode(codeData.authorizationCode)
  }

  public async validateScope(_user: OAuth2Server.User, client: SsoClientFromOAuth, scope: string[] | string) {
    const scopeList = Array.isArray(scope) ? scope : scope.split(',').map((s) => s.trim())
    for (const scope of scopeList) {
      if (!AuthScopeDescriptor.checkValueValid(scope)) {
        throw AppException.exception(SsoErrorPhrase.AuthScopeError, {
          message: `Scope(${scope}) invalid.`,
          statusCode: 400,
        })
      }
      if (!client.allScopesAccessible && !client.scopes.includes(scope)) {
        throw AppException.exception(SsoErrorPhrase.AuthScopeError, {
          message: `client(${client.id}) can not access the scope(${scope}).`,
          statusCode: 400,
        })
      }
    }
    return scopeList
  }

  /**
   * @description 若 MyOAuthServer.authenticate 被调用，且传递了 scope 参数，verifyScope 方法会被调用
   */
  async verifyScope(accessToken: OAuth2Server.Token, scope: string[] | string) {
    if (!scope) {
      // no scope declared for the resource, free to access
      return true
    }

    if (!accessToken.scope) {
      return false
    }

    const currentScopes = Array.isArray(accessToken.scope)
      ? accessToken.scope
      : accessToken.scope.split(',').map((s) => s.trim())
    const toCheckingScopes = Array.isArray(scope) ? scope : scope.split(',').map((s) => s.trim())
    for (const scope of toCheckingScopes) {
      if (!currentScopes.includes(scope)) {
        throw AppException.exception(SsoErrorPhrase.AuthScopeError, {
          message: `Request can not access the scope(${scope}). Valid scopes: ${currentScopes.join(', ')}.`,
          statusCode: 400,
        })
      }
    }
    return true
  }

  async getRefreshToken(refreshToken: string) {
    return this.storage.getRefreshTokenData(refreshToken)
  }

  async revokeToken(token: OAuth2Server.RefreshToken | OAuth2Server.Token) {
    return this.storage.removeRefreshTokenData(token.refreshToken!)
  }
}
