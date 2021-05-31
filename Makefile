run-dev:
	REACT_APP_GIT_TAG=$(shell git describe --tags --abbrev=0 HEAD) \
	REACT_APP_GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	REACT_APP_GIT_REVISION=$(shell git rev-parse --short HEAD) \
	yarn start
