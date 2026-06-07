include $(TOPDIR)/rules.mk

PKG_NAME:={{PKG_NAME}}
PKG_VERSION:=1.0.0
PKG_RELEASE:=1
PKG_MAINTAINER:={{MAINTAINER}}
PKG_LICENSE:=MIT

include $(INCLUDE_DIR)/package.mk
include $(INCLUDE_DIR)/cmake.mk

define Package/{{PKG_NAME}}
  SECTION:=utils
  CATEGORY:=Utilities
  TITLE:={{PKG_NAME}} ucode application
  DEPENDS:=+ucode +libucode
endef

define Package/{{PKG_NAME}}/description
  A ucode application with a C extension module.
endef

define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
	$(CP) ./mod/* $(PKG_BUILD_DIR)/
endef

define Package/{{PKG_NAME}}/install
	$(INSTALL_DIR) $(1)/usr/lib/ucode/{{PKG_NAME}}
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/ucode/{{PKG_NAME}}/native.so \
		$(1)/usr/lib/ucode/{{PKG_NAME}}/native.so
	$(INSTALL_DIR) $(1)/usr/share/ucode
	$(INSTALL_DATA) ./src/main.uc $(1)/usr/share/ucode/{{PKG_NAME}}.uc
endef

$(eval $(call BuildPackage,{{PKG_NAME}}))
