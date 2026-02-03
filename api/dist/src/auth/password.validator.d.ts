export interface PasswordRequirements {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumber: boolean;
    requireSpecial: boolean;
}
export declare class PasswordValidator {
    private static readonly DEFAULT_REQUIREMENTS;
    static validate(password: string, requirements?: PasswordRequirements): void;
    static calculateStrength(password: string): number;
    static getStrengthLabel(score: number): string;
}
