import { LoginSpecs } from './LoginSpecs'
import { AuthSwaggerModelList } from '../common/models'
import { SignupSpecs } from './SignupSpecs'
import { OAuthSpecs } from './OAuthSpecs'
import { SwaggerDocItem } from '@fangcha/router'

export * from './LoginSpecs'
export * from './OAuthSpecs'
export * from './SignupSpecs'

export const SsoServerDocItem: SwaggerDocItem = {
  name: 'SSO',
  pageURL: '/api-docs/v1/sso-sdk',
  specs: [...LoginSpecs, ...SignupSpecs, ...OAuthSpecs],
  models: AuthSwaggerModelList,
}
