all:
	update install build

2 build:
	node src/scripts/generate-sidebar.mjs
	npm run build
	npm run serve


0 update:
	git submodule update --init --recursive

1 install: 
	npm i
#	git pull
#	git submodule update --remote

# update-dependencies:
# 	npx npm-check-updates
# 	npx ncu --doctor -u