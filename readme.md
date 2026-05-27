# Event Management Platform

A feature-rich, full-stack event management system built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Key Features

### 🔐 User Authentication & Roles
- **Multi-Role Support**: Admins, Organizers, and Participants (Attendees).
- **Secure Auth**: JWT-based authentication with role-based access control.
- **Profile Management**: Update personal info, view booking history, and manage accounts.

### 📅 Event Management
- **Creation**: Organizers can create events with titles, detailed descriptions, categories, capacity, location, and multiple sessions.
- **Search & Filter**: Find events by keyword, category, or date with real-time results.
- **Dynamic Sessions**: Add multiple sessions with individual titles, speakers, and times for each event.
- **Image Uploads**: Integrated with Cloudinary for seamless event banner uploads.

### 🎟 Ticketing & Registration
- **Online Booking**: Integrated with **Razorpay** for secure, real-time payment processing.
- **QR Code Tickets**: Automatically generate unique QR codes for every ticket booked.
- **Attendee Check-in**: Organizers can scan QR codes to track attendance in real-time.
- **Certificates**: Automatically generate and download PDF participation certificates after the event.

### 📊 Analytics & Reporting
- **Organizer Dashboard**: Real-time stats for total events, registrations, and revenue.
- **Visualizations**: Interactive Bar and Pie charts (via Recharts) for event performance.
- **Data Export**: Export attendee lists and platform events as CSV files for offline analysis.
- **Admin Panel**: System-wide control to manage all users, events, and view global analytics.

### 💬 Engagement & Support
- **Feedback System**: Rate events and leave comments after attending.
- **AI Chatbot**: Gemini-powered chatbot for instant user support and event discovery.
- **Social Sharing**: One-click sharing to Facebook, Twitter, and LinkedIn.
- **Email Notifications**: Automated confirmation emails for ticket bookings and reminders.

## 🛠 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React, Recharts, jsPDF.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **Payments**: Razorpay.
- **Storage**: Cloudinary, Multer.
- **Communication**: Nodemailer.
- **Tools**: JWT, bcryptjs, qrcode, json2csv.

## ⚙️ Getting Started

### Prerequisites

- Node.js & npm
- MongoDB Atlas or local instance

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd Event
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

### Environment Configuration

Create a `.env` file in the `server/` directory and populate it with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_google_gemini_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

### Running the Application

1. **Start Backend**:
   ```bash
   cd server
   npm start
   ```

2. **Start Frontend**:
   ```bash
   cd ../client
   npm run dev
   ```

Visit `http://localhost:5173` to view the application.

## 📄 License

Distributed under the MIT License.
