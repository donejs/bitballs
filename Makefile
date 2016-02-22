publish-docs:
	git checkout -b gh-pages
	npm run generate-docs
	git add -f docs/
	git add -f ./node_modules/can
	git add -f ./node_modules/steal
	git commit -m "Publish docs"
	git push -f origin gh-pages 
	git checkout -
	git branch -D gh-pages