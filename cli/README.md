# Scaffold CLI

Generates the files for a new journey in water-abstraction-system or water-abstraction-external, then prints the controller and route code to paste in. Run it from the engine root:

```bash
npm run scaffold -- <path/name> <system|external> <complete|view|submit>

# e.g.
npm run scaffold -- notices/setup/my-page system complete
```

- `complete`: presenter, view, view service, submit service and validator
- `view`: presenter, view and view service
- `submit`: submit service and validator

Files that already exist are skipped.
