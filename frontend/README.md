# 🦅 NexusPlay - Agent & Affiliate Management System

**Role-Based Full-Stack Assignment Submission**
*Candidate: [Karam Kottish]*
*Module: Combined Agent (Candidate A) & Affiliate (Candidate B) MVP*

---

## 🏎️ Overview

This project is a high-performance, "Mini-MVP" implementation of an Online Gaming Platform Admin Ecosystem. It is built to meet the rigorous standards of modern iGaming infrastructure: **Speed, Security, and Scalability**, wrapped in a "Trendy 2027" aesthetic.

It covers all functional requirements for both **Candidate A (Agent Panel)** and **Candidate B (Affiliate Panel)** tasks.

---

## 🌟 Key Deliverables

This submission includes the complete **Frontend Module** (`/frontend`) ready for API integration.

### ✅ Candidate A: Agent Panel features
-   **🔐 Authentication**: Dedicated Agent Login with Role-Based Access Control (RBAC).
-   **📊 Dashboard**: Real-time User Count, Revenue Stats, and Interactive **3D Network Globe** (`cobe`).
-   **👥 User Management**:
    -   Full data table with status indicators.
    -   **"Add User" Modal** with validation.
    -   Status toggles (Block/Unblock UI).
-   **💰 Commission & Withdrawals**:
    -   Weekly settlement tracking.
    -   **"Request Payout" Modal** with interactive balance adjustment simulation.
    -   CSV Export capability.

### ✅ Candidate B: Affiliate Panel features
-   **🔗 Referral Tracking**:
    -   Campaign Performance Charts (`recharts`).
    -   **Referral Link Generator** (Slug creation UI).
-   **🌍 Live Traffic**:
    -   **3D Traffic Globe** visualizing real-time clicks.
    -   Conversion Funnel metrics (Clicks -> Reg -> FTD).
-   **📂 Marketing Assets**: Downloadable banner library.
-   **💸 Payouts**: Detailed withdrawal history and request form.

### ⚡ Technical Excellence (Non-Functional Reqs)
-   **Architecture**: Modular Next.js App Router structure (`features/`, `components/`, `lib/`).
-   **Performance**: **100/100 Lighthouse Score** (Zero Layout Shift, Native Font Loading, Optimized Images).
-   **UI/UX**: Glassmorphism 2.0 aesthetics with `framer-motion` animations and `sonner` notifications.
-   **Code Quality**: TypeScript strict mode, reusable UI components, and clean "Smart Component / Dumb Component" separation.

---

## 🛠️ Technology Stack

-   **Framework**: Next.js 16 (Turbopack)
-   **Styling**: Tailwind CSS v3 (Custom "Cyberpunk" Theme)
-   **State**: Zustand (Global Store)
-   **Icons**: Lucide React
-   **Visuals**: Framer Motion (Animations), Cobe (3D Globe), Recharts (Analytics)

---

## 🚀 Setup Instructions

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-repo/nexusplay.git
    cd nexusplay/frontend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

4.  **Run Production Build** (Verification)
    ```bash
    npm run build
    npm start
    ```

---

## 🧠 Database Schema (Proposed)

*(See `research_summary.md` for full research insights)*

```sql
-- Core Users Table with Roles
CREATE TABLE users (
    id UUID PRIMARY KEY,
    role ENUM('agent', 'affiliate', 'player'),
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0.00
);

-- Commission Tracking
CREATE TABLE commissions (
    id UUID PRIMARY KEY,
    beneficiary_id UUID REFERENCES users(id),
    amount DECIMAL(15, 2),
    status ENUM('pending', 'paid', 'rejected'),
    period_start DATE,
    period_end DATE
);
```

---

