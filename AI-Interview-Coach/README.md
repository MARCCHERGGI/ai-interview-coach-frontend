# AI Interview Coach

AI Interview Coach is an AI-powered SaaS designed to simulate realistic restaurant job interviews. It helps job candidates prepare for restaurant positions by generating tailored interview questions, analyzing their responses, and providing actionable feedback. Users can track their interview progress over time and upgrade to a premium plan for unlimited interviews via Stripe payment integration.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Running the Project](#running-the-project)
  - [Starting the Frontend](#starting-the-frontend)
  - [Starting the Backend](#starting-the-backend)
- [API Documentation](#api-documentation)
  - [POST /api/generateQuestion](#post-apigeneratequestion)
  - [POST /api/analyzeAnswer](#post-apianalyzeanswer)
  - [GET /api/trackProgress](#get-apitrackprogress)
  - [POST /api/storeProgress](#post-apistoreprogress)
  - [POST /processPayment](#post-processpayment)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Contact](#contact)

---

## Project Overview

AI Interview Coach simulates restaurant job interviews by leveraging OpenAI to generate interview questions and analyze user responses. The SaaS platform offers:
- **Interview Simulation:** Dynamically generated questions tailored to specific restaurant roles.
- **Response Analysis:** AI-powered evaluation of candidate answers with performance scoring and feedback.
- **Progress Tracking:** A dashboard to view past interviews, scores, and improvements.
- **Premium Upgrade:** Option to upgrade for unlimited interviews via secure Stripe payments.

---

## Tech Stack

- **Frontend:**
  - Next.js
  - React
  - Tailwind CSS

- **Backend:**
  - Node.js
  - Express.js
  - OpenAI API
  - Stripe API
  - dotenv, CORS, body-parser

---

## Installation

### Frontend Setup

1. **Clone the Repository & Navigate to Frontend:**
   ```bash
   git clone https://github.com/yourusername/ai-interview-coach.git
   cd ai-interview-coach/frontend
