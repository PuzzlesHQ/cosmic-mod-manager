import { KiB, MiB } from "./../number";

// Site config
export const SITE_NAME_SHORT = "CRMM";
export const SITE_NAME_LONG = "Cosmic Reach Mod Manager";
export const STRING_ID_LENGTH = 18;

// COOKIES
export const CSRF_STATE_COOKIE_NAMESPACE = "csrfState";
export const AUTHTOKEN_COOKIE_NAMESPACE = "auth-token";

// AUTH
export const USER_SESSION_VALIDITY = 2592000; // 30 days
export const USER_SESSION_VALIDITY_ms = 2592000000; // 30 days
export const GUEST_SESSION_ID_VALIDITY = 2592000; // 30 days
export const GUEST_SESSION_ID_VALIDITY_ms = 2592000000; // 30 days
export const PASSWORD_HASH_SALT_ROUNDS = 8;

// Confirmation email expiry durations
export const CONFIRM_NEW_PASSWORD_EMAIL_VALIDITY_ms = 7200_000; // 2 hour
export const CHANGE_ACCOUNT_PASSWORD_EMAIL_VALIDITY_ms = 7200_000; // 2 hour
export const DELETE_USER_ACCOUNT_EMAIL_VALIDITY_ms = 7200_000; // 2 hour

export const MAX_EMAIL_LENGTH = 256;

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

export const MIN_USERNAME_LENGTH = 2;
export const MAX_USERNAME_LENGTH = 32;

export const MAX_USER_BIO_LENGTH = 256;

export const MIN_DISPLAY_NAME_LENGTH = 2;
export const MAX_DISPLAY_NAME_LENGTH = 64;

// Images
export const ICON_WIDTH = 128;
export const MAX_ICON_SIZE = 512 * KiB;
export const GALLERY_IMG_THUMBNAIL_WIDTH = 420;
export const MAX_PROJECT_GALLERY_IMAGE_SIZE = 8 * MiB;

export const MAX_GALLERY_TITLE_LENGTH = 32;
export const MAX_GALLERY_DESCRIPTION_LENGTH = 1024;

export const MAX_PROFILE_PAGE_BG_SIZE = 8 * MiB;

// Project
export const MIN_PROJECT_NAME_LENGTH = 2;
export const MAX_PROJECT_NAME_LENGTH = 32;
export const MAX_PROJECT_SUMMARY_LENGTH = 320;
export const MAX_PROJECT_DESCRIPTION_LENGTH = 65256;
export const MAX_PROJECT_GALLERY_IMAGES_COUNT = 32;
export const MAX_MEMBER_ROLE_NAME_LENGTH = 32;

// Project_Settings
export const MAX_FEATURED_PROJECT_TAGS = 3;
export const MAX_LICENSE_NAME_LENGTH = 128;
export const MAX_LICENSE_URL_LENGTH = 256;

// Version
export const MIN_VERSION_TITLE_LENGTH = 2;
export const MAX_VERSION_TITLE_LENGTH = 64;
export const MAX_VERSION_NUMBER_LENGTH = 32;
export const MAX_VERSION_CHANGELOG_LENGTH = 65256;
export const MAX_VERSION_FILE_SIZE = 128 * MiB;
export const MAX_ADDITIONAL_VERSION_FILE_SIZE = 32 * MiB;
export const MAX_OPTIONAL_FILES = 5;

// Organisation
export const MAX_ORGANISATION_NAME_LENGTH = 32;
export const MAX_ORGANISATION_DESCRIPTION_LENGTH = 256;

// Collections
export const MAX_COLLECTION_NAME_LENGTH = 32;
export const MAX_COLLECTION_DESCRIPTION_LENGTH = 256;

export const FOLLOWS_COLLECTIONS_ID = "follows";

// Thread
export const MAX_THREAD_MESSAGE_LENGTH = 2048;

// Report
export const MAX_REPORT_DESCRIPTION_LENGTH = 8192;
