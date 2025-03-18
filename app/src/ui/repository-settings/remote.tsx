import * as React from 'react'
import { IRemote } from '../../models/remote'
import { TextBox } from '../lib/text-box'
import { DialogContent } from '../dialog'

interface IRemoteProps {
  /** The remote being shown. */
  readonly remote: IRemote

  /** The default branch being shown. */
  readonly defaultBranch: string | undefined

  /** The function to call when the remote URL is changed by the user. */
  readonly onRemoteUrlChanged: (url: string) => void

  /** The function to call when the default branch is changed by the user. */
  readonly onDefaultBranchChanged: (branch: string) => void
}

/** The Remote component. */
export class Remote extends React.Component<IRemoteProps, {}> {
  public render() {
    const { remote, defaultBranch } = this.props
    return (
      <DialogContent>
        <div className="config-row">
          <p>Primary remote repository ({remote.name})</p>
          <TextBox
            placeholder="Remote URL"
            value={remote.url}
            onValueChanged={this.props.onRemoteUrlChanged}
          />
        </div>
        <div className="config-row">
          <p>Override the remote's default branch</p>
          <TextBox
            placeholder="Default branch"
            value={defaultBranch}
            onValueChanged={this.props.onDefaultBranchChanged}
          />
        </div>
      </DialogContent>
    )
  }
}
