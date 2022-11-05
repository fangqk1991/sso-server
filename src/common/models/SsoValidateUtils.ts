import { SsoClientParams } from './oauth'
import assert from '@fangcha/assert'

export class SsoValidateUtils {
  public static getClearClientParams(params: Partial<SsoClientParams>) {
    const options: Partial<SsoClientParams> = {}
    if (params.clientId !== undefined) {
      assert.ok(/^[a-zA-Z0-9_-]{1,32}$/.test(params.clientId), 'clientId 需满足规则 /^[a-zA-Z0-9_-]{1,32}$/')
      options.clientId = params.clientId
    }
    if (params.name !== undefined) {
      assert.ok(!!params.name, `名称不能为空`)
      options.name = params.name
    }
    if (params.redirectUriList !== undefined) {
      assert.ok(Array.isArray(params.redirectUriList), `redirectUriList 为文本数组`)
      options.redirectUriList = params.redirectUriList
    }
    if (params.scopeList !== undefined) {
      assert.ok(Array.isArray(params.scopeList), `scopeList 为文本数组`)
      options.scopeList = params.scopeList
    }
    if (params.eventList !== undefined) {
      assert.ok(Array.isArray(params.eventList), `eventList 为文本数组`)
      options.eventList = params.eventList
    }
    if (params.autoGranted !== undefined) {
      assert.ok(/^[01]$/.test(`${params.autoGranted}`), 'autoGranted 需满足规则 /^[01]$/')
      options.autoGranted = Number(params.autoGranted)
    }
    if (params.isPartner !== undefined) {
      assert.ok(/^[01]$/.test(`${params.isPartner}`), 'autoGranted 需满足规则 /^[01]$/')
      options.isPartner = Number(params.isPartner)
    }
    if (params.notifyUrl !== undefined) {
      options.notifyUrl = params.notifyUrl || ''
    }
    return options
  }
}
