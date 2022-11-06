import { FangchaApp } from '@fangcha/backend-kit'
import { SsoClientsAutoReloadPlugin } from '../../src/sdk'
import { MySsoServer } from '../services/MySsoServer'
import { MySsoWebPlugin } from './MySsoWebPlugin'

const app = new FangchaApp({
  env: 'development',
  appName: 'sso-web',
  plugins: [MySsoWebPlugin, SsoClientsAutoReloadPlugin(MySsoServer)],
})
app.launch()
