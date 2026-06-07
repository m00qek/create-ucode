IMAGE        := {{PKG_NAME}}-test:latest
SDK_VERSION  ?= 25.12.4
SDK_ARCH     ?= x86-64
GIT_COMMIT   ?= $(shell git rev-parse --short HEAD)

PKG_NAME         := {{PKG_NAME}}
PKG_VERSION_BASE := $(shell grep -oP 'PKG_VERSION:=\K.*' openwrt/$(PKG_NAME)/Makefile)
PKG_VERSION      := $(if $(GIT_COMMIT),$(PKG_VERSION_BASE)~$(GIT_COMMIT),$(PKG_VERSION_BASE))

SDK_MAJOR_MINOR := $(shell echo $(SDK_VERSION) | cut -d. -f1,2)
REPORTER        := $(if $(CI),,-r compact)

TEST_IMAGE = docker run --rm $(TEST_OPTS) \
	-v $(CURDIR):/app \
	-w /app \
	$(IMAGE)

.PHONY: image test shell package lint

image:
	docker build \
		--build-arg SDK_ARCH=$(SDK_ARCH) \
		--build-arg SDK_VERSION=$(SDK_MAJOR_MINOR) \
		-t $(IMAGE) .

lint:
	ucode-lint

test: image
	$(TEST_IMAGE) utest -l /app/src $(REPORTER) test/

shell: TEST_OPTS := -it
shell: image
	$(TEST_IMAGE) sh

package:
	mkdir -p bin
	chmod 777 bin
	sed 's/PKG_VERSION:=.*/PKG_VERSION:=$(PKG_VERSION)/' \
		openwrt/$(PKG_NAME)/Makefile > bin/$(PKG_NAME)-Makefile
	docker run --rm \
		-v $(CURDIR)/src:/builder/package/$(PKG_NAME)/src:ro \
		-v $(CURDIR)/bin/$(PKG_NAME)-Makefile:/builder/package/$(PKG_NAME)/Makefile:ro \
		-v $(CURDIR)/bin:/builder/bin \
		openwrt/sdk:$(SDK_ARCH)-$(SDK_VERSION) \
		sh -c " \
			./scripts/feeds update base && \
			./scripts/feeds install ucode && \
			make defconfig && \
			make package/$(PKG_NAME)/compile V=s \
		"; EC=$$?; rm -f bin/$(PKG_NAME)-Makefile; exit $$EC
