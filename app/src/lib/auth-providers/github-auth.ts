import { OAuthProvider } from '.'
import { Account, AccountType } from '../../models/account'
import { getDotComAPIEndpoint, getHTMLURL } from '../api'

import { request } from '../http'

const GitHubOAuthClientID = process.env.TEST_ENV ? '' : __OAUTH_CLIENT_ID__
const GitHubOAuthClientSecret = process.env.TEST_ENV ? '' : __OAUTH_SECRET__

if (!GitHubOAuthClientID || !GitHubOAuthClientSecret) {
  log.warn(
    `DESKTOP_OAUTH_CLIENT_ID and/or DESKTOP_OAUTH_CLIENT_SECRET is undefined. You won't be able to authenticate new users.`
  )
}

const OAuthScopes = ['repo', 'user', 'workflow']

export class GitHubEnterpriseAuthProvider extends OAuthProvider {
  private readonly endpoint: string

  public constructor(endpoint: string) {
    super()
    this.endpoint = endpoint
  }

  public getEndpoint(): string {
    return this.endpoint
  }

  public getAccountType(): AccountType {
    return 'GitHubEnterprise'
  }

  public getAuthorizationURL(state: string): string {
    const scope = OAuthScopes.join(' ')
    const domain = getHTMLURL(this.endpoint)
    return `${domain}/login/oauth/authorize?client_id=${GitHubOAuthClientID}&scope=${scope}&state=${state}`
  }

  public findAccount(accounts: ReadonlyArray<Account>): Account | null {
    return accounts.find(a => a.endpoint === this.endpoint) || null
  }

  public async deleteToken(account: Account): Promise<boolean> {
    try {
      const creds = Buffer.from(
        `${GitHubOAuthClientID}:${GitHubOAuthClientSecret}`
      ).toString('base64')
      const response = await request(
        account.endpoint,
        null,
        'DELETE',
        `applications/${GitHubOAuthClientID}/token`,
        { access_token: account.token },
        { Authorization: `Basic ${creds}` }
      )

      return response.status === 204
    } catch (e) {
      log.error(`deleteToken: failed with endpoint ${account.endpoint}`, e)
      return false
    }
  }

  public async requestOAuthToken(code: string): Promise<string | null> {
    try {
      const urlBase = getHTMLURL(this.endpoint)
      const response = await request(
        urlBase,
        null,
        'POST',
        'login/oauth/access_token',
        {
          client_id: GitHubOAuthClientID,
          client_secret: GitHubOAuthClientSecret,
          code: code,
        }
      )
      tryUpdateEndpointVersionFromResponse(this.endpoint, response)

      const result = await parsedResponse<IAPIAccessToken>(response)
      return result.access_token
    } catch (e) {
      log.warn(`requestOAuthToken: failed with endpoint ${this}`, e)
      return null
    }
  }
}

export class GitHubDotComAuthProvider extends GitHubEnterpriseAuthProvider {
  public constructor() {
    super(getDotComAPIEndpoint())
  }

  public getAccountType(): AccountType {
    return 'GitHubDotCom'
  }

  public findAccount(accounts: ReadonlyArray<Account>): Account | null {
    return accounts.find(a => a.endpoint === getDotComAPIEndpoint()) || null
  }
}
