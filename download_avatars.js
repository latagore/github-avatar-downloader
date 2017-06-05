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
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});