namespace App {
  // Validation

  export interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number; // Checks the length of the string
    maxLength?: number;
    min?: number; // Checks the value (n)
    max?: number;
  }

  export function validate(validatebleInput: Validatable) {
    let isValid = true;
    if (validatebleInput.required) {
      isValid =
        isValid && validatebleInput.value.toString().trim().length !== 0;
    }
    if (
      validatebleInput.minLength != null &&
      typeof validatebleInput.value === "string"
    ) {
      isValid =
        isValid && validatebleInput.value.length >= validatebleInput.minLength;
    }
    if (
      validatebleInput.maxLength != null &&
      typeof validatebleInput.value === "string"
    ) {
      isValid =
        isValid && validatebleInput.value.length <= validatebleInput.maxLength;
    }
    if (
      validatebleInput.min != null &&
      typeof validatebleInput.min === "number"
    ) {
      isValid = isValid && validatebleInput.value >= validatebleInput.min;
    }
    if (
      validatebleInput.max != null &&
      typeof validatebleInput.max === "number"
    ) {
      isValid = isValid && validatebleInput.value <= validatebleInput.max;
    }
    return isValid;
  }
}
