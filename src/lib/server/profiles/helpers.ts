import { MESSAGES } from "$lib/shared/messages/messages";

export function validateNameField(name: string, fieldName: string): string | null {
	if (!name) {
		return MESSAGES.validation.required(fieldName);
	}

	if (name.length < 2 || name.length > 25) { 
		return MESSAGES.validation.length(fieldName, 2, 25);
	}

	if (!/^[a-zA-Z]+$/.test(name)) {
		return MESSAGES.validation.letters_only(fieldName);
	}
	
	return null;
}
