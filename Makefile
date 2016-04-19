publish-docs:
	git checkout -b gh-pages
	donejs document
	git add -f docs/
	git add -f public/components/
	git add -f public/models/
	git add -f public/node_modules/jquery
	git add -f public/node_modules/can
	git add -f public/node_modules/can-connect
	git add -f public/node_modules/can-fixture
	git add -f public/node_modules/can-set
	git add -f public/node_modules/can-zone
	git add -f public/node_modules/bootstrap
	git add -f public/node_modules/done-autorender
	git add -f public/node_modules/done-component
	git add -f public/node_modules/done-css
	git add -f public/node_modules/done-ssr-middleware
	git add -f public/node_modules/donejs-cli
	git add -f public/node_modules/funcunit
	git add -f public/node_modules/generator-donejs
	git add -f public/node_modules/moment
	git add -f public/node_modules/qunitjs
	git add -f public/node_modules/steal
	git add -f public/node_modules/steal-qunit
	git add -f public/node_modules/steal-systemjs
	git add -f public/node_modules/steal-es6-module-loader
	git add -f public/node_modules/steal-platform
	git add -f public/node_modules/when
	git add -f public/node_modules/yeoman-environment
	git add -f public/test.html
	git commit -m "Publish docs"
	git push -f origin gh-pages
	git rm -q -r --cached public/node_modules
	git checkout -
	git branch -D gh-pages