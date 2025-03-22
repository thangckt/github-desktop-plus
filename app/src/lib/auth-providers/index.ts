import { Account, AccountType } from '../../models/account'

export abstract class OAuthProvider {
  public abstract getEndpoint(): string
  public abstract getAccountType(): AccountType
  public abstract getAuthorizationURL(state: string): string
  public abstract findAccount(accounts: ReadonlyArray<Account>): Account | null
  public abstract deleteToken(account: Account): Promise<boolean>

  public toString() {
    return `${this.getAccountType()} (${this.getEndpoint()})`
  }
}
