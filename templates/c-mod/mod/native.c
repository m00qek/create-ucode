#include <stdint.h>
#include <ucode/module.h>

static int64_t add(int64_t a, int64_t b)
{
	return (int64_t)((uint64_t)a + (uint64_t)b);
}

static uc_value_t *uc_add(uc_vm_t *vm, size_t nargs)
{
	uc_value_t *a = uc_fn_arg(0);
	uc_value_t *b = uc_fn_arg(1);

	if (!a || !b || ucv_type(a) != UC_INTEGER || ucv_type(b) != UC_INTEGER) {
		uc_vm_raise_exception(vm, EXCEPTION_TYPE, "Both arguments must be integers");
		return NULL;
	}

	return ucv_int64_new(add(ucv_int64_get(a), ucv_int64_get(b)));
}

static const uc_function_list_t fns[] = {
	{ "add", uc_add },
};

void uc_module_init(uc_vm_t *vm, uc_value_t *scope)
{
	uc_function_list_register(scope, fns);
}
