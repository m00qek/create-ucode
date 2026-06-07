#!/bin/sh

ucode - <<'EOF'
'use strict';
import { add, multiply } from '{{PKG_NAME}}';

if (add(2, 3) !== 5) {
	print("Test failed: add(2, 3) !== 5\n");
	exit(1);
}

if (multiply(2, 3) !== 6) {
	print("Test failed: multiply(2, 3) !== 6\n");
	exit(1);
}

print("Test passed!\n");
EOF
