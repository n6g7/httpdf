IMAGE_NAME=n6g7/httpdf
VERSION=$(shell jq .version -r package.json)
LOCAL_TAG=$(IMAGE_NAME):latest
HUB_TAG=$(IMAGE_NAME):$(VERSION)

.PHONY: build tag push release

build:
	docker build -t $(LOCAL_TAG) .

tag:
	docker tag $(LOCAL_TAG) $(HUB_TAG)

push:
	docker push $(HUB_TAG)

release: build tag push
