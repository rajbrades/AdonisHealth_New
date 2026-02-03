"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordValidator = void 0;
const common_1 = require("@nestjs/common");
class PasswordValidator {
    static DEFAULT_REQUIREMENTS = {
        minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '12', 10),
        requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false',
        requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false',
        requireNumber: process.env.PASSWORD_REQUIRE_NUMBER !== 'false',
        requireSpecial: process.env.PASSWORD_REQUIRE_SPECIAL !== 'false',
    };
    static validate(password, requirements = this.DEFAULT_REQUIREMENTS) {
        const errors = [];
        if (password.length < requirements.minLength) {
            errors.push(`Password must be at least ${requirements.minLength} characters long`);
        }
        if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (requirements.requireLowercase && !/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (requirements.requireNumber && !/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (requirements.requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        const commonPasswords = [
            'password', 'Password1!', '12345678', 'qwerty', 'admin123',
            'welcome', 'letmein', 'monkey', 'dragon', 'master',
        ];
        if (commonPasswords.some(weak => password.toLowerCase().includes(weak.toLowerCase()))) {
            errors.push('Password is too common and easily guessable');
        }
        if (errors.length > 0) {
            throw new common_1.BadRequestException({
                message: 'Password does not meet security requirements',
                errors,
            });
        }
    }
    static calculateStrength(password) {
        let score = 0;
        score += Math.min(password.length * 2, 30);
        if (/[a-z]/.test(password))
            score += 10;
        if (/[A-Z]/.test(password))
            score += 10;
        if (/\d/.test(password))
            score += 10;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
            score += 10;
        const uniqueChars = new Set(password).size;
        score += Math.min(uniqueChars * 2, 15);
        if (!/(.)\1{2,}/.test(password))
            score += 10;
        if (!/abc|bcd|cde|123|234|345/.test(password.toLowerCase()))
            score += 5;
        return Math.min(score, 100);
    }
    static getStrengthLabel(score) {
        if (score < 40)
            return 'Weak';
        if (score < 60)
            return 'Fair';
        if (score < 80)
            return 'Good';
        return 'Strong';
    }
}
exports.PasswordValidator = PasswordValidator;
//# sourceMappingURL=password.validator.js.map