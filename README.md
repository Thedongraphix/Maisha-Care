This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Doctor's Dashboard

The Doctor's Dashboard provides a comprehensive interface for medical professionals to:

1. **View and Manage Cases**
   - See a list of all assigned cases with status indicators
   - Filter cases by status (Pending Review, In Progress, Complete)
   - Filter cases by urgency (High, Medium, Low)
   - Search for specific patients or conditions
   - Sort cases by different criteria (date, name, urgency)

2. **Review Case Details**
   - Access patient information including symptoms, medical history, and attachments
   - Review AI-generated recommendations including diagnosis, treatment plans, and medications
   - Approve AI recommendations or modify treatment plans
   - Add clinical notes to cases

3. **Manage Profile**
   - Update personal and professional information
   - Change password and security settings
   - View performance metrics and statistics

### Dashboard Routes

- `/doctors/dashboard` - Main dashboard with case listing
- `/doctors/dashboard/case/[id]` - Detailed case view
- `/doctors/dashboard/profile` - Doctor's profile management

### API Endpoints

- `GET /api/cases` - Get a list of all cases (with filtering options)
- `GET /api/cases/[id]` - Get details of a specific case
- `PUT /api/cases/[id]` - Update a case (modify treatment plan or approve)
- `POST /api/cases/[id]/approve` - Approve a case recommendation
- `GET /api/doctor/profile` - Get doctor profile information
- `PUT /api/doctor/profile` - Update doctor profile information
