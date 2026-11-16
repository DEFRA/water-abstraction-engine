# Scaffold

Generates the files for a new journey, then prints the controller and route code to paste in. Run it from the root of [water-abstraction-system](https://github.com/DEFRA/water-abstraction-system) or [water-abstraction-external](https://github.com/DEFRA/water-abstraction-external):

```bash
npm run scaffold -- <path/name> <complete|view|submit>

# e.g.
npm run scaffold -- notices/setup/my-page complete
```

- `complete`: presenter, view, view service, submit service and validator
- `view`: presenter, view and view service
- `submit`: submit service and validator

Files that already exist are skipped.
