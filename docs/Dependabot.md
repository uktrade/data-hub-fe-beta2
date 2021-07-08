# Managing Dependabot PRs

This is the process we have identified for dealing with Dependabot PRs that saves developer time and CircleCI resource.

1. Create a new branch called `chore/dependencies-[yyyy-mm-dd]`, inserting today’s date.
2. Open each Dependabot PR and check that the tests have passed. Re-run any failing tests as the majority of failures are caused by timeouts or flakiness. Codecov failures can be ignored. If the PR contains any persistently failing tests, create a maintenance ticket for it and move on (these will be picked up as part of live support or maintenance sprint).
3. Once all tests have passed, edit the PR so that the base branch is the `chore/dependencies` one. You should now be able to merge the PR without needing to request reviews.
4. Repeat steps 2 and 3 until all PRs are either merged or identified as needing further work.
5. After all the PRs have been merged, checkout the local branch and run ```npm install```, then commit any changes to `package-lock.json`.
6. If required, carry out the appropriate tasks listed in the 'Additional actions' section below.
7. Build and run Storybook to ensure it works correctly.
8. Rebase the dependency branch against `master` to remove all the merge commits, then push the changes and open a PR.
9. Ensure that the Heroku app deploys correctly, and carry out some basic smoke tests to ensure that nothing unexpected has happened.
10. If you are satisfied that everything is in order and all the tests have passed, request reviews as normal.
11. After merging the PR, ensure that Storybook is running properly (sometimes it breaks silently due to Dependabot changes).

## Additional actions

For some dependencies, additional updates and changes are required. These can be added in as part of the main Dependabot PR.

### Cypress

When Cypress is updated, the version used in [`Dockerfile.dependencies`](https://github.com/uktrade/data-hub-frontend/blob/master/Dockerfile.dependencies#L56) needs to be updated as well.

### Elasticsearch

If the Elasticsearch version has been updated in the API, the version used in [`docker-compose.e2e.backend`](https://github.com/uktrade/data-hub-frontend/blob/master/docker-compose.e2e.backend.yml#L57) needs to be updated to match.

### Storybook

When one of the `@storybook` dependencies is updated, the others need to be updated to match.
