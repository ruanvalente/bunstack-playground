# Pull Request Template

## Summary

Configure separate deployment workflows for development and production environments using GitHub Actions and Fly.io

## Type

- [ ] feat
- [ ] fix
- [ ] docs
- [ ] style
- [ ] refactor
- [ ] perf
- [ ] test
- [ ] build
- [x] ci
- [ ] chore
- [ ] revert

## Changes

- Updated .github/workflows/deploy.yml with two deployment targets:
  - Push to `development` branch → deploy to `bunstack-dev` app
  - Push to `master` branch → deploy to `bunstack-playground` app
- Added separate lint job that runs on all pushes and PRs
- Deploy job only runs after lint passes and only on development/master pushes
- Added PR.md template for pull requests

## Test

- Create Fly.io app for development: `fly apps create bunstack-dev`
- Deploy to development: `fly deploy --app bunstack-dev --remote-only`
- Test workflow by pushing to development branch

## Screenshots (if applicable)
