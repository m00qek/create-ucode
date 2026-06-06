#!/bin/sh

ucode - <<'EOF'
'use strict';
import { add } from '{{PKG_NAME}}';

if (add(2, 3) !== 5) {
	print("Test failed: add(2, 3) !== 5");
	exit(1);
}

print("Test passed!");
EOF
