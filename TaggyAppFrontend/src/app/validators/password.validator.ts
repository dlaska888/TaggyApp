import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TransConstant } from '../constants/trans.constant';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    const errors: { [key: string]: boolean } = {};

    if (!password && !control.dirty) {
      return null; // No validation if the field is empty
    }

    const hasDigit = /\d/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNonAlphanumeric = /[^a-zA-Z0-9]/.test(password);

    // Check requirements and add appropriate messages
    if (!hasDigit) {
      errors[TransConstant.PASSWORD.REQUIRE_DIGIT] = true;
    }
    if (!hasLowercase) {
      errors[TransConstant.PASSWORD.REQUIRE_LOWERCASE] = true;
    }
    if (!hasUppercase) {
      errors[TransConstant.PASSWORD.REQUIRE_UPPERCASE] = true;
    }
    if (!hasNonAlphanumeric) {
      errors[TransConstant.PASSWORD.REQUIRE_NON_ALPHANUMERIC] = true;
    }
    if (password.length < 6) {
      errors[TransConstant.PASSWORD.MIN_LENGTH] = true;
    }
    if (new Set(password).size < 6) {
      // Checking for unique characters
      errors[TransConstant.PASSWORD.REQUIRED_UNIQUE_CHARS] = true;
    }

    return Object.keys(errors).length ? errors : null;
  };
}
