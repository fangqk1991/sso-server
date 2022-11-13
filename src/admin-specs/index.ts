import { SwaggerDocItem } from '@fangcha/router'
import { SsoClientSpecs } from './SsoClientSpecs'

export const SsoClientDocItem: SwaggerDocItem = {
  name: 'SSO Admin',
  pageURL: '/api-docs/v1/sso-admin',
  specs: SsoClientSpecs,
}
