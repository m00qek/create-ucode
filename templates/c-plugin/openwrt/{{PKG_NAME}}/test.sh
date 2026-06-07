#!/bin/sh

ucode - <<'EOF'
'use strict';
import { add } from '{{PKG_NAME}}';

if (add(2, 3) !== 5) {
	print("Test failed: add(2, 3) !== 5\n");
	exit(1);
}

print("Test passed!\n");
EOF
