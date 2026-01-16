# ScholarlyEdge Nexus

## 1. Project Description
ScholarlyEdge Nexus is a comprehensive Project Management Website designed to streamline academic and professional project workflows. It provides a centralized platform for managing projects, assignments, and financial tracking for both administrators and writers.

## 2. Project Flow & Features

### Role-Based Navigation
- **Dynamic Sidebars**: The application provides distinct sidebar navigations based on the user's role.
    - **Admin Sidebar**: Focuses on user management, project distribution, and financial oversight.
    - **Writer Sidebar**: Focuses on assigned tasks, milestone updates, and personal earnings.

### Admin Workflow
1.  **Job Acquisition**: Admin receives a new project writing job from a client.
2.  **Project Creation**: Admin navigates to the dashboard and clicks the **"New Project"** icon.
3.  **Project Details**: Admin fills in:
    *   **Project Title**: Descriptive name of the project.
    *   **Writer Assignment**: Selects a writer from the list of registered writers.
    *   **Deadline**: Sets the delivery date for the writer.
    *   **Financials**:
        *   **Client Price (Revenue)**: Total amount the admin is getting paid (e.g., 100,000 NGN).
        *   **Writer Price (Expense)**: Amount the admin will pay the writer (e.g., 70,000 NGN).
4.  **Tracking**: Admin dashboard displays each project with details of the assigned writer, delivery schedule, and payment breakdown.
5.  **Financial Overview**: Admin's **Finances Page** automatically calculates and displays:
    *   **Total Revenue**: Sum of all project client prices.
    *   **Total Expenses**: Sum of all writer payments.
    *   **Profit**: Net difference between revenue and expenses.

### Writer Workflow
1.  **Dashboard View**: Writers see their assigned projects immediately upon logging in.
2.  **Status Updates**: Writers can update the progress of each project through predefined stages:
    *   *Pending*
    *   *Chapter 1 Completed*
    *   *Chapter 2 Done*
    *   *Final Review*
    *   *Completed*
3.  **Earnings Tracking**: Writers can see their agreed payment for each project.

## 3. Scope of Work
- **Admin & Writer Dashboards**: Tailored interfaces for different user roles to manage tasks efficiently.
- **Project Assignment**: Seamless distribution of projects from administrators to writers.
- **Workflow Tracking**: Real-time monitoring of project progress and status updates.
- **Financial Tracking**: Integrated systems for managing payments and financial records.
- **Email Notifications**: Automated alerts for project updates, assignments, and milestones.

## 4. Tech Stack

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Notifications**: Nodemailer
- **Validation**: express-validator

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS (v4)
- **Icons**: Lucide React
- **Routing**: React Router
- **API Client**: Axios

## 4. Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (local or Atlas)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `env-example.txt` and fill in your credentials.
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `env-example.txt` if necessary.
4. Start the development server:
   ```bash
   npm run dev
   ```

## 5. Project Structure
```text
scholarlyedge/
├── backend/            # Express API, Models, Controllers, Middleware
├── frontend/           # React Application (Vite)
│   ├── src/
│   │   ├── components/ # Shared UI Components
│   │   ├── pages/      # Dashboard and View components
│   │   ├── services/   # API integration
│   │   └── utils/      # Helper functions
└── README.md
```
