ARG SDK_ARCH=x86-64
ARG SDK_VERSION=25.12

FROM openwrt/rootfs:${SDK_ARCH}-openwrt-${SDK_VERSION}

RUN mkdir -p /var/lock && \
    sed -i '/kmods/d' /etc/apk/repositories.d/distfeeds.list && \
    apk update && \
    apk upgrade --available && \
    apk add --no-cache curl

COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

CMD ["/usr/local/bin/start.sh"]
