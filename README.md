# odoo-virtual-round-solution
# EcoSphere — ESG Management Platform

> A platform to track and manage Environmental, Social, and Governance (ESG) performance inside everyday business operations, with reporting and gamification built in.

**Team:** Error404
**Repository:** odoo-virtual-round-solution

---

## Overview

Companies today are expected to track carbon emissions, support employee well-being, and stay compliant with governance rules. Most ERP systems collect regular business data, but ESG tracking is usually done by hand, kept in separate files, and hard to check in real time.

**EcoSphere** fixes this by building ESG tracking directly into daily business operations. It measures sustainability data, gets employees involved through simple gamification, and puts everything together in one dashboard for management to review.

---

## Problem Statement

Build an ESG Management Platform that lets organizations measure, manage, and improve their Environmental, Social, and Governance performance by bringing together:

- Day-to-day operational data
- Employee participation
- Compliance activities

All of this comes together in one dashboard, with gamification used to keep employees engaged.

---

## Core Modules

| Module | Focus Areas |
|---|---|
| Environmental | Carbon accounting, emission factors, sustainability goals, carbon reports |
| Social | CSR activities, employee participation, diversity metrics, engagement |
| Governance | Policies, audits, compliance tracking, governance reports |
| Gamification | Challenges, badges, XP, rewards, leaderboards |

---

## Data Model

### Master Data

| Model | Purpose |
|---|---|
| Department | Organizational hierarchy and ESG ownership |
| Category | Shared category values used across Social and Gamification modules |
| Emission Factor | Carbon values used in calculations |
| Product ESG Profile | ESG information linked to products |
| Environmental Goal | Sustainability targets |
| ESG Policy | Governance policies |
| Badge | Employee achievements, unlocked automatically |
| Reward | Incentives that can be redeemed using points |

### Transactional Data

| Model | Purpose |
|---|---|
| Carbon Transaction | Stores calculated emissions from business operations |
| CSR Activity | Social initiatives organized by the company |
| Employee Participation | Tracks employee involvement in CSR activities |
| Challenge | Sustainability challenges with a defined lifecycle |
| Challenge Participation | Tracks employee progress within challenges |
| Policy Acknowledgement | Records of employees accepting policies |
| Audit | Governance audits |
| Compliance Issue | Governance violations with an owner and due date |
| Department Score | Combined ESG performance for each department |

---

## Business Workflow

```
Master Configuration
   (Departments, Categories, Emission Factors, Products, Goals, Policies, Challenges)
        |
        v
Daily Business Operations
   (Purchase, Manufacturing, Expenses, Fleet)
        |
        v
Carbon Transactions
        |
        v
Employee Participation (CSR), Challenge Participation
Policy Acknowledgements, Audits
        |
        v
Environmental Score, Social Score, Governance Score
        |
        v
Department Total Score
        |
        v
Overall ESG Score
   (weighted average, default split: Environmental 40%, Social 30%, Governance 30%,
    can be changed per organization)
        |
        v
Organization Dashboard and Reports
```

---

## Expected Features

### Environmental
- Set up emission factors
- Calculate carbon emissions, automatically or manually
- Track carbon usage by department
- Track sustainability goals
- Environmental dashboard

### Social
- Manage CSR activities
- Track employee participation, with proof and approval steps
- Track diversity metrics
- Track training completion

### Governance
- Manage ESG policies
- Track policy acknowledgements
- Manage audits
- Track compliance issues, with an owner and due date for each

### Gamification
- Challenges with a clear lifecycle: Draft, Active, Under Review, Completed, or Archived at any point
- XP system
- Badges awarded automatically once rules are met
- Rewards that can be redeemed with points or XP, based on stock
- Leaderboards

### Settings and Administration
- Manage departments
- Manage categories
- ESG configuration, including score weightings and toggles
- Notification settings

---

## Reports

The platform can generate:
- Environmental Report
- Social Report
- Governance Report
- ESG Summary Report
- Custom Report Builder, for combining filters and exporting as PDF, Excel, or CSV

Reports can be filtered by: Department, Date Range, Module, Employee, Challenge, ESG Category

---

## Core Business Rules

| Rule | Description |
|---|---|
| Reward Redemption | Employees redeem points or XP for rewards, if stock is available; their balance is reduced after redemption |
| Notification System | Sends in-app or email alerts for new compliance issues, CSR or Challenge approvals, policy reminders, and badge unlocks |
| Auto Emission Calculation | When turned on, carbon transactions are calculated automatically from Purchase, Manufacturing, Expense, or Fleet records using the matching emission factor |
| Evidence Requirement | When turned on, a CSR activity cannot be approved without a proof file attached |
| Badge Auto-Award | When turned on, a badge is given automatically as soon as an employee's XP or challenge count meets the required rule |
| Compliance Issue Ownership | Every compliance issue must have an owner and a due date; issues still open past their due date are flagged |

---

## Bonus Ideas (Future Scope)

- Department ESG rankings
- Better dashboard visualizations
- Mobile-friendly interface

---

## Tech Stack

> Update this section as the stack is finalized.

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB |
| Auth | JWT-based authentication |
| Reports | PDF, Excel, and CSV export |
| Data Science / AI | Python, used for ESG score modelling, emission prediction, and analytics support |

The team works primarily in the MERN stack for the application layer, with data science and AI used to support scoring, prediction, and analytics features.

---

## Design Reference

Mockup: [Excalidraw Wireframe](https://link.excalidraw.com/l/65VNwvy7c4X/2m6lz9Ln4)

---

## Project Status

This repository is currently in its early stage. The core data models, business workflow, and feature scope are defined, and development is in progress.

### Roadmap
- [ ] Master data models and schemas
- [ ] Carbon accounting engine
- [ ] CSR and employee participation module
- [ ] Governance and compliance module
- [ ] Gamification engine, for XP, badges, rewards, and leaderboards
- [ ] Reporting and custom report builder
- [ ] Dashboard UI
- [ ] Notification system

---

## Team Error404

This project is built by Team Error404, with a focus on MERN stack web development on the frontend and application side, and data science and AI on the analytics side.

| Name | Role |
|---|---|
| Manikant | Team Leader, MERN Stack Development |
| Suryamsh Gupta | MERN Stack Development |
| Nikhil Pal | MERN Stack Development |
| Shivam Kumar | Data Science and AI |

Repository: [odoo-virtual-round-solution](https://github.com/Manikant0931/odoo-virtual-round-solution)
