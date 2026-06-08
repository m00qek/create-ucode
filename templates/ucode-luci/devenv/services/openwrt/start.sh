#!/bin/sh
set -e

mkdir -p /var/run/ubus /tmp/sessions /tmp/luci-modulecache /etc/config

[ -f /etc/config/{{PKG_NAME}} ] || cp /etc/config/{{PKG_NAME}}.default /etc/config/{{PKG_NAME}}

printf "admin\nadmin\n" | passwd root >/dev/null 2>&1

# Mock 'system' rpcd plugin (procd normally provides this; we don't run procd)
cat > /etc/board.json <<'EOF'
{
    "model": { "id": "generic", "name": "OpenWrt Container" },
    "release": { "distribution": "OpenWrt", "version": "25.12" }
}
EOF

mkdir -p /usr/libexec/rpcd
cat > /usr/libexec/rpcd/system <<'EOF'
#!/bin/sh
case "$1" in
    list) echo '{"board":{},"info":{}}' ;;
    call) cat /etc/board.json ;;
esac
EOF
chmod +x /usr/libexec/rpcd/system

/sbin/ubusd &
sleep 1
/sbin/rpcd &
sleep 1

exec /usr/sbin/uhttpd -f \
    -p 0.0.0.0:80 \
    -u /ubus \
    -x /cgi-bin \
    -h /www
