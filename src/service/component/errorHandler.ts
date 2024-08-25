// errorHandler.ts
import { message } from 'antd';

const handleApiError = (error: any) => {
    const { response } = error;
    if (error.code === 'ECONNABORTED') {
        message.error("Please check your network connection again!");
    } else if (response && response.data && response.data.error) {
        const { code } = response.data.error;
        switch (code) {
            case 'RESOURCE_NOT_FOUND':
                message.error("Resource not found!");
                break;
            case 'EMAIL_NOT_FOUND':
                message.error("Email not found!");
                break;
            case 'USER_NOT_FOUND':
                message.error("Username not found!");
                break;
            case 'EMAIL_EXISTS':
                message.error("Email already exists!");
                break;
            case 'PASSWORD_MISMATCH':
                message.error("New password and confirm password do not match!");
                break;
            case 'INCORRECT_PASSWORD':
                message.error("Current password is incorrect!");
                break;
            case 'USERNAME_EXISTS':
                message.error("Username already exists!");
                break;
            case 'INVALID_USERID':
                message.error("User not found!");
                break;
            case 'INVALID_INPUT':
                message.error("Invalid input.");
                break;
            case 'TITLE_ALREADY_EXISTS':
                message.error("Title already exists!");
                break;
            case 'DOCUMENT_NOT_FOUND':
                message.error("Document not found!");
                break;
            case 'FORGOT_PASSWORD_LIMIT_EXCEEDED':
                message.error("Exceeded the number of password reset requests per day. Try again tomorrow.")
                break;
            case 'UPDATE_TITLE_FAILED':
                message.error("Failed to update document title.");
                break;
            case 'DOCUMENT_CREATION_FAILED':
                message.error("Failed to create new document.");
                break;
            case 'DOCUMENT_EXISTS_FOLDER':
                message.error("Document already exists in this folder")
                break;
            default:
                message.error("Error. Please try again!");
                break;
        }
    } else {
        message.error("An unknown error occurred.");
    }
    return Promise.reject(error);
};

export default handleApiError;
