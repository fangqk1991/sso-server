# sso-server

## Installation
```
# Use npm
npm install @fangcha/sso-server

# Or use yarn
yarn add @fangcha/sso-server
```

### Options
```
interface Options {
  database: FCDatabase
  accountServer: AccountServer
  redisConfig: RedisConfig

  webBaseURL: string
  webJwtSecret: string

  // Default: fc_sso_client
  tableName_SsoClient?: string

  // Default: fc_user_auth
  tableName_UserAuth?: string
}
```

## Usage
### Step 1. Use SsoServer
```
import { SsoServer } from '@fangcha/sso-server'
import { AccountServer } from '@fangcha/account'

export const MySsoServer = new SsoServer({
  database: <mysql connection>,
  redisConfig: <redis connection config>,
  webBaseURL: <webBaseURL>,
  webJwtSecret: <webJwtSecret>,
  accountServer: new AccountServer({
    database: <mysql connection>,
  }),
})
```

### Step 2. Use SsoWebPlugin
```
import { SsoWebPlugin } from '@fangcha/sso-server/lib/web-sdk'

const app = new FangchaApp({
  ……
  plugins: [
    SsoWebPlugin({
      backendPort: AuthConfig.webPort,
      ssoServer: MySsoServer,
    }),
    SsoClientsAutoReloadPlugin(MySsoServer),
  ],
})
app.launch()
```
