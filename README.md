[![Deploy](https://github.com/SillyCoon/grumma/actions/workflows/deploy.yaml/badge.svg)](https://github.com/SillyCoon/grumma/actions/workflows/deploy.yaml)

# Grumma web app

Code of web app for learning Russian language.
It's now hardcoded to our own grammar dataset + Supabase auth, but if there will be potential it's possible to make it more agile.

## Env variables

Vite substitutes `import.meta.env...` env variables at build time.
Meanwhile you can use `process.env...` to access env variables passed in runtime.
