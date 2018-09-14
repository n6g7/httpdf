LOCAL_TAG=httpdf:latest
VERSION=$(shell jq .version -r package.json)
HUB_TAG=n6g7/httpdf:$(VERSION)

.PHONY: build tag push release

build:
	docker build -t $(LOCAL_TAG) .

tag:
	docker tag $(LOCAL_TAG) $(HUB_TAG)

push:
	docker push $(HUB_TAG)

release: build tag push
