To deploy latest changes to `gh-page`:
See [Deploying a subfolder to GitHub Pages](https://gist.github.com/cobyism/4730490)

1. Change to master branch
2. Run `gulp build` from the project root (which performs a copy to the `build` folder)
3. Push the build directory to the gh-pages branch by running: `git subtree push --prefix build origin gh-pages`
