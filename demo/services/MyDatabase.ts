import { FCDatabase } from 'fc-sql'
import { DBOptionsBuilder } from '@fangcha/tools/lib/database'
import { DemoConfig } from '../DemoConfig'

FCDatabase.instanceWithName('ssoDB').init(new DBOptionsBuilder(DemoConfig.mysql.ssoDB).build())

export const MyDatabase = {
  ssoDB: FCDatabase.instanceWithName('ssoDB'),
}
