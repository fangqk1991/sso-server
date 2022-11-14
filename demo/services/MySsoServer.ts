import { AccountServer } from '@fangcha/account'
import { SsoServer } from '../../src'
import { MyDatabase } from './MyDatabase'
import { DemoConfig } from '../DemoConfig'

export const MySsoServer = new SsoServer({
  database: MyDatabase.ssoDB,
  redisConfig: DemoConfig.redisCache,
  accountServer: new AccountServer({
    database: MyDatabase.ssoDB,
  }),
})
