# BuyOut Standardized Bug Report Templates

To maintain engineering velocity, all bugs submitted via GitHub/Linear MUST follow these strict templates. "It doesn't work" is immediately closed.

## Core Template: Feature Bug
Use this when a UI button does not respond, a screen crashes, or a specific user flow is broken.

**Title Format:** `[Module] Description of the issue` (e.g., `[Auth] OTP Input Keyboard Doesn't Dismiss`)

**Body:**
```markdown
### 1. Description
Briefly explain what is broken.

### 2. Steps to Reproduce
(Must be exact and reproducible)
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

### 3. Expected Behavior
What SHOULD have happened? (e.g., "The EMI calculation should update instantly when moving the slider.")

### 4. Actual Behavior
What DID happen? (e.g., "The app froze for 3 seconds and then crashed to the Home Screen.")

### 5. Environment
- **Device/Simulator:** iPhone 15 Pro (iOS 17.2)
- **App Version:** v1.0.42 (Build 42)
- **Environment:** Staging / Production

### 6. Screenshots / Video
(Highly encouraged. Please attach a screen recording if it is an animation or flow issue).
```

## Core Template: Infrastructure/Mathematical Bug
Use this when the application *runs* fine, but the numbers outputted by the backend are incorrect or API requests are timing out.

**Title Format:** `[Engine/API] Description of the issue` (e.g., `[Engine] Total Savings calculation ignores processing fees`)

**Body:**
```markdown
### 1. Description
Briefly explain the calculation discrepancy. 

### 2. Input Parameters
- User Salary: X
- Debt Array Payload: [Provide JSON snippet submitted to Edge Function]
- Target Tenure: Y

### 3. Output Received (Response JSON)
[Provide the exact JSON response returned by the server]

### 4. The Mathematical Error
Explain exactly why the response is wrong based on standard financial logic. (e.g., "The EMI should be 4500 based on a 4.99% flat rate, but the server returned 4100.")

### 5. Severity
Critical (Blocks user application) / High (Incorrect numbers displayed) / Medium (UI aesthetic issue).
```
