#include <ucode/module.h>

static uc_value_t *uc_add(uc_vm_t *vm, size_t nargs)
{
	uc_value_t *a = uc_fn_arg(0);
	uc_value_t *b = uc_fn_arg(1);

	if (ucv_type(a) != UC_INTEGER || ucv_type(b) != UC_INTEGER)
		return NULL;

	return ucv_int64_new(ucv_int64_get(a) + ucv_int64_get(b));
}

static const uc_function_list_t fns[] = {
	{ "add", uc_add },
};

void uc_module_init(uc_vm_t *vm, uc_value_t *scope)
{
	uc_function_list_register(scope, fns);
}
