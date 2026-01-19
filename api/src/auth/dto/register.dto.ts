export class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: string; // ISO Date string
    gender: string; // MALE, FEMALE
    goals?: string[];
    symptoms?: string[];
}
