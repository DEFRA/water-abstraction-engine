# Entities

A **data object** is the single row a `tests/support/data/*.data.js` file builds for one table (e.g. `companyData()` returns the one `company` row). An **entity** is a complete, valid data group: several dependent data objects — and, where one already exists, other entities — composed by a `tests/support/entities/*.entity.js` file into the smallest whole that's valid/queryable on its own. It answers "what does a valid licence look like?", not "what does *this test* need a licence to look like?".

This is different from `tests/support/data/*.data.js` and `tests/support/scenarios/*.scenario.js`:

- A **data file** builds a single data object for a single table (e.g. `licence.data.js` builds just the `licence` row).
- An **entity file** composes several data objects — and, where one already exists, other entities — into the smallest valid whole (e.g. `licence.entity.js` composes a company and address as the licence holder, the licence itself, its permit licence, licence document, licence document header, licence document role, licence version, and a licence version purpose/point — because a licence isn't valid/queryable without them).
- A **scenario file** composes data objects, entities, and/or other scenario files into whatever a specific spec needs to seed, and is what `cli:seed.cli.js` lists for manual seeding.

## Why this exists

Scenario files used to reach a "valid licence" by importing another scenario file (e.g. `licence-with-charge-version.scenario.js` importing `licence.scenario.js`, which `registered-licence.scenario.js` or a water-company variant might then build on top of again). That works, but it means the definition of "a valid licence" lives inside a scenario file — one entry in a flat, cli:seed-pickable list — that other scenarios then have to import as if it were just another building block, several levels deep.

An entity file gives every scenario a single, direct place to get a valid instance of that entity, with no scenario-to-scenario chaining. A scenario file can still exist for the entity on its own (e.g. `licence.scenario.js` is a thin wrapper around `licence.entity.js`, kept so "just a licence" remains pickable in `cli:seed`), but anything composing *on top of* that entity should import the entity file directly, not the scenario file.

It also makes it simple for a scenario to use more than one of something — two licences, or a licence and a charge version — since calling `licenceEntity()` again (or combining it with another entity file) just works, without needing a scenario file purpose-built for that exact combination.

## Adding a new entity

Only pull an entity out of a scenario file once more than one scenario needs "a valid X" as a starting point (as happened with `licence`). A data file whose only caller is a single scenario doesn't need this — see `.agents/skills/scenarios/SKILL.md` for when a data file should be split, and `.agents/skills/standards/SKILL.md` for naming conventions.
