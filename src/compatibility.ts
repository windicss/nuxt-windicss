import chalk from 'chalk'
import semver from 'semver'
import { name as pkgName } from '../package.json'

export function requireNuxtVersion(currentVersion?: string, requiredVersion?: string) {
  if (!currentVersion || !requireNuxtVersion)
    return

  const _currentVersion = semver.coerce(currentVersion)!
  const _requiredVersion = semver.coerce(requiredVersion)!

  if (semver.lt(_currentVersion, _requiredVersion)) {
    throw new Error(`\n
      ${chalk.cyan(pkgName)} is not compatible with your current Nuxt version : ${chalk.yellow(`v${currentVersion}`)}\n
      Required: ${chalk.green(`v${requiredVersion}`)} or ${chalk.cyan('higher')}
    `)
  }
}
