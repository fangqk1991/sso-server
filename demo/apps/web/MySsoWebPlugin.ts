import { SsoWebPlugin } from '../../../src/web-sdk'
import { MySsoServer } from '../../services/MySsoServer'

export const MySsoWebPlugin = SsoWebPlugin({
  ssoServer: MySsoServer,
})
