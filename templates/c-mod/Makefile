IMAGE        := {{PKG_NAME}}-test:latest
SDK_VERSION  ?= 25.12.4
SDK_ARCH     ?= x86-64
GIT_COMMIT   ?= $(shell git rev-parse --short HEAD)

PKG_NAME         := {{PKG_NAME}}
UCODE_MOD_NAME   := {{UCODE_MOD_NAME}}
PKG_VERSION_BASE := $(shell grep -oP 'PKG_VERSION:=\K.*' openwrt/$(PKG_NAME)/Makefile)
PKG_VERSION      := $(if $(GIT_COMMIT),$(PKG_VERSION_BASE)~$(GIT_COMMIT),$(PKG_VERSION_BASE))

BUILD_DIR       := build/$(SDK_VERSION)/$(SDK_ARCH)
SDK_MAJOR_MINOR := $(shell echo $(SDK_VERSION) | cut -d. -f1,2)

BUILD_IMAGE = docker run --rm \
	-v $(CURDIR)/src:/builder/package/$(PKG_NAME)/src:ro \
	-v $(CURDIR)/mod:/builder/package/$(PKG_NAME)/mod:ro \
	-v $(CURDIR)/$(BUILD_DIR)/$(PKG_NAME)-Makefile:/builder/package/$(PKG_NAME)/Makefile:ro \
	-v $(CURDIR)/$(BUILD_DIR):/builder/bin \
	-v $(CURDIR)/$(BUILD_DIR)/include:/builder/out_include \
	openwrt/sdk:$(SDK_ARCH)-$(SDK_VERSION)

TEST_IMAGE = docker run --rm $(TEST_OPTS) \
	-v $(CURDIR):/app \
	$(if $(wildcard $(BUILD_DIR)/native.so),-v $(CURDIR)/$(BUILD_DIR)/native.so:/usr/lib/ucode/$(UCODE_MOD_NAME)/native.so:ro) \
	-w /app \
	$(IMAGE)

.PHONY: image compile test shell package lint

image:
	docker build \
		--build-arg SDK_ARCH=$(SDK_ARCH) \
		--build-arg SDK_VERSION=$(SDK_MAJOR_MINOR) \
		-t $(IMAGE) .

lint:
	ucode-lint

compile: $(BUILD_DIR)/native.so mod/compile_flags.txt

$(BUILD_DIR)/native.so: $(shell find mod -name '*.c') openwrt/$(PKG_NAME)/Makefile
	mkdir -p $(BUILD_DIR)/include
	chmod 777 $(BUILD_DIR) $(BUILD_DIR)/include
	sed 's/PKG_VERSION:=.*/PKG_VERSION:=$(PKG_VERSION)/' \
		openwrt/$(PKG_NAME)/Makefile > $(BUILD_DIR)/$(PKG_NAME)-Makefile
	$(BUILD_IMAGE) \
		sh -c " \
			./scripts/feeds update base && \
			./scripts/feeds install ucode && \
			make defconfig && \
			make package/$(PKG_NAME)/compile V=s && \
			find /builder/build_dir -name native.so \
				-exec cp {} /builder/bin/native.so \; -quit && \
			test -f /builder/bin/native.so && \
			cp -fpR /builder/staging_dir/target-*/usr/include/* /builder/out_include/ \
		"; EC=$$?; rm -f $(BUILD_DIR)/$(PKG_NAME)-Makefile; exit $$EC

mod/compile_flags.txt: $(BUILD_DIR)/include
	printf -- '-I%s\n-Wall\n-Wextra\n-Werror\n-std=gnu99\n' "$(CURDIR)/$(BUILD_DIR)/include" > mod/compile_flags.txt

test: image $(BUILD_DIR)/native.so
	$(TEST_IMAGE) utest -l /app/src test/

shell: TEST_OPTS := -it
shell: image
	$(TEST_IMAGE) sh

package:
	mkdir -p $(BUILD_DIR)/include
	chmod 777 $(BUILD_DIR) $(BUILD_DIR)/include
	sed 's/PKG_VERSION:=.*/PKG_VERSION:=$(PKG_VERSION)/' \
		openwrt/$(PKG_NAME)/Makefile > $(BUILD_DIR)/$(PKG_NAME)-Makefile
	$(BUILD_IMAGE) \
		sh -c " \
			./scripts/feeds update base && \
			./scripts/feeds install ucode && \
			make defconfig && \
			make package/$(PKG_NAME)/compile V=s \
		"; EC=$$?; rm -f $(BUILD_DIR)/$(PKG_NAME)-Makefile; exit $$EC
