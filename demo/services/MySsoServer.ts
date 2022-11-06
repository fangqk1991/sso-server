import { AccountServer } from '@fangcha/account'
import { SsoServer } from '../../src'
import { MyDatabase } from './MyDatabase'
import { DemoConfig } from '../DemoConfig'

export const MySsoServer = new SsoServer({
  database: MyDatabase.ssoDB,
  redisConfig: DemoConfig.redisCache,
  webBaseURL: DemoConfig.webBaseURL,
  webJwtSecret: DemoConfig.webJwtSecret,
  accountServer: new AccountServer({
    database: MyDatabase.ssoDB,
  }),
})