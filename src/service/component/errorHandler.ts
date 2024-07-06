// errorHandler.ts
import { message } from 'antd';

const handleApiError = (error: any) => {
    const { response } = error;
    if (error.code === 'ECONNABORTED') {
        message.error("Please check your network connection again!");
    } else if (response && response.data && response.data.error) {
        const { code } = response.data.error;
        switch (code) {
            case 'TITLE_URL_EXISTS':
                message.error("Title URL already exists!");
                break;
            case 'SLUG_IN_USE':
                message.error("Back-half already exists!");
                break;
            case 'RESOURCE_NOT_FOUND':
                message.error("Resource not found!");
                break;
            case 'EMAIL_NOT_FOUND':
                message.error("Email not found!");
                break;
            case 'LIMIT_EXCEEDED':
                message.error("Exceeded maximum short link limit!");
                break;
            case 'MISSING_URL':
                message.error("URL is required!");
                break;
            case 'TITLE_QR_EXISTS':
                message.error("Title QR already exists!");
                break;
            case 'EMAIL_EXISTS':
                message.error("Email already exists!");
                break;
            case 'RE_SEND_EMAIL_ERROR':
                message.error("Please use the existing reset code sent to your email!");
                break;
            case 'PASSWORD_MISMATCH':
                message.error("New password and confirm password do not match!");
                break;
            case 'INCORRECT_PASSWORD':
                message.error("Current password is incorrect!");
                break;
            case 'NO_NEW_INFORMATION':
                message.error("No new information provided!");
                break;
            case 'URL_NOT_FOUND_OR_NO_PERMISSION':
                message.error("URL not found or you don't have permission to delete!");
                break;
            case 'QR_NOT_FOUND_OR_NO_PERMISSION':
                message.error("QR not found or you don't have permission to delete!");
                break;
            case 'INVALID_OR_EXPIRED_CODE':
                message.error("Invalid or expired verification code!");
                break;
            default:
                message.error("Error creating QR Code. Please try again!");
                break;
        }
    } else {
        message.error("An unknown error occurred.");
    }
    return Promise.reject(error);
};

export default handleApiError;
