import { AppPluginProtocol } from '@fangcha/backend-kit/lib/basic'
import { LoopPerformerHelper } from '@fangcha/backend-kit'
import { SsoClientManager } from '../SsoClientManager'

export const SsoClientsAutoReloadPlugin = (ssoServer: SsoClientManager): AppPluginProtocol => {
  return {
    appDidLoad: async () => {
      await ssoServer.clientUtils.reloadClientsData()
      LoopPerformerHelper.loopHandle(async () => {
        await ssoServer.clientUtils.reloadClientsData()
      })
    },
  }
}
