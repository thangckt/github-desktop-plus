import { OAuthProvider } from '.'
import { Account, AccountType } from '../../models/account'
import { request } from '../http'

const BitbucketOAuthClientID = process.env.TEST_ENV
  ? ''
  : __OAUTH_CLIENT_ID_BITBUCKET__
const BitbucketOAuthClientSecret = process.env.TEST_ENV
  ? ''
  : __OAUTH_SECRET_BITBUCKET__

if (!BitbucketOAuthClientID || !BitbucketOAuthClientSecret) {
  log.warn(
    `DESKTOP_OAUTH_CLIENT_ID_BITBUCKET and/or DESKTOP_OAUTH_CLIENT_SECRET_BITBUCKET is undefined. You won't be able to authenticate new users.`
  )
}

const BitbucketAPIDomain = 'https://bitbucket.org'

export class BitbucketAuthProvider extends OAuthProvider {
  public getEndpoint(): string {
    return BitbucketAPIDomain
  }

  public getAccountType(): AccountType {
    return 'Bitbucket'
  }

  public getAuthorizationURL(): string {
    return `${BitbucketAPIDomain}/site/oauth2/authorize?client_id=${BitbucketOAuthClientID}&response_type=code`
  }

  public findAccount(accounts: ReadonlyArray<Account>): Account | null {
    return accounts.find(a => a.endpoint === BitbucketAPIDomain) || null
  }

  public async deleteToken(account: Account): Promise<boolean> {
    // TODO: Implement this
    try {
      const creds = Buffer.from(
        `${BitbucketOAuthClientID}:${BitbucketOAuthClientSecret}`
      ).toString('base64')
      const response = await request(
        account.endpoint,
        null,
        'DELETE',
        `applications/${BitbucketOAuthClientID}/token`,
        { access_token: account.token },
        { Authorization: `Basic ${creds}` }
      )

      return response.status === 204
    } catch (e) {
      log.error(`deleteToken: failed with endpoint ${account.endpoint}`, e)
      return false
    }
  }
}
