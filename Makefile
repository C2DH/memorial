BUILD_TAG ?= latest

run-dev:
	VITE_GIT_TAG=$(shell git describe --tags --abbrev=0 HEAD) \
	VITE_GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	VITE_GIT_REVISION=$(shell git rev-parse --short HEAD) \
	yarn start

build-docker-image:
	docker build --network host -t c2dhunilu/memorial:${BUILD_TAG} \
	--build-arg GIT_TAG=$(shell git describe --tags --abbrev=0 HEAD) \
	--build-arg GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	--build-arg GIT_REVISION=$(shell git rev-parse --short HEAD) .

run-deploy-netlify:
	VITE_GIT_TAG=$(shell git describe --tags --abbrev=0 HEAD) \
	VITE_GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	VITE_GIT_REVISION=$(shell git rev-parse --short HEAD) \
	yarn build && \
	netlify deploy --prod --dir=build
