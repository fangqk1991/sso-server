import { AccountServer } from '@fangcha/account'
import { MyDatabase } from './MyDatabase'

export const MyAccountServer = new AccountServer({
  database: MyDatabase.ssoDB,
})
