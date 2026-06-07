IMAGE       := {{PKG_NAME}}-test:latest
SDK_VERSION ?= 25.12.4
SDK_ARCH    ?= x86-64
GIT_COMMIT  ?= $(shell git rev-parse --short HEAD)

PKG_NAME         := {{PKG_NAME}}
PKG_VERSION_BASE := $(shell grep -oP 'PKG_VERSION:=\K.*' openwrt/$(PKG_NAME)/Makefile)
PKG_VERSION      := $(if $(GIT_COMMIT),$(PKG_VERSION_BASE)~$(GIT_COMMIT),$(PKG_VERSION_BASE))

.PHONY: image compile test shell package lint

image:
	docker build -t $(IMAGE) .

lint:
	ucode-lint

compile: bin/$(PKG_NAME)/native.so

bin/$(PKG_NAME)/native.so: $(shell find mod -name '*.c') openwrt/$(PKG_NAME)/Makefile
	mkdir -p bin/$(PKG_NAME)
	chmod 777 bin bin/$(PKG_NAME)
	sed 's/PKG_VERSION:=.*/PKG_VERSION:=$(PKG_VERSION)/' \
		openwrt/$(PKG_NAME)/Makefile > bin/$(PKG_NAME)-Makefile
	docker run --rm \
		-v $(CURDIR)/src:/builder/package/$(PKG_NAME)/src:ro \
		-v $(CURDIR)/mod:/builder/package/$(PKG_NAME)/mod:ro \
		-v $(CURDIR)/bin/$(PKG_NAME)-Makefile:/builder/package/$(PKG_NAME)/Makefile:ro \
		-v $(CURDIR)/bin:/builder/bin \
		openwrt/sdk:$(SDK_ARCH)-$(SDK_VERSION) \
		sh -c " \
			./scripts/feeds update base && \
			./scripts/feeds install ucode && \
			make defconfig && \
			make package/$(PKG_NAME)/compile V=s && \
			cp $$(find /builder/build_dir -name native.so | head -1) \
				/builder/bin/$(PKG_NAME)/native.so \
		"; EC=$$?; rm -f bin/$(PKG_NAME)-Makefile; exit $$EC

test: image bin/$(PKG_NAME)/native.so
	docker run --rm \
		-v $(CURDIR):/app \
		-w /app \
		$(IMAGE) \
		utest -l /app/src -l /app/bin test/

shell: image
	docker run --rm -it \
		-v $(CURDIR):/app \
		-w /app \
		$(IMAGE) \
		sh

package:
	mkdir -p bin
	chmod 777 bin
	sed 's/PKG_VERSION:=.*/PKG_VERSION:=$(PKG_VERSION)/' \
		openwrt/$(PKG_NAME)/Makefile > bin/$(PKG_NAME)-Makefile
	docker run --rm \
		-v $(CURDIR)/src:/builder/package/$(PKG_NAME)/src:ro \
		-v $(CURDIR)/mod:/builder/package/$(PKG_NAME)/mod:ro \
		-v $(CURDIR)/bin/$(PKG_NAME)-Makefile:/builder/package/$(PKG_NAME)/Makefile:ro \
		-v $(CURDIR)/openwrt/$(PKG_NAME)/test.sh:/builder/package/$(PKG_NAME)/test.sh:ro \
		-v $(CURDIR)/bin:/builder/bin \
		openwrt/sdk:$(SDK_ARCH)-$(SDK_VERSION) \
		sh -c " \
			./scripts/feeds update base && \
			./scripts/feeds install ucode && \
			make defconfig && \
			make package/$(PKG_NAME)/compile V=s \
		"; EC=$$?; rm -f bin/$(PKG_NAME)-Makefile; exit $$EC
