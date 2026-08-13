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
Swagger

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

RUN APP IN VISUAL STUDIO OR:
-Navigate to the project directory:
cd HotelBooking

-Restore .NET dependencies:
dotnet restore

-Build the solution:
dotnet build

-Make sure PostgreSQL is running and that the application's connection string is correctly configured.

-Run the backend:
dotnet run --project HotelBooking.API

-The API will be available at:
http://localhost:5291/swagger/index.html


## Frontend Setup

-Open a new terminal in Visual Studio Code and navigate to the frontend directory:
cd "Hotel Booking - frontend"

-Install the required packages:
npm install

-Start the development server:
npm run dev

-The frontend will be available at:
(ctrl+ click) on http://localhost:3000

-Login credentials:
Username: Admin
Password: Admin123


