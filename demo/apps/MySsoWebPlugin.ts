import { SsoWebPlugin } from '../../src/web-sdk'
import { MySsoServer } from '../services/MySsoServer'
import { DemoConfig } from '../DemoConfig'

export const MySsoWebPlugin = SsoWebPlugin({
  backendPort: DemoConfig.webPort,
  ssoServer: MySsoServer,
})
