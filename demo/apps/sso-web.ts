import { SsoClientsAutoReloadPlugin } from '../../src/sdk'
import { MySsoServer } from '../services/MySsoServer'
import { MySsoWebPlugin } from './web/MySsoWebPlugin'
import { WebApp } from '@fangcha/backend-kit/lib/router'
import { DemoConfig } from '../DemoConfig'

const app = new WebApp({
  env: 'development',
  appName: 'sso-web',
  routerOptions: {
    backendPort: DemoConfig.webPort,
    baseURL: DemoConfig.webBaseURL,
    jwtProtocol: {
      jwtKey: 'sso_web_jwt',
      jwtSecret: DemoConfig.webJwtSecret,
    },
  },
  plugins: [MySsoWebPlugin, SsoClientsAutoReloadPlugin(MySsoServer)],
})
app.launch()
