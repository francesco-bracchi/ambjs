NPM			= npm
GULP               	= node_modules/.bin/gulp
DOCCO			= node_modules/.bin/docco-husky

all: gulp

update: 
	$(NPM) install

gulp: update
	$(GULP)

clean: update
	$(GULP) clean

distclean: update
	$(GULP) distclean

docs: update
	$(DOCCO) src

publish: gulp
	$(GULP) lib
	$(NPM) publish build/lib

test: update
	$(GULP) test	
