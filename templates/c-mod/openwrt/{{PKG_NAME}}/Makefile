include $(TOPDIR)/rules.mk

PKG_NAME:={{PKG_NAME}}
PKG_VERSION:=1.0.0
PKG_RELEASE:=1
PKG_MAINTAINER:={{MAINTAINER}}
PKG_LICENSE:=MIT

include $(INCLUDE_DIR)/package.mk
include $(INCLUDE_DIR)/cmake.mk

UCODE_MOD_NAME:={{UCODE_MOD_NAME}}
CMAKE_OPTIONS += -DPKG_NAME=$(UCODE_MOD_NAME)

define Package/$(PKG_NAME)
  SECTION:=utils
  CATEGORY:=Utilities
  TITLE:=$(PKG_NAME) ucode application
  DEPENDS:=+ucode +libucode
endef

define Package/$(PKG_NAME)/description
  A ucode application with a C extension module.
endef

define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
	$(CP) ./mod/* $(PKG_BUILD_DIR)/
endef

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/usr/lib/ucode/$(UCODE_MOD_NAME)
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/ucode/$(UCODE_MOD_NAME)/native.so \
		$(1)/usr/lib/ucode/$(UCODE_MOD_NAME)/native.so
	$(INSTALL_DIR) $(1)/usr/share/ucode
	$(INSTALL_DATA) ./src/{{UCODE_MOD_NAME}}.uc $(1)/usr/share/ucode/$(UCODE_MOD_NAME).uc
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
