NPM			= npm
GULP               	= node_modules/.bin/gulp

all: gulp

update: 
	$(NPM) install

gulp: update
	$(GULP)

clean: update
	$(GULP) clean
