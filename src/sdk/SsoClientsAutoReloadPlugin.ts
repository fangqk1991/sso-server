import { AppPluginProtocol } from '@fangcha/backend-kit/lib/basic'
import { SsoServer } from '../SsoServer'
import { LoopPerformerHelper } from '@fangcha/backend-kit'

export const SsoClientsAutoReloadPlugin = (ssoServer: SsoServer): AppPluginProtocol => {
  return {
    appDidLoad: async () => {
      await ssoServer.clientUtils.reloadClientsData()
      LoopPerformerHelper.loopHandle(async () => {
        await ssoServer.clientUtils.reloadClientsData()
      })
    },
  }
}
