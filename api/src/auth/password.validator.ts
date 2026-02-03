import { BadRequestException } from '@nestjs/common';

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecial: boolean;
}

export class PasswordValidator {
  private static readonly DEFAULT_REQUIREMENTS: PasswordRequirements = {
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '12', 10),
    requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false',
    requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false',
    requireNumber: process.env.PASSWORD_REQUIRE_NUMBER !== 'false',
    requireSpecial: process.env.PASSWORD_REQUIRE_SPECIAL !== 'false',
  };

  /**
   * Validate password against HIPAA-compliant requirements
   * @param password - Password to validate
   * @param requirements - Optional custom requirements (defaults to env config)
   * @throws BadRequestException if password doesn't meet requirements
   */
  static validate(
    password: string,
    requirements: PasswordRequirements = this.DEFAULT_REQUIREMENTS,
  ): void {
    const errors: string[] = [];

    // Check minimum length
    if (password.length < requirements.minLength) {
      errors.push(`Password must be at least ${requirements.minLength} characters long`);
    }

    // Check for uppercase letter
    if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    // Check for lowercase letter
    if (requirements.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    // Check for number
    if (requirements.requireNumber && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    // Check for special character
    if (requirements.requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common weak passwords
    const commonPasswords = [
      'password', 'Password1!', '12345678', 'qwerty', 'admin123',
      'welcome', 'letmein', 'monkey', 'dragon', 'master',
    ];
    if (commonPasswords.some(weak => password.toLowerCase().includes(weak.toLowerCase()))) {
      errors.push('Password is too common and easily guessable');
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Password does not meet security requirements',
        errors,
      });
    }
  }

  /**
   * Calculate password strength score (0-100)
   * @param password - Password to evaluate
   * @returns Strength score from 0 (weak) to 100 (strong)
   */
  static calculateStrength(password: string): number {
    let score = 0;

    // Length score (up to 30 points)
    score += Math.min(password.length * 2, 30);

    // Character diversity (up to 40 points)
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/\d/.test(password)) score += 10;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 10;

    // Complexity patterns (up to 30 points)
    const uniqueChars = new Set(password).size;
    score += Math.min(uniqueChars * 2, 15);

    // No repeated characters
    if (!/(.)\1{2,}/.test(password)) score += 10;

    // No sequential characters
    if (!/abc|bcd|cde|123|234|345/.test(password.toLowerCase())) score += 5;

    return Math.min(score, 100);
  }

  /**
   * Get password strength label
   */
  static getStrengthLabel(score: number): string {
    if (score < 40) return 'Weak';
    if (score < 60) return 'Fair';
    if (score < 80) return 'Good';
    return 'Strong';
  }
}
