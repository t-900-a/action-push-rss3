const github = require('@actions/github');
const RSS3 = require('rss3').default;

module.exports = async function rss3Push(core) {
  try {
    const endpoint = (process.env.ENDPOINT === undefined) ? 'https://prenode.rss3.dev' : process.env.ENDPOINT;
    const privateKey = process.env.PRIVATEKEY;

    if (privateKey === undefined || privateKey.length !== 64) {
      throw new Error('Need to provide valid private key');
    }

    const rss3 = new RSS3({
      endpoint,
      privateKey,
    });

    const { event } = github.context.payload;

    const post = {
      tags: ['github', 'buidl'],
    };

    switch (github.context.payload.event_name) {
      case 'push':
        post.title = `New commit from ${event.pusher.name} to ${event.repository.full_name}`;
        post.summary = `${event.head_commit.message}`;
        post.links = [
          {
            type: 'text/html',
            identifier_custom: `${event.head_commit.url}`,
          },
        ];
        break;
      case 'release':
        post.title = `New Release published ${event.repository.name} - ${event.release.name}`;
        post.summary = `New ${event.repository.name} release now available`;
        post.attachments = [
          {
            name: 'Release Download',
            address: [`${event.release.zipball_url}`],
            mime_type: 'application/zip',

          },
        ];
        post.links = [
          {
            type: 'text/html',
            identifier_custom: `${event.release.html_url}`,
          },
        ];
        break;
      case 'issues':
        post.title = `New issue created in ${event.repository.full_name}`;
        post.summary = 'issue title todo';
        break;
      case 'pull_request':
        post.title = `New pull request ${event.repository.name}`;
        post.summary = 'pull request submitted by ... todo';
        break;
      default:
        core.setFailed(`Event not handled : ${github.context.payload.event_name}`);
        break;
    }
    core.info('hi');
    core.debug(post);

    try {
      core.debug('Inside try block');
      await rss3.items.custom.post(post);
    } catch (err) {
      core.debug('rss3 post failed, double check the endpoint service and private key');
      core.debug(github.context.payload);
      // core.debug(err);
      core.setFailed(err);
      return;
    }

    const time = (new Date()).toTimeString();
    core.setOutput('time', time);
  } catch (error) {
    core.setFailed(error);
  }
};
