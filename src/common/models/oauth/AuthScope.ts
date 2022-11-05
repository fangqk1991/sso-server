import { Descriptor } from '@fangcha/tools'

export enum AuthScope {
  Nothing = 'nothing',
  Basic = 'basic',
}

const values = [AuthScope.Nothing, AuthScope.Basic]

const describe = (code: AuthScope) => {
  return code
}

export const AuthScopeDescriptor = new Descriptor(values, describe)
