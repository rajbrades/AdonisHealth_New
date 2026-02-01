# Medication Adherence Tracking

## Overview
Adherence tracking measures how consistently patients take their prescribed medications according to the prescribed schedule.

## How Adherence is Calculated

### Data Collection Methods

1. **Patient Check-ins (Primary)**
   - Weekly check-in form includes medication checklist
   - Patient marks which medications were taken as prescribed
   - Tracks: "Took all doses", "Missed 1-2 doses", "Missed >2 doses"

2. **Manual Logging (Secondary)**
   - Patients can mark medications as "taken" in real-time
   - Mobile app: Quick action button to log doses
   - Optional: Photo verification for injections

3. **Pharmacy Refill Data (Validation)**
   - Track refill dates vs prescribed refill schedule
   - If refills are on time = good adherence signal
   - Early refills = potential overuse flag
   - Late refills = potential non-adherence flag

### Calculation Formula

```
Adherence Rate = (Doses Taken / Doses Prescribed) × 100

Example for weekly medication over 4 weeks:
- Prescribed: 4 doses (once weekly)
- Taken: 3.8 doses (missed one dose)
- Adherence: (3.8 / 4) × 100 = 95%
```

### Frequency-Specific Tracking

- **Weekly (qW)**: 4 expected doses per month
- **Twice weekly (BIW)**: 8 expected doses per month  
- **Daily (qD)**: 30 expected doses per month
- **Twice daily (BID)**: 60 expected doses per month

## Adherence Thresholds

- **Excellent (≥95%)**: Green indicator, patient highly compliant
- **Good (80-94%)**: Yellow indicator, generally compliant
- **Poor (<80%)**: Red indicator, intervention needed

## Interventions Based on Adherence

### Patient Portal Actions
- Reminder notifications for missed doses
- Educational content on importance of adherence
- Easy "Report Barrier" form (e.g., "Too expensive", "Side effects", "Forgot")

### Concierge Actions
- Adherence <80% for 2+ weeks → Automatic task created
- Reach out to patient to understand barriers
- Coordinate with provider if clinical intervention needed
- Adjust refill schedule or dosing frequency if appropriate

### Provider Actions
- Adherence patterns shown in consultation prep note
- Low adherence triggers discussion during visit
- May adjust protocol if adherence is medication-specific

## Database Schema

```sql
medication_logs:
  - id
  - patient_id
  - medication_id
  - scheduled_date
  - actual_taken_at (nullable)
  - status (taken, missed, late)
  - logged_method (checkin, manual, auto)
  - created_at

adherence_summary:
  - patient_id
  - medication_id
  - period_start
  - period_end
  - doses_prescribed
  - doses_taken
  - adherence_rate
  - calculated_at
```

## Future Enhancements

1. **Smart Reminders**: AI-powered timing based on patient behavior patterns
2. **Integration with Wearables**: Auto-detect injection events via smartwatch
3. **Gamification**: Streaks and rewards for consistent adherence
4. **Predictive Alerts**: Warn concierge before patient becomes non-adherent
