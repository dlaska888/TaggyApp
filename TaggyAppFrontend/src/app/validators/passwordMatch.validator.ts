import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom validator to check if passwords match
export function passwordMatchValidator(
  controlName: string,
  matchingControlName: string
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      return null; // Form controls not found, return null
    }

    // Set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    matchingControl.setErrors(null); // Clear errors if they match
    return null;
  };
}
