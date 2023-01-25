/* eslint-disable @typescript-eslint/no-explicit-any */
export function verifyFormFields(formData: FormData): any {
	const checkedFields: any = {};

	for (const [key, value] of formData)
		if (!value) throw new Error('Field ' + key + ' is required');
		else checkedFields.set(key, value.toString());

	return checkedFields;
}
