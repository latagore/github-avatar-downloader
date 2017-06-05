var request = require('request');

const GITHUB_USER = process.env.GITHUB_USER;
if (!GITHUB_USER) {
  console.error("Need to provide GITHUB_USER environment variable");
  process.exit(1);
}
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  console.error("Need to provide GITHUB_TOKEN environment variable");
  process.exit(1);
}


function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  console.log(requestURL);

  var options = {
    url: requestURL,
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  };
  
  request.get(options, (error, response, body) => {
    if (error) {
      console.error("failed to make HTTP request");
    } 
    
    const results = JSON.parse(body);
    cb(results);
  });
}

getRepoContributors("jquery", "jquery", (results) => {
    results.forEach(user => {
      console.log(user.avatar_url);
    })
});