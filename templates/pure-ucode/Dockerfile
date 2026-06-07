FROM openwrt/rootfs:x86-64-openwrt-25.12

RUN mkdir -p /var/lock && \
    wget -q --no-check-certificate -O /tmp/utest.apk \
        https://github.com/m00qek/utest/releases/download/v1.2.0/ucode-utest_1.2.0-r1_all.apk && \
    echo "0019dfc4b32d63c1392aa264aed2253c1e0c2fb09216f8e2cc269bbfb8bb49b5  /tmp/utest.apk" | sha256sum -c - && \
    apk add --allow-untrusted /tmp/utest.apk && \
    rm /tmp/utest.apk

WORKDIR /app
