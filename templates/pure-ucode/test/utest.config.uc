return {
	lib_paths: [ "../src" ],
	// uci is not mocked here because the module uses dependency injection —
	// tests pass a mock cursor directly via greet({ uci: ... })
	mocks: {}
};
