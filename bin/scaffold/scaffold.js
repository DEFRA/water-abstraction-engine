#!/usr/bin/env node

/**
 * Scaffolds a new journey in the app it is run from, for example water-abstraction-system. See bin/scaffold/README.md
 *
 * Usage, from the root of the app: npm run scaffold -- <path/name> <complete|view|submit>
 *
 * @module ScaffoldCli
 */

import { existsSync } from 'node:fs'
import { dirname, join, posix } from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'

import {
  presenterTemplate,
  presenterTestTemplate,
  snippetTemplate,
  submitServiceTemplate,
  submitServiceTestTemplate,
  validatorTemplate,
  validatorTestTemplate,
  viewServiceTemplate,
  viewServiceTestTemplate,
  viewTemplate
} from './templates.js'

const JOURNEYS = {
  complete: ['presenter', 'view', 'viewService', 'submitService', 'validator'],
  submit: ['submitService', 'validator'],
  view: ['presenter', 'view', 'viewService']
}

const TEMPLATES = {
  presenter: [presenterTemplate, presenterTestTemplate],
  submitService: [submitServiceTemplate, submitServiceTestTemplate],
  validator: [validatorTemplate, validatorTestTemplate],
  view: [viewTemplate],
  viewService: [viewServiceTemplate, viewServiceTestTemplate]
}

const [inputPath, journey] = process.argv.slice(2)

if (!inputPath || !JOURNEYS[journey]) {
  console.log('Usage: npm run scaffold -- <path/name> <complete|view|submit>')
  process.exit(1)
}

// Files are written relative to the app it is run from
const targetRoot = process.cwd()

const segments = inputPath.split('/')
const name = segments.pop()
const dir = segments.join('/')
const depth = segments.length
const names = { dir, name, pascalName: _pascalCase(name) }

const modules = {
  names,
  presenter: _module('presenters', `${name}.presenter.js`, 'presenter'),
  submitService: _module('services', `submit-${name}.service.js`, 'service'),
  validator: _module('validators', `${name}.validator.js`, 'validator'),
  view: { sourcePath: posix.join('src', 'views', dir, `${name}.njk`), viewPath: posix.join(dir, `${name}.njk`) },
  viewService: _module('services', `view-${name}.service.js`, 'service')
}

for (const key of JOURNEYS[journey]) {
  const [template, testTemplate] = TEMPLATES[key]

  await _render(modules[key].sourcePath, template(modules))

  if (testTemplate) {
    await _render(modules[key].testPath, testTemplate(modules))
  }
}

console.log('\nHere is your ready-to-use controller + router snippet:\n')
console.log(snippetTemplate(modules, JOURNEYS[journey]))

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

async function _render(path, content) {
  const fullPath = join(targetRoot, path)

  if (existsSync(fullPath)) {
    console.log(`⚠️  Skipped (already exists): ${path}`)

    return
  }

  await mkdir(dirname(fullPath), { recursive: true })
  await writeFile(fullPath, content)

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
