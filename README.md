# Smart Study Companion

Smart Study Companion is a web application designed to help students manage their study schedules and prepare for exams effectively. The application includes features like an exam countdown, study plans, and AI-powered assistance.

## Features

- **Exam Countdown**: Displays a real-time countdown to upcoming exams.
- **Study Plan Management**: Organize and track your study schedule.
- **AI Assistance**: Leverages AI to provide study tips and recommendations.

## Technologies Used

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB (or specify your database)
- **Other Tools**: Git, ESLint, Prettier

## Components

### ExamCountdown Component

The `ExamCountdown` component displays a countdown timer for an upcoming exam. It dynamically updates every second to show the remaining days, hours, minutes, and seconds.

#### Props

- `examName` (string): The name of the exam.
- `examDateTime` (string): The date and time of the exam in ISO format.

#### Example Usage

```tsx
<ExamCountdown examName="Math Final" examDateTime="2025-04-10T09:00:00Z" />

Smart_Study_Final/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   └── 
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── pages/
│   │   │   └── StudyPlan.tsx
├── server/
│   ├── index.ts
