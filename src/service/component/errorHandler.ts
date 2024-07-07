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
