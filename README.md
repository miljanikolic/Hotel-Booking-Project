# Hotel Booking Management System

A full-stack Hotel Booking Management System developed as a technical assessment.

The application allows hotel staff to manage rooms, guests, and bookings through a web-based interface.

## Technologies
# Backend

.NET 10
ASP.NET Core Web API
Entity Framework Core
PostgreSQL
C#
REST API

# Frontend

Next.js 16
React
TypeScript
Tailwind CSS

## Development Tools

Visual Studio
Visual Studio Code
Git / GitHub

## Architecture

The backend follows a layered architecture with separation of responsibilities:

HotelBooking.API -> HotelBooking.Application -> HotelBooking.Infrastructure -> HotelBooking.Entities

## Required installations:
.NET 10 SDK
Node.js
npm
PostgreSQL
Git


## Backend Setup

-Clone the repository:
git clone <https://github.com/miljanikolic/Hotel-Booking-Project.git>

-Open the application's appsettings.json file in Hotel Booking Project\HotelBooking.API and configure the PostgreSQL connection string.
Replace YOUR_PASSWORD with your local PostgreSQL password

-Navigate to the project directory:
cd HotelBooking

-Restore .NET dependencies:
dotnet restore

-Build the solution:
dotnet build

-Make sure PostgreSQL is running and that the application's connection string is correctly configured.

-Update the database:
dotnet ef database update

-Run the backend:
dotnet run --project HotelBooking.API

-The API will be available at:
http://localhost:5291


## Frontend Setup

-Open a new terminal and navigate to the frontend directory:
cd "Hotel Booking - frontend"

-Install the required packages:
npm install

-Start the development server:
npm run dev

-The frontend will be available at:
http://localhost:3000












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
