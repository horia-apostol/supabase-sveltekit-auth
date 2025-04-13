import { json } from "@sveltejs/kit";

export const MESSAGES = {
	auth: {
		unauthorized: 'Unauthorized',
		invalid_credentials: 'Invalid credentials',
		login_error: 'Login error',
		setup_error: 'Something went wrong after login.',
		register_error: 'Registration error',
		register_success: 'Check your email to confirm your account.',
		register_failed: 'Registration failed. Please try again.',
	},
	profile: {
		updated: 'Profile updated!',
		not_found: 'Profile not found',
	},
	entries: {
		added: 'Entry successfully added!',
		deleted: 'Entry deleted',
		forbidden: 'Forbidden',
		missing_id: 'Missing entry ID',
	},
	generic: {
		error_occurred: 'Something went wrong',
	},
	token: {
		missing_or_invalid: 'Missing or invalid token',
		invalid_or_user_not_found: 'Invalid token or user not found',
	},
	bearer: {
		authenticated: (first_name: string, last_name: string) => `Hello ${first_name} ${last_name}, this is your Bearer-authenticated message!`,
	},
    roles: {
        failed_to_fetch: 'Failed to fetch user roles',
        role_not_found: (role: string) => `Role "${role}" not found in DB`,
        role_removed: (role: string) => `Role "${role}" removed`,
        role_assigned: (role: string) => `Role "${role}" assigned`,
    },
	unexpected: {
		error: 'Unexpected error occurred',
	},
	validation: {
		required: (field: string) => `${field} is required`,
		length: (field: string, min: number, max: number) =>
			`${field} must be between ${min} and ${max} characters`,
		letters_only: (field: string) => `${field} must contain only letters`,
	}
};
