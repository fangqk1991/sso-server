import { SpecFactory } from '@fangcha/router'
import { FangchaSession } from '@fangcha/router/lib/session'
import { SsoClientSpecHandler } from './SsoClientSpecHandler'
import { SsoClientApis } from '../common/admin-api'
import { SsoServer } from '../SsoServer'
import { SsoClientParams } from '../common/models'

const factory = new SpecFactory('SSO Client')

factory.prepare(SsoClientApis.ClientPageDataGet, async (ctx) => {
  // const session = ctx.session as FangchaSession
  // session.assertVisitorHasPermission(SsoAdminPermissionKey.OAuthApps)
  const ssoServer = ctx.ssoServer as SsoServer
  ctx.body = await ssoServer.SsoClient.getPageResult(ctx.request.query)
})

factory.prepare(SsoClientApis.MyClientPageDataGet, async (ctx) => {
  const session = ctx.session as FangchaSession
  const ssoServer = ctx.ssoServer as SsoServer
  ctx.body = await ssoServer.SsoClient.getPageResult({
    ...ctx.request.query,
    lockedUser: session.curUserStr(),
  })
})

factory.prepare(SsoClientApis.ClientInfoGet, async (ctx) => {
  await new SsoClientSpecHandler(ctx).handle(async (client) => {
    ctx.body = client.getModelForAdmin()
  })
})

factory.prepare(SsoClientApis.ClientCreate, async (ctx) => {
  const session = ctx.session as FangchaSession
  const ssoServer = ctx.ssoServer as SsoServer
  const client = await ssoServer.generateClient(ctx.request.body, session.curUserStr())
  const data = client.getModelForAdmin()
  data.clientSecret = client.clientSecret
  ctx.body = data
})

factory.prepare(SsoClientApis.ClientInfoUpdate, async (ctx) => {
  const session = ctx.session as FangchaSession
  await new SsoClientSpecHandler(ctx).handle(async (client) => {
    const options = ctx.request.body as SsoClientParams
    // if (!session.checkVisitorHasPermission(SsoAdminPermissionKey.OAuthApps)) {
    //   delete options.scopeList
    //   delete options.eventList
    //   delete options.autoGranted
    //   delete options.isPartner
    // }
    await client.updateInfos(options, session.curUserStr())
    ctx.body = client.getModelForAdmin()
  })
})

factory.prepare(SsoClientApis.ClientDelete, async (ctx) => {
  await new SsoClientSpecHandler(ctx).handle(async (client) => {
    await client.deleteFromDB()
    ctx.status = 200
  })
})

factory.prepare(SsoClientApis.ClientAuthPageDataGet, async (ctx) => {
  const ssoServer = ctx.ssoServer as SsoServer
  await new SsoClientSpecHandler(ctx).handle(async (client) => {
    ctx.body = await ssoServer.UserAuth.getPageResult({
      ...ctx.request.query,
      isEnabled: 1,
      clientId: client.clientId,
    })
  })
})

export const SsoClientSpecs = factory.buildSpecs()