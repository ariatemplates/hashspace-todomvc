# build and test
./build-full

# deploy to github pages conditionally
if [ "$TRAVIS_PULL_REQUEST" = "false" ] && [ "$TRAVIS_SECURE_ENV_VARS" = "true" ]; then

    echo "Preparing the commit..." &&
        # go to gh-pages where is the repo we want to commit to
        cd gh-pages &&
        git config user.email "releasebot@ariatemplates.com" &&
        git config user.name "Release Bot" &&
        git add -A . &&
        git commit -m "Build ${TRAVIS_COMMIT} (${TRAVIS_BRANCH})" &&
    echo "Pushing to GitHub..." &&
        git push --quiet "https://${GH_CREDENTIALS}@github.com/${TRAVIS_REPO_SLUG}.git" gh-pages &> /dev/null &&
    echo "Successfully published to https://github.com/${TRAVIS_REPO_SLUG}/tree/gh-pages"

    # commit might have exited with 1 if there was nothing to commit, let's not treat it as error
    echo "Build finished"
fi
