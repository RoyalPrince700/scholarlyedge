# ScholarlyEdge Implementation Roadmap

This document outlines the step-by-step process to implement the project management and financial tracking flow.

---

## Phase 1: Backend Model & Controller Enhancements [COMPLETED]

### Step 1.1: Update Project Model [DONE]
**Goal:** Ensure the project model can store both the client price and the writer's pay.
- **Action:** Add `clientPrice` and `writerPrice` fields to `backend/models/Project.js`.
- **Backend Prompt:** 
  > "Update the Project model in `backend/models/Project.js` to include `clientPrice` (Number) and `writerPrice` (Number) fields. Ensure they are required and have a minimum value of 0. Also, add 'Chapter 1 Completed' and 'Chapter 2 Done' to the allowed status enum values."

### Step 1.2: Update Project Controller (Creation Logic) [DONE]
**Goal:** Automatically create financial records when a project is created.
- **Action:** Modify `createProject` in `backend/controllers/projectController.js` to create two `Financial` documents: one for income (client price) and one for expense (writer price).
- **Backend Prompt:**
  > "Modify the `createProject` controller in `backend/controllers/projectController.js`. When a project is created, it should also create two entries in the `Financial` collection:
  > 1. An 'income' entry with category 'project-payment' using the `clientPrice`.
  > 2. An 'expense' entry with category 'writer-payment' using the `writerPrice`.
  > Link both to the newly created project ID."

---

## Phase 2: Sidebar & Navigation Refactor [COMPLETED]

### Step 2.1: Implement Role-Based Sidebar [DONE]
**Goal:** Create a distinct sidebar experience for Admins and Writers.
- **Action:** Refactor `frontend/src/components/Layout.jsx` to separate sidebar configurations for 'admin' and 'writer'.
- **Frontend Prompt:**
  > "Refactor `Layout.jsx` to implement a role-based sidebar. If the user is an 'admin', show links for: Dashboard, Project Management, User Management, and Financial Dashboard. If the user is a 'writer', show: My Projects, My Earnings, and Profile. Ensure the styling follows the ChatGPT-inspired gray tones for the sidebar."

---

## Phase 3: Admin Frontend - Project Management [COMPLETED]

### Step 3.1: Update "New Project" Modal/Form [DONE]
**Goal:** Add inputs for Client Price and Writer Price in the creation form.
- **Action:** Update the project creation form in `frontend/src/pages/ProjectManagement.jsx`.
- **Frontend Prompt:**
  > "Update the 'New Project' form in `ProjectManagement.jsx` to include input fields for 'Client Price (Revenue)' and 'Writer Price (Expense)'. Ensure the writer assignment dropdown is populated with a list of users whose role is 'writer'."

### Step 3.2: Enhance Admin Dashboard Project List [DONE]
**Goal:** Show writer details and financial breakdown in the project list.
- **Action:** Update `AdminDashboard.jsx` or `ProjectManagement.jsx` to display the assigned writer's name, their pay, and the deadline.
- **Frontend Prompt:**
  > "Enhance the project list view in the Admin Dashboard. For each project, display the Assigned Writer's name, the Deadline, the Client Price, and the Writer's Pay. Use Tailwind classes to make it look clean and professional, following the ChatGPT-inspired design system."

---

## Phase 4: Financial Dashboard Implementation [COMPLETED]

### Step 4.1: Revenue and Expense Tracking [DONE]
**Goal:** Display total revenue, total expenses, and profit.
- **Action:** Update `frontend/src/pages/FinancialDashboard.jsx` to fetch and aggregate financial data.
- **Frontend Prompt:**
  > "In `FinancialDashboard.jsx`, implement a summary section that shows 'Total Revenue' (sum of all income), 'Total Expenses' (sum of all expenses), and 'Net Profit'. Add a list of recent transactions showing the project title associated with each payment."

---

## Phase 5: Writer Dashboard & Status Updates [COMPLETED]

### Step 5.1: Writer Project View [DONE]
**Goal:** Allow writers to see their specific projects and update progress.
- **Action:** Update `frontend/src/pages/WriterDashboard.jsx`.
- **Frontend Prompt:**
  > "Update the Writer Dashboard to fetch and display only projects assigned to the logged-in writer. Add a dropdown or button group for each project to update its status to 'Chapter 1 Completed', 'Chapter 2 Done', or 'Completed'."

### Step 5.2: Status Update API [DONE]
**Goal:** Ensure the backend handles these specific status updates.
- **Action:** Check `backend/routes/projects.js` and `backend/controllers/projectController.js` for status update endpoints.
- **Backend Prompt:**
  > "Ensure the `updateProjectStatus` endpoint in the backend allows writers to update the status to the new milestones ('Chapter 1 Completed', etc.) and that it only allows them to update projects assigned to them."
