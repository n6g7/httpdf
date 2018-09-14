IMAGE_NAME=n6g7/httpdf
VERSION=$(shell jq .version -r package.json)
LATEST_TAG=$(IMAGE_NAME):latest
VERSION_TAG=$(IMAGE_NAME):$(VERSION)

.PHONY: build tag push release

build:
	docker build -t $(LATEST_TAG) .

tag:
	docker tag $(LATEST_TAG) $(VERSION_TAG)

push:
	docker push $(VERSION_TAG)
	docker push $(LATEST_TAG)

release: build tag push
