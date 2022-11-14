import { SsoServer } from '../../src'
import { MyDatabase } from './MyDatabase'
import { DemoConfig } from '../DemoConfig'
import { MyAccountServer } from './MyAccountServer'

export const MySsoServer = new SsoServer({
  database: MyDatabase.ssoDB,
  redisConfig: DemoConfig.redisCache,
  accountServer: MyAccountServer,
})
