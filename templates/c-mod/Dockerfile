FROM openwrt/rootfs:x86-64-openwrt-25.12

RUN mkdir -p /var/lock && \
    wget -q --no-check-certificate -O /tmp/utest.apk \
        https://github.com/m00qek/utest/releases/download/v1.2.0/ucode-utest-1.2.0.43488a7a-r1.apk && \
    echo "11bdd0d8c65526df0699aaa0883fc2182afdba4166bd8f9be571d07fd58fd08c  /tmp/utest.apk" | sha256sum -c - && \
    apk add --allow-untrusted /tmp/utest.apk && \
    rm /tmp/utest.apk

WORKDIR /app
