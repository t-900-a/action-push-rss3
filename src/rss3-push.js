const github = require('@actions/github');
const RSS3 = require('rss3').default;


module.exports = async function rss3Push(core) {
  try {
    const endpoint = (!process.env.ENDPOINT || process.env.ENDPOINT.length == 0) ? 'https://prenode.rss3.dev' : process.env.ENDPOINT;
    const privateKey = process.env.PRIVATEKEY;

    if (privateKey === undefined || privateKey.length !== 64) {
      throw new Error('Need to provide valid private key');
    }

    const rss3 = new RSS3({
      endpoint,
      privateKey,
    });

    const evnt = github.context.payload;

    const post = {
      tags: ['github', 'buidl'],
    };

    switch (github.context.eventName) {
      case 'push':
        post.title = `New commit from ${evnt.pusher.name} to ${evnt.repository.full_name}`;
        post.summary = `${evnt.head_commit.message}`;
        post.link = {
          id: `${evnt.head_commit.id}`,
          target: `${evnt.head_commit.url}`,
        };
        break;
      case 'release':
        post.title = `New Release published ${evnt.repository.name} - ${evnt.release.name}`;
        post.summary = `New ${evnt.repository.name} release now available`;
        post.link = {
            id: `${evnt.release.name}`,
            target: `${evnt.release.zipball_url}`,
          };
        break;
      case 'issues':
        post.title = `Issue ${evnt.action} in ${evnt.repository.full_name}`;
        post.summary = `${evnt.issue.title}\n\n${evnt.issue.body}`;
        post.link = {
          id: `${evnt.issue.number}`,
          target: `${evnt.issue.html_url}`,
        };
        break;
      case 'pull_request':
        post.title = `Pull request ${evnt.action} in ${evnt.repository.full_name}`;
        post.summary = `${evnt.pull_request.title}\n\n${evnt.pull_request.body}`;
        post.link = {
          id: `${evnt.pull_request.number}`,
          target: `${evnt.pull_request.html_url}`,
        };
        break;
      default:
        core.setFailed(`Event not handled : ${github.context.payload.event_name}`);
        break;
    }
    core.debug(evnt);
    core.debug(post);

    try {
      await rss3.items.custom.post(post);
    } catch (err) {
      core.debug('rss3 post failed, double check the endpoint service and private key');
      core.debug(err.stack);
      core.debug(err);
      core.setFailed(err);
      return;
    }

    const time = (new Date()).toTimeString();
    core.setOutput('time', time);
  } catch (error) {
    core.debug(evnt);
    core.setFailed(error);
  }
};
