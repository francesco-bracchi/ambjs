NPM			= npm
GULP               	= node_modules/.bin/gulp

all: gulp

update: 
	$(NPM) install

gulp: update
	$(GULP)

clean: update
	$(GULP) clean

publish: gulp
	@cp package.json build/lib/package.json
	$(NPM) publish build/lib
