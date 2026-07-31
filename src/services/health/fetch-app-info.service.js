/**
 * Returns information about the app in the format required by the info service
 * @module FetchAppInfoService
 */

// We use promisify to wrap exec in a promise. This allows us to await it without resorting to using callbacks.
import { exec as childProcessExec } from 'node:child_process'
import { promisify } from 'node:util'

import { titleCase } from '../../presenters/base.presenter.js'

const exec = promisify(childProcessExec)

/**
 * Returns information about the app in the format required by the info service
 *
 * @param {string} appName - Name of the app to fetch info for. Will be title-cased by the service so provide in
 * lowercase
 *
 * @returns {Promise<object>} An object containing the `name`, `serviceName`, `version`, `commit` & `jobs`
 */
export default async function fetchAppInfoService(appName) {
  return {
    commit: await _getCommitHash(),
    name: titleCase(appName),
    serviceName: appName,
    version: await _getTagReference()
  }
}

async function _getCommitHash() {
  try {
    const { stdout, stderr } = await exec('git rev-parse HEAD')

    return stderr ? `ERROR: ${stderr}` : stdout.replace('\n', '')
  } catch (error) {
    return `ERROR: ${error.message}`
  }
}

async function _getTagReference() {
  try {
    const { stdout, stderr } = await exec('git describe --always --tags')

    return stderr ? `ERROR: ${stderr}` : stdout.replace('\n', '')
  } catch (error) {
    return `ERROR: ${error.message}`
  }
}
