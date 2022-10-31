import chalk from 'chalk'
import fs from 'node:fs'
import cp from 'node:child_process'

import { getNow } from 'easy-fns-ts/dist/lib'
import pkg from '../../package.json'

const title = (stage: string) =>
  chalk.magenta.bgBlack(
    `[${pkg.name.toUpperCase()}] - [${getNow()}] - [${stage}]`
  )

export const BuildUtilsLog = (msg: string, stage = 'Log') => {
  console.log(`${title(stage)}: ${msg}`)
}

export const writeIntoLog = (title: string, command: string, path: string) => {
  const prefix = (msg: string, emoji: string) =>
    `
/**
 * ==============================================
 * ==============================================
 * ${title} - ${msg} - ${emoji} - ${getNow()}
 * ==============================================
 * ==============================================
 */
`

  const log_file = fs.createWriteStream(path, {
    flags: 'w',
  })

  const start = new Date().getTime()

  cp.exec(command, (error, stdout, stderr) => {
    const end = new Date().getTime()

    const cost = new Date(end - start).getSeconds()

    BuildUtilsLog(chalk.blue(`${title} done in ${cost}s`))

    if (error) {
      log_file.write(
        prefix('Error', '😈😈😈😈😈') + JSON.stringify(error),
        () => {
          // // recover icon file if failed
          // cp.execSync('npm run postbuild')

          BuildUtilsLog(
            chalk.red.bgBlack(`${title} Failed, see more in ${path}`)
          )
        }
      )
    } else {
      BuildUtilsLog(chalk.green.bgBlack(`${title} Successfully! ✨✨✨✨✨ `))
    }

    if (stdout) {
      log_file.write(prefix('Std Out', '✨✨✨✨✨') + stdout, () => {
        BuildUtilsLog(
          chalk.magenta.bgBlack(`${title} Std out, see more in ${path}`)
        )
      })
    }

    if (stderr) {
      log_file.write(prefix('Std Err', '💊💊💊💊💊') + stderr, () => {
        BuildUtilsLog(
          chalk.yellow.bgBlack(`${title} Std Error, see more in ${path}`)
        )
      })
    }
  })
}
