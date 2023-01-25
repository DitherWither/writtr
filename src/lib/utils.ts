export function verifyFormFields(formData: FormData): any {
    let checkedFields: any = {};

    for (let [key, value] of formData)
        if (!value) throw new Error('Field ' + key + ' is required');
        else checkedFields[key] = value.toString();

    return checkedFields;
}