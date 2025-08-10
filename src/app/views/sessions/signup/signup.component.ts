import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})
export class SignupComponent implements OnInit {

    signupForm: FormGroup;
    isSubmitting = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService // or your toast service
    ) {
        this.signupForm = this.fb.group({
            firstName: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(50),

            ]],
            lastName: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(50),

            ]],
            email: ['', [
                Validators.required,
                Validators.email
            ]],
            phoneNumber: ['', [
                Validators.required,
                Validators.pattern("^\\+?[1-9]\\d{1,14}$")
            ]],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(72),
                Validators.pattern("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*\\W).*$")
            ]],
            confirmPassword: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(72)
            ]]
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit() {}

    // Custom validator to check if passwords match
    passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            return { passwordMismatch: true };
        }
        return null;
    }

    onSubmit() {
        if (this.signupForm.valid && !this.isSubmitting) {
            this.isSubmitting = true;

            const registrationData = this.signupForm.value;

            this.authService.register(registrationData).subscribe({
                next: () => {
                    this.toastr.success('Registration successful! Please check your email to verify your account.', 'Success');
                    this.router.navigate(['/sessions/signin']);
                },
                error: (error) => {
                    console.error('Registration error:', error);

                    // Handle different types of errors
                    if (error.status === 400 && error.error?.message) {
                        this.toastr.error(error.error.message, 'Registration Failed');
                    } else if (error.status === 409) {
                        this.toastr.error('Email already exists. Please use a different email.', 'Registration Failed');
                    } else {
                        this.toastr.error('Registration failed. Please try again.', 'Error');
                    }
                },
                complete: () => {
                    this.isSubmitting = false;
                }
            });
        } else {
            // Mark all fields as touched to show validation errors
            Object.keys(this.signupForm.controls).forEach(key => {
                this.signupForm.get(key)?.markAsTouched();
            });
            this.toastr.warning('Please fill in all required fields correctly.', 'Validation Error');
        }
    }

    // Helper methods for template
    isFieldInvalid(fieldName: string): boolean {
        const field = this.signupForm.get(fieldName);
        return field ? field.invalid && field.touched : false;
    }

    getFieldError(fieldName: string): string {
        const field = this.signupForm.get(fieldName);
        if (field && field.errors && field.touched) {
            if (field.errors['required']) return `${fieldName} is required`;
            if (field.errors['email']) return 'Please enter a valid email address';
            if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
            if (field.errors['maxlength']) return `${fieldName} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
            if (field.errors['pattern']) {

                if (fieldName === 'phoneNumber') return 'Please enter a valid phone number';
                if (fieldName === 'password') return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
            }
        }
        if (fieldName === 'confirmPassword' && this.signupForm.errors?.['passwordMismatch']) {
            return 'Passwords do not match';
        }
        return '';
    }
}
