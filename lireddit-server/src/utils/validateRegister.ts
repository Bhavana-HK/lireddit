import { FieldError } from 'src/resolvers/FieldError';
import { UsernamePasswordInput } from 'src/resolvers/UsernamePasswordInput';

export const validateRegister = (
    options: UsernamePasswordInput
): FieldError[] => {
    const errors = [];
    if (options.username.length < 2) {
        errors.push({
            field: 'username',
            message: 'length must be atleast 3',
        });
    }

    if (!options.email.includes('@'))
        errors.push({
            field: 'email',
            message: 'invalid email',
        });

    if (options.username.includes('@'))
        errors.push({
            field: 'username',
            message: 'cannot include @',
        });

    if (options.password.length < 2) {
        errors.push({
            field: 'password',
            message: 'length must be atleast 3',
        });
    }
    return errors;
};
