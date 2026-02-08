# Adonis Health Authentication Feature Status

**Version: 1.0** | **Last Updated: February 3, 2026**

## 1. Introduction

This document provides a clear and detailed status of all HIPAA-compliant authentication features for the Adonis Health platform. It is intended to clarify what has been implemented, what is partially implemented, and what is planned for future development.

---

## 2. Feature Status Overview

The following table provides a comprehensive overview of each authentication feature and its current implementation status.

| Feature | Status | Implementation Details |
|---|---|---|
| **Multi-Factor Authentication (MFA/2FA)** | 🟡 **Planned** | MFA is a critical security enhancement that is on our roadmap. It is not yet implemented. |
| **Session Timeout** | ✅ **Implemented** | Sessions are managed via JWT tokens with a 60-minute expiration time. This serves as an automatic session timeout. |
| **Password Policy (Complexity)** | ✅ **Implemented** | A strong password policy is enforced at registration, requiring a minimum of 12 characters, including uppercase, lowercase, numbers, and special characters. |
| **Password Policy (Expiry)** | ✅ **Implemented** | Passwords expire after 90 days (configurable via `PASSWORD_EXPIRATION_DAYS`). Users are prompted to change their password upon login if expired. |
| **Login Attempt Tracking/Lockout** | ✅ **Implemented** | The system tracks failed login attempts and enforces an account lockout for 30 minutes after 5 consecutive failed attempts. |
| **Auth Event Audit Logging** | ✅ **Implemented** | All authentication-related events (login, logout, registration, password changes, failed attempts) are logged to the `AuditLog` table with user details, IP address, and timestamp. |
| **Automatic Logout on Inactivity** | 🟡 **Planned** | While JWT expiration provides a fixed session timeout, true automatic logout based on user inactivity is planned for a future release. |

---

## 3. Implementation Details

### 3.1. Implemented Features

-   **Session Timeout**: Implemented via the `expiresIn` option in the `JwtModule` configuration. The current timeout is set to 60 minutes.
-   **Password Complexity**: Enforced by the `PasswordValidator` class, which checks for length, character diversity, and common weak passwords.
-   **Login Attempt Tracking/Lockout**: Managed within the `AuthService`, which queries the `AuditLog` for recent failed login attempts before processing a login request.
-   **Auth Event Audit Logging**: The `AuditService` provides a `log` method that is called from the `AuthService` for all authentication-related events.

### 3.2. Password Expiration

-   **Implementation**: A `passwordChangedAt` field tracks when the password was last changed. On login, the system checks if the password has expired based on `PASSWORD_EXPIRATION_DAYS` (default: 90 days).
-   **Behavior**: If the password is expired, login is rejected with a message prompting the user to change their password.
-   **Configuration**: Set `PASSWORD_EXPIRATION_DAYS` in your environment variables to customize the expiration period.

### 3.3. Planned Features

-   **MFA/2FA**: Will require integration with a third-party service (e.g., Twilio for SMS-based codes or an authenticator app like Google Authenticator).
-   **Automatic Logout on Inactivity**: Will require client-side logic to track user activity and a backend endpoint to gracefully handle the logout.

---

## 4. Conclusion

We have implemented a robust set of foundational HIPAA-compliant authentication features. While some advanced features are still planned, the current system provides a secure and compliant authentication experience. This document will be updated as new features are implemented.

---

## 5. Test Credentials (Local Development)

The following accounts are created by the database seed script (`npx prisma db seed`) for local testing purposes.

| Role | Email | Password |
|---|---|---|
| **Patient** | `patient@example.com` | `Adonis@2026!Secure` |
| **Provider** | `dr.stone@adonis.health` | `Adonis@2026!Secure` |

**Note**: These passwords comply with the new security policy (12+ chars, uppercase, lowercase, number, special char).
