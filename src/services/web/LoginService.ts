import { Context } from 'koa'
import { SsoSession } from './SsoSession'
import { _Account } from '@fangcha/account'
import { AccountErrorPhrase, AccountSimpleParams, CarrierType } from '@fangcha/account/lib/common/models'
import { AppException } from '@fangcha/app-error'
import { SsoServer } from '../../SsoServer'

export class LoginService {
  public readonly ctx: Context

  constructor(ctx: Context) {
    this.ctx = ctx
  }

  public async onLoginSuccess(accountV2: _Account) {
    if (!accountV2.isEnabled) {
      throw AppException.exception(AccountErrorPhrase.AccountHasBeenBlocked)
    }
    const ctx = this.ctx
    const session = ctx.session as SsoSession
    const coreInfo = await accountV2.getVisitorCoreInfo()
    await session.login(coreInfo, ctx)
    ctx.status = 200
  }

  public async loginWithEmail(params: AccountSimpleParams) {
    const ssoServer = this.ctx.ssoServer as SsoServer
    const carrier = await ssoServer.accountServer.findCarrier(CarrierType.Email, params.email)
    if (!carrier) {
      throw AppException.exception(AccountErrorPhrase.AccountNotExists)
    }
    const account = await ssoServer.accountServer.findAccount(carrier.accountUid)
    account.assertPasswordCorrect(params.password)
    await this.onLoginSuccess(account)
  }
}
