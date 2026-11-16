#!/usr/bin/env node

/**
 * Scaffolds a new journey in the app it is run from, for example water-abstraction-system. See bin/scaffold/README.md
 *
 * Usage, from the root of the app: npm run scaffold -- <path/name> <check|complete|view|submit>
 *
 * @module ScaffoldCli
 */

import { existsSync } from 'node:fs'
import { dirname, join, posix } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const TEMPLATES_DIR = fileURLToPath(new URL('./templates/', import.meta.url))

// Each entry is the template to use and the module it creates
const JOURNEYS = {
  check: [
    ['check.presenter.js', 'presenter'],
    ['view.njk', 'view'],
    ['view-check.service.js', 'viewService'],
    ['submit-check.service.js', 'submitService']
  ],
  complete: [
    ['presenter.js', 'presenter'],
    ['view.njk', 'view'],
    ['view.service.js', 'viewService'],
    ['submit.service.js', 'submitService'],
    ['validator.js', 'validator']
  ],
  submit: [
    ['submit.service.js', 'submitService'],
    ['validator.js', 'validator']
  ],
  view: [
    ['presenter.js', 'presenter'],
    ['view.njk', 'view'],
    ['view.service.js', 'viewService']
  ]
}

const [inputPath, journey] = process.argv.slice(2)

if (!inputPath || !JOURNEYS[journey]) {
  console.log('Usage: npm run scaffold -- <path/name> <check|complete|view|submit>')
  process.exit(1)
}

// Files are written relative to the app it is run from
const targetRoot = process.cwd()

const segments = inputPath.split('/')
const name = segments.pop()
const dir = segments.join('/')
const depth = segments.length

const modules = {
  presenter: _module('presenters', `${name}.presenter.js`, 'presenter'),
  submitService: _module('services', `submit-${name}.service.js`, 'service'),
  validator: _module('validators', `${name}.validator.js`, 'validator'),
  view: { sourcePath: posix.join('src', 'views', dir, `${name}.njk`) },
  viewService: _module('services', `view-${name}.service.js`, 'service')
}

// Placeholders that are the same in every template
const placeholders = {
  __PRESENTER_NAME__: modules.presenter.moduleName,
  __PRESENTER_PATH__: modules.presenter.srcImportPath,
  __ROUTE_BASE__: dir ? `/${dir}` : '',
  __ROUTE_PATH__: `/${posix.join(dir, '{sessionId}', name)}`,
  __SUBMIT_HANDLER_NAME__: `submit${_pascalCase(name)}`,
  __SUBMIT_SERVICE_NAME__: modules.submitService.moduleName,
  __SUBMIT_SERVICE_PATH__: modules.submitService.controllerImportPath,
  __VALIDATOR_NAME__: modules.validator.moduleName,
  __VALIDATOR_PATH__: modules.validator.srcImportPath,
  __VIEW_HANDLER_NAME__: `view${_pascalCase(name)}`,
  __VIEW_PATH__: posix.join(dir, `${name}.njk`),
  __VIEW_SERVICE_NAME__: modules.viewService.moduleName,
  __VIEW_SERVICE_PATH__: modules.viewService.controllerImportPath
}

for (const [template, key] of JOURNEYS[journey]) {
  const module = modules[key]
  const testTemplate = template.replace(/\.js$/, '.test.js')

  await _render(template, module.sourcePath, module)

  if (testTemplate !== template) {
    await _render(testTemplate, module.testPath, module)
  }
}

const helper = journey === 'check' ? 'check.helper.js' : 'helper.js'

console.log('\nHere is your ready-to-use controller + router snippet:\n')
console.log(_fill(await readFile(join(TEMPLATES_DIR, helper), 'utf8'), {}))

function _fill(content, module) {
  const values = {
    ...placeholders,
    __DESCRIBE_LABEL__: module.describeLabel,
    __FUNCTION_NAME__: module.functionName,
    __MODULE_NAME__: module.moduleName,
    __REQUIRE_PATH__: module.testImportPath
  }

  return content.replace(/__[A-Z]+(?:_[A-Z]+)*__/g, (placeholder) => {
    return values[placeholder] ?? placeholder
  })
}

function _module(folder, fileName, type) {
  const stem = fileName.replace(/\.[a-z]+\.js$/, '')
  const sourcePath = posix.join('src', folder, dir, fileName)
  const dirLabel = segments.map(_titleCase).join(' - ')

  return {
    controllerImportPath: `../${posix.join(folder, dir, fileName)}`,
    describeLabel: [dirLabel, `${_titleCase(stem)} ${type}`].filter(Boolean).join(' - '),
    functionName: _camelCase(fileName),
    moduleName: _pascalCase(fileName),
    sourcePath,
    srcImportPath: `${'../'.repeat(depth + 1)}${posix.join(folder, dir, fileName)}`,
    testImportPath: `${'../'.repeat(depth + 2)}${sourcePath}`,
    testPath: posix.join('test', folder, dir, fileName.replace(/\.js$/, '.test.js'))
  }
}

async function _render(template, path, module) {
  const fullPath = join(targetRoot, path)

  if (existsSync(fullPath)) {
    console.log(`⚠️  Skipped (already exists): ${path}`)

    return
  }

  const content = await readFile(join(TEMPLATES_DIR, template), 'utf8')

  await mkdir(dirname(fullPath), { recursive: true })
  await writeFile(fullPath, _fill(content, module))

  console.log(`✅ Created ${path}`)
}

function _camelCase(value) {
  const pascal = _pascalCase(value)

  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

function _pascalCase(value) {
  return _words(value.replace(/\.js$/, '')).join('')
}

function _titleCase(value) {
  return _words(value).join(' ')
}

function _words(value) {
  return value
    .split(/[-_.]+/)
    .filter(Boolean)
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
}
