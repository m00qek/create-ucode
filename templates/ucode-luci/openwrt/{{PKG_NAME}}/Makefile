include $(TOPDIR)/rules.mk

PKG_NAME:={{PKG_NAME}}
PKG_VERSION:=1.0.0
PKG_RELEASE:=1
PKG_MAINTAINER:={{MAINTAINER}}
PKG_LICENSE:=MIT

include $(INCLUDE_DIR)/package.mk

define Package/{{PKG_NAME}}
  SECTION:=utils
  CATEGORY:=Utilities
  TITLE:={{PKG_NAME}} ucode LuCI application
  DEPENDS:=+ucode +rpcd +rpcd-mod-uci +luci-base
  PKGARCH:=all
endef

define Package/{{PKG_NAME}}/description
  A {{PKG_NAME}} application with a LuCI configuration page.
endef

define Build/Compile
endef

define Package/{{PKG_NAME}}/install
	$(INSTALL_DIR) $(1)/usr/share/ucode
	$(INSTALL_DATA) ./src/{{PKG_NAME}}.uc $(1)/usr/share/ucode/{{PKG_NAME}}.uc
	$(CP) ./files/* $(1)/
endef

$(eval $(call BuildPackage,{{PKG_NAME}}))
