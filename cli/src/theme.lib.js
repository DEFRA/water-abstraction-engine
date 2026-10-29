import { styleText } from 'node:util'

/**
 * Generate the CLI theme configuration object
 *
 * See {@link https://github.com/SBoudrias/Inquirer.js/tree/main/packages/search#Theming | theming} for more details.
 *
 * @param {string} tabText - Text to show for the Tab key tip
 *
 * @returns {object} the CLI theme configuration object
 */
export function cliTheme(tabText) {
  return {
    style: {
      keysHelpTip: (keys) => {
        const allKeys = [...keys, ['Esc', 'exit'], ['Tab', tabText]]

        const styledKeys = allKeys.map(([key, action]) => {
          return `${styleText('bold', key)} ${styleText('dim', action)}`
        })

        return styledKeys.join(styleText('dim', ' • '))
      }
    }
  }
}
