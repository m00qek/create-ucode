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
  TITLE:={{PKG_NAME}} ucode application
  DEPENDS:=+ucode +uci
  PKGARCH:=all
endef

define Package/{{PKG_NAME}}/description
  A pure ucode application.
endef

define Build/Compile
endef

define Package/{{PKG_NAME}}/install
	$(INSTALL_DIR) $(1)/usr/share/ucode
	$(INSTALL_DATA) ./src/{{UCODE_MOD_NAME}}.uc $(1)/usr/share/ucode/{{UCODE_MOD_NAME}}.uc
	$(CP) ./files/* $(1)/
endef

$(eval $(call BuildPackage,{{PKG_NAME}}))
