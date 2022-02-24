# RSS3 Github Action

Update a users feed to reflect changes in a Github Repository.

## Setup

* Have a copy of your private key
* Add an environment secret to your repository named `PRIVATEKEY` using this [guide][repo-secret].
[For more info on how Github secures your encrypted secret][secret]
* Optionally add a custom

### Usage

Add this Action as a [step][job-step] to your project's GitHub Action Workflow file:

```yaml
- name: Post to RSS3
  id: RSS3
  uses: t-900-a/action-push-rss3@v0.0.1
  env:
    ENDPOINT: ${{ secrets.ENDPOINT }}
    PRIVATEKEY: ${{ secrets.PRIVATEKEY }}
```

## Contributing

See [CONTRIBUTING](.github/contributing.md).
## License

See [LICENSE](LICENSE).

[job-step]: https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idsteps
[repo-secret]: https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository
[secret]: https://docs.github.com/en/actions/security-guides/encrypted-secrets
