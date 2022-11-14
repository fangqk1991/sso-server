import { Context } from 'koa'
import * as jsonwebtoken from 'jsonwebtoken'
import assert from '@fangcha/assert'
import { _SessionApp, FangchaSession } from '@fangcha/router/lib/session'
import { AppException } from '@fangcha/app-error'
import { VisitorCoreInfo } from '@fangcha/account/lib/common/models'
import { SsoConstants, SsoErrorPhrase } from '../../common/models'
import { SsoServer } from '../../SsoServer'
import { CookieAttr } from 'cookies'

export class SsoSession extends FangchaSession {
  public readonly trackId!: string
  private _jwtCookieStr: string = ''
  private _authInfo: VisitorCoreInfo = {
    accountUid: '',
    email: '',
  }
  private _ssoServer!: SsoServer

  public constructor(ctx: Context) {
    super(ctx)
    this._ssoServer = ctx.ssoServer
    ctx.cookies.secure = _SessionApp.baseURL.startsWith('https')
    {
      this._jwtCookieStr = ctx.cookies.get(SsoConstants.CookieKeyForJWT) || ''
      this._authInfo = this.extractAuthInfo()
    }
    this.trackId = ctx.cookies.get(SsoConstants.CookieKeyForTrackId) || ''
    this.logger.addContext('user', this.curUserUid())
  }

  private extractAuthInfo(verifySign = false) {
    const result: VisitorCoreInfo = {
      accountUid: '',
      email: '',
    }
    const authInfo = (
      verifySign
        ? jsonwebtoken.verify(this._jwtCookieStr, _SessionApp.jwtProtocol.jwtSecret)
        : jsonwebtoken.decode(this._jwtCookieStr)
    ) as VisitorCoreInfo
    if (authInfo) {
      result.accountUid = authInfo.accountUid
      result.email = authInfo.email
    }
    return result
  }

  private checkAuthInfoValid() {
    return !!this._authInfo.accountUid
  }

  public auth() {
    try {
      this._authInfo = this.extractAuthInfo(true)
      assert.ok(this.checkAuthInfoValid())
    } catch (e) {
      throw AppException.exception(SsoErrorPhrase.Unauthorized, {
        statusCode: 401,
        redirectToLoginPage: true,
      })
    }
    return this._authInfo
  }

  public checkLogin() {
    try {
      this.auth()
      return true
    } catch (e) {}
    return false
  }

  public async login(userInfo: VisitorCoreInfo, ctx: Context) {
    this._authInfo = {
      ...userInfo,
    }
    const jwtInfo = jsonwebtoken.sign(this._authInfo, _SessionApp.jwtProtocol.jwtSecret, {
      expiresIn: SsoConstants.JWTExpireTime / 1000,
    })
    const options: CookieAttr = {
      httpOnly: true,
      maxAge: SsoConstants.JWTExpireTime,
    }
    if (ctx.cookies.secure) {
      // sameSite = 'none' 必须配合 secure = true 使用
      options.secure = true
      options.sameSite = 'none'
    }
    ctx.cookies.set(SsoConstants.CookieKeyForJWT, jwtInfo, options)
  }

  public async logout(ctx: Context) {
    ctx.cookies.set(SsoConstants.CookieKeyForJWT, '', {
      maxAge: 0,
    })
  }

  public getAuthInfo() {
    return this._authInfo
  }

  public async prepareAccountV2() {
    const accountV2 = await this._ssoServer.accountServer.findAccount(this._authInfo.accountUid)
    assert.ok(!!accountV2, `Account(${this._authInfo.accountUid}) 不存在`, 500)
    return accountV2
  }

  public curUserStr() {
    return this.curUserUid()
  }

  public curUserInfo() {
    return this.getAuthInfo()
  }

  public curUserUid() {
    const authInfo = this.getAuthInfo()
    return authInfo.accountUid
  }

  public async reloadAuthInfo(ctx: Context) {
    const accountV2 = await this.prepareAccountV2()
    await this.login(await accountV2.getVisitorCoreInfo(), ctx)
  }

  public async checkVisitorAvailable() {
    const accountV2 = await this._ssoServer.accountServer.findAccount(this._authInfo.accountUid)
    return !!accountV2
  }
}
