import { SsoClientsAutoReloadPlugin } from '../../src/sdk'
import { MySsoServer } from '../services/MySsoServer'
import { MySsoWebPlugin } from './web/MySsoWebPlugin'
import { WebApp } from '@fangcha/backend-kit/lib/router'
import { DemoConfig } from '../DemoConfig'
import { _FangchaState } from '@fangcha/backend-kit'

const app = new WebApp({
  env: 'development',
  appName: 'sso-web',
  useJwtSpecs: true,
  appDidLoad: async () => {
    Object.assign(_FangchaState.frontendConfig, {
      appName: 'SSO Demo',
      background: 'background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
      logoCss: 'linear-gradient(to top, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%)',
    })
  },
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
