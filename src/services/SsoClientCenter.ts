import { SsoClientFromOAuth } from '../common/models'
import { _SsoClient } from '../models/extensions/_SsoClient'

export class SsoClientCenter {
  private readonly SsoClient!: { new (): _SsoClient } & typeof _SsoClient
  private _clientMap: { [p: string]: SsoClientFromOAuth }

  public constructor(SsoClient: { new (): _SsoClient } & typeof _SsoClient) {
    this.SsoClient = SsoClient
    this._clientMap = {}
  }

  public async reloadClientsData() {
    console.debug(`Reload SSO Clients Data`)
    const searcher = new this.SsoClient().fc_searcher()
    searcher.processor().addConditionKV('is_enabled', 1)
    const feeds = await searcher.queryAllFeeds()
    const clients = feeds.map((feed) => feed.getClientModel())
    this._clientMap = clients.reduce((result, feed) => {
      result[feed.clientId] = feed
      return result
    }, {})
  }

  public checkClientExists(clientId: string) {
    return !!this._clientMap[clientId]
  }

  public getOAuthClient(clientId: string) {
    return this._clientMap[clientId] || null
  }

  public findOAuthClient(clientId: string, clientSecret: string) {
    const client = this._clientMap[clientId]
    if (client && client.clientSecret === clientSecret) {
      return client
    }
    return null
  }
}
