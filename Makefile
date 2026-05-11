1 build:
	node src/scripts/generate-sidebar.mjs
	npm run build
	npm run serve


0 update:
	git pull
	git submodule update --remote