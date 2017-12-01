/**
 * Synchronously validated the provided field.
 */
// import { resolveProp } from './resolveProp';

export default function validateSync({ fieldProps, fields, formProps, formRules }) {
  let isExpected = true;
  const mutableFieldProps = fieldProps.toJS();

  const name = fieldProps.get('name');
  const type = fieldProps.get('type');
  const value = fieldProps.get('value');
  const required = fieldProps.get('required');
  const rule = fieldProps.get('rule');
  const asyncRule = fieldProps.get('asyncRule');

  /* Resolve resolvable props */
  /* const required = resolveProp({
    propName: 'required',
    fieldProps,
    fields
  });
 */

  // console.groupCollapsed('fieldUtils @ isExpected', name);
  // console.log('fieldProps', fieldProps);
  // console.log('required:', required);
  // console.log('value:', value);

  /* Treat optional empty fields as expected */
  if (!value && !required) return { expected: true };
  if (!value && required) return { expected: false, errorType: 'missing' };

  /* Assume Field doesn't have any specific validation attached */
  const formTypeRule = formRules.type && formRules.type[type];
  const formNameRule = formRules.name && formRules.name[name];
  const hasFormRules = formTypeRule || formNameRule;

  if (!rule && !asyncRule && !hasFormRules) {
    // console.groupEnd();

    return { expected: true };
  }

  /* Format (sync) validation */
  if (rule) {
    // console.log('Field has "rule":', rule);

    /* Test the RegExp against the field's value */
    isExpected = (typeof rule === 'function')
      ? rule({ value, fieldProps: mutableFieldProps, fields, formProps })
      : rule.test(value);

    // console.log('isExpected:', isExpected);
    if (!isExpected) {
      // console.groupEnd();

      return { expected: false, errorType: 'invalid' };
    }
  }

  /**
   * Form-level validation.
   * A form-wide validation provided by "rules" property of the Form.
   * The latter property is also inherited from the context passed by FormProvider.
   */
  if (hasFormRules) {
    // console.groupEnd();

    /* Form-level validation */
    const isValidByType = formTypeRule ? formTypeRule(value, fieldProps: mutableFieldProps, formProps) : true;
    const isValidByName = formNameRule ? formNameRule(value, fieldProps: mutableFieldProps, formProps) : true;
    isExpected = (isValidByType && isValidByName);

    // console.log('isExpected:', isExpected);
    if (!isExpected) {
      // console.groupEnd();

      return { expected: false, errorType: 'invalid' };
    }
  }

  return { expected: isExpected };
}
