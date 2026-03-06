# SwasthyaSetu (Rural AI Doctor) 🩺

**SwasthyaSetu** is a comprehensive, AI-powered rural healthcare platform designed to bridge the healthcare gap in underserved regions. It serves as a digital assistant for **ASHA (Accredited Social Health Activist) Workers** on the ground and a triage/diagnostic dashboard for **Doctors** at primary and district healthcare centers.

---

## ✨ Key Features

1. **🧠 AI Diagnostics & Multi-Language NLP Engine**
   - Natural language symptom parsing (English, Hindi, and Marathi).
   - Automatically extracts symptom durations ("3 days", "do din se").
   - Analyzes patient age context and pregnancy status to dynamically adjust risk levels.

2. **🚨 Automated Smart Triage & Case Escalation**
   - **Low/Medium Risk**: Automatic home monitoring protocol generation for ASHA workers.
   - **High/Critical Risk**: Automatic rapid escalation routing critical cases directly to the nearest Doctor’s Dashboard for immediate intervention.

3. **📴 Offline-First Architecture**
   - Built to handle volatile rural internet connectivity.
   - Offline form submissions cached in **IndexedDB** (`offlineDB.ts`).
   - Background-sync pushes queued actions (patient registrations, symptom logs) to MongoDB automatically once the device restores connection.

4. **📝 Health Schemes Matcher**
   - Evaluates patient profile and symptoms against government health policies.
   - Outputs instant eligibility alerts (e.g., JSY for pregnant women, NTEP for prolonged TB-like coughs).

5. **🏥 Two Dedicated Portals**
   - **ASHA Dashboard (`/asha`)**: Mobile-first, action-friendly UI designed for rapid patient intake, simple language input, and offline tracking.
   - **Doctor Dashboard (`/doctor`)**: Clinical command center highlighting high-priority escalated cases and full patient medical history timelines.

6. **📞 Teleconsultation Integrated**
   - Instant video-conferencing UI built for optimal performance on low-bandwidth rural networks.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- **State/Offline Cache**: IndexedDB
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB URI for your database cluster

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd rural-ai-doctor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/SwasthyaSetu?retryWrites=true&w=majority
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Folder Structure

```text
rural-ai-doctor/
├── app/                      # Next.js App Router (Pages & APIs)
│   ├── api/                  # Backend API Routes
│   ├── asha/                 # ASHA Worker Portal
│   ├── doctor/               # Doctor Dashboard Portal
│   └── page.tsx              # Landing Page & Marketing
├── components/               # Reusable React UI Components
├── lib/                      # Core Logic & Utilities (AI Engine, offline DB, Mongo)
└── models/                   # Mongoose Database Schemas
```

---

## 🤝 Contribution
Feel free to open an issue or submit a pull request if you'd like to improve the AI symptom engine rules, add new scheme matchers, or improve offline syncing!

## 📄 License
This project is proprietary / open-source under your preferred license.
