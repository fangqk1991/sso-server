import { GlobalAppConfig } from 'fc-config'

export const DemoConfig = GlobalAppConfig as {
  webPort: number
  webBaseURL: string
  webJwtSecret: string
  mysql: {
    ssoDB: any
  }
  redisCache: {
    host: string
    port: number
  }
}
