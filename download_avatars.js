var config = require('dotenv').config(); // import .env file
if (config.error) {
  console.log("Something was wrong with your .env config:");
  console.log(config.error);
  process.exit(1);
}
var request = require('request');
var fs = require('fs');
var mkdirp = require('mkdirp');


const GITHUB_USER = process.env.GITHUB_USER;
if (!GITHUB_USER) {
  console.error("Need to provide GITHUB_USER environment variable. Ensure you have a .env file in the project.");
  process.exit(1);
}
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  console.error("Need to provide GITHUB_TOKEN environment variable. Ensure you have a .env file in the project.");
  process.exit(1);
}

if (process.argv.length !== 4) {
  console.error(`usage: node download_avatars.js <owner> <repo>`);
  process.exit(1);
}
const OWNER = process.argv[2];
const REPO = process.argv[3];

const OPTIONS = {
  headers: {
    'User-Agent': 'GitHub Avatar Downloader - Student Project'
  }
};

// ============================================
// test the function
// ============================================
validLogin(GITHUB_USER, GITHUB_TOKEN)
  .catch((err) => {
    console.error("Invalid user or token. Check your .env file or environment settings.");
    process.exit(1);
  });
getRepoContributors(OWNER, REPO, (results) => {
  console.log(`downloading ${results.length} avatars`);
  results.forEach((user, i) => {
    let url = user.avatar_url;
    downloadImageByURL(url, "avatars/" + user.login + ".jpg");
  });
});


// ============================================
// helpers
// ============================================
// ensures that the function is valid
function validLogin(user, token) {
  var url = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/';
  
  return new Promise((resolve, reject) => {
    request.get(url, OPTIONS, (error, response) => {
      if (error || response.statusCode !== 200 ){
        reject();
      } else {
        resolve();
      }
    });
  });
}

// gets all the contributor data from the github API for a given project
function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  console.info(`getting contributors from "${requestURL}"`);

  request.get(requestURL, OPTIONS, (error, response, body) => {
    if (error) {
      console.error("failed to make HTTP request");
      process.exit(1);
    } 
    
    const results = JSON.parse(body);
    cb(results);
  });
}

// downloads an image at `url` and saves it to the given `filePath`
function downloadImageByURL(url, filePath) {
  // TODO account for ENOENT error
  mkdirp('avatars', function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    
    request.get(url, OPTIONS)
      .pipe(fs.createWriteStream(filePath));
  });
  
}