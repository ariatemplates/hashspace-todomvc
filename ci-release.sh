if [ "$TRAVIS_PULL_REQUEST" = "false" ] && [ "$TRAVIS_SECURE_ENV_VARS" = "true" ]; then
    echo "Publishing to https://github.com/${TRAVIS_REPO_SLUG}/tree/gh-pages/ ..." &&
    git clone "https://github.com/${TRAVIS_REPO_SLUG}.git" -b gh-pages gh-pages &&
    # executing this still in the "master" root folder
    cd architecture-examples/hashspace/min &&
    echo "Installing gulp and other build dependencies..." &&
    npm install -g gulp &&
    npm install &&
    echo "Building minified version of hashspace-todomvc..." &&
    gulp &&
    cd - &&
    # copy stuff from "master" to "gh-pages"
    mkdir -p gh-pages/architecture-examples &&
    cp -rf architecture-examples/* gh-pages/architecture-examples &&
    cp ./{index.html,learn.json,.gitattributes,.gitignore} gh-pages &&
    # go to gh-pages where is the repo we want to commit to
    cd gh-pages &&
    git config user.email "releasebot@ariatemplates.com" &&
    git config user.name "Release Bot" &&
    git add -A . &&
    git commit -m "Build ${TRAVIS_COMMIT} (${TRAVIS_BRANCH})" &&
    echo "Pushing to GitHub..." &&
    git push --quiet "https://${GH_CREDENTIALS}@github.com/${TRAVIS_REPO_SLUG}.git" gh-pages &> /dev/null &&
    echo "Successfully published to https://github.com/${TRAVIS_REPO_SLUG}/tree/gh-pages"
fi
