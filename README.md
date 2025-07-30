# FlightBook Web App With Next.js & TypeScript

FlightBook is a modern, responsive flight booking system built with **Next.js**, **TypeScript**, **TailwindCSS**, and **Shadcn**. It provides a clean and user-friendly interface for users to browse, book, and manage flights, with features like authentication, flight management, and seat booking.

## Live Deployment
Explore the live application: [FlightBook App](https://flight-booking-app-mocha.vercel.app)

## Project Overview
FlightBook is designed to interact with a REST API to deliver a seamless flight booking experience. The application includes user authentication, flight management (for admins), and a seat booking system with a reservation lock timer. It is built with modern web technologies to ensure performance, scalability, and maintainability.

### Tech Stack
- **Next.js**: React framework for server-side rendering and static site generation
- **TypeScript**: Type-safe JavaScript for improved developer experience
- **TailwindCSS**: Utility-first CSS framework for rapid UI development
- **Shadcn**: Reusable, customizable UI components
- **REST API**: Integration with a documented API for flight and booking data

### Features
1. **Authentication System**
   - User registration
   - User login
2. **Flights Management**
   - Display a list of flights with details (name, departure, arrival, time, etc.)
   - Add new flights (admin/authorized users only)
   - Edit existing flight information
   - Delete flights
   - Filter/search flights by name, date, or location
3. **Seat Booking System**
   - Book a seat on a flight
   - 2-minute seat reservation lock with countdown timer
   - Update a booking
   - Delete a booking

## Installation Guide
Follow these steps to set up the FlightBook Web App locally.

### Prerequisites
- **Node.js**: Version 18.x or higher
- **npm** or **yarn**: Package manager for Node.js
- **Git**: For cloning the repository

### Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/flight-booking-app.git
   cd flight-booking-app
   ```

2. **Install Dependencies**
   Using npm:
   ```bash
   npm install
   ```
   Or using yarn:
   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**
   Create a `.env.local` file in the root directory and add the required environment variables:
   ```env
   NEXT_PUBLIC_API_URL=https://your-api-endpoint
   ```
   Replace `https://your-api-endpoint` with the actual API server URL (refer to the [API Documentation](#)).

4. **Run the Development Server**
   Using npm:
   ```bash
   npm run dev
   ```
   Or using yarn:
   ```bash
   yarn dev
   ```
   The app will be available at `http://localhost:3000`.

5. **Build for Production**
   To create an optimized production build:
   ```bash
   npm run build
   ```
   Start the production server:
   ```bash
   npm run dev
   ```

## API Integration
The app interacts with a REST API for managing flights and bookings. Refer to the [API Documentation (Postman)](https://your-api-docs-link) for details on endpoints, authentication, and payloads.

## Contributing
We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License.
