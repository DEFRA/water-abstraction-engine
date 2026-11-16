# Scaffold

Generates the files for a new journey, then prints the controller and route code to paste in. Run it from the root of [water-abstraction-system](https://github.com/DEFRA/water-abstraction-system) or [water-abstraction-external](https://github.com/DEFRA/water-abstraction-external):

```bash
npm run scaffold -- <path/name> <check|complete|view|submit>

# e.g.
npm run scaffold -- notices/setup/my-page complete
```

- `check`: the journey's check page: presenter, view, a view service that marks the check page as visited, and a submit service. Use the name `check`, e.g. `notices/setup/check`
- `complete`: presenter, view, view service, submit service and validator
- `view`: presenter, view and view service
- `submit`: submit service and validator

Pages link back to and redirect to the journey's check page once it has been visited, using `checkUrl()` from `water-abstraction-engine/lib/check-page.lib.js`. Files that already exist are skipped.
