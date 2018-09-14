LOCAL_TAG=httpdf-example:latest

.PHONY: run build

run:
	docker run --rm -p 8000:8000 $(LOCAL_TAG)

build:
	docker build -t $(LOCAL_TAG) .
