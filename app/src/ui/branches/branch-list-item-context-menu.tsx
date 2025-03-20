import { IMenuItem } from '../../lib/menu-item'
import { clipboard } from 'electron'

interface IBranchContextMenuConfig {
  name: string
  nameWithoutRemote: string
  isLocal: boolean
  onRenameBranch?: (branchName: string) => void
  onViewPullRequestOnGitHub?: () => void
  onMakeDefaultBranch?: (branchName: string) => void
  onDeleteBranch?: (branchName: string) => void
}

export function generateBranchContextMenuItems(
  config: IBranchContextMenuConfig
): IMenuItem[] {
  const {
    name,
    nameWithoutRemote,
    isLocal,
    onRenameBranch,
    onViewPullRequestOnGitHub,
    onMakeDefaultBranch,
    onDeleteBranch,
  } = config
  const items = new Array<IMenuItem>()

  if (onRenameBranch !== undefined) {
    items.push({
      label: 'Rename…',
      action: () => onRenameBranch(name),
      enabled: isLocal,
    })
  }

  items.push({
    label: __DARWIN__ ? 'Copy Branch Name' : 'Copy branch name',
    action: () => clipboard.writeText(name),
  })

  if (onViewPullRequestOnGitHub !== undefined) {
    items.push({
      label: 'View Pull Request on GitHub',
      action: () => onViewPullRequestOnGitHub(),
    })
  }

  if (onMakeDefaultBranch !== undefined) {
    items.push({
      label: __DARWIN__ ? 'Make The Default Branch' : 'Make the default branch',
      action: () => onMakeDefaultBranch(nameWithoutRemote),
    })
  }

  items.push({ type: 'separator' })

  if (onDeleteBranch !== undefined) {
    items.push({
      label: 'Delete…',
      action: () => onDeleteBranch(name),
    })
  }

  return items
}
