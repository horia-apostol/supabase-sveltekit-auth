import { MESSAGES } from '$lib/shared/messages/messages';
import { ENTRY_NAME_MAX_LENGTH } from '../../shared/const/entries';

const NAME = "Name";
const ENTRY_NAME = "Entry name";
const STRING_TYPE = "string";

export function validateEntryName(name: string): string | null {
	if (!name || typeof name !== STRING_TYPE) {
		return MESSAGES.validation.required(NAME);
	}

	if (name.trim().length === 0 || name.length > ENTRY_NAME_MAX_LENGTH) {
		return MESSAGES.validation.length(ENTRY_NAME, 1, ENTRY_NAME_MAX_LENGTH);
	}

	return null;
}
