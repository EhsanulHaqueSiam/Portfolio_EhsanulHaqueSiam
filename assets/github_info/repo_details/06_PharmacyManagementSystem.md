# PharmacyManagementSystem

**GitHub:** https://github.com/EhsanulHaqueSiam/PharmacyManagementSystem  
**Language:** C# (91.6%) | **Framework:** .NET Framework 4.7.2

---

## Overview
A comprehensive .NET-based desktop application for pharmacy operations management. Features multi-role environment (Administrator, Pharmacist, Customer), modern UI with Guna.UI2, and secure authentication with email-based OTP.

---

## Key Features

| Feature | Description |
|---------|-------------|
| 👥 **Role-Based Access** | Admin, Pharmacist, and Customer interfaces |
| 💊 **Inventory Management** | Full CRUD operations for medicine records |
| ⏰ **Expiry Tracking** | Automated alerts for expired/low-stock medicines |
| 💰 **Sales System** | Dynamic pricing, coupon/discount support |
| 🔐 **OTP Security** | Email-based password recovery |
| 🎨 **Modern UI** | Guna.UI2 for sleek, responsive design |

---

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Language** | C# |
| **Framework** | .NET Framework 4.7.2 |
| **UI Library** | Guna.UI2 WinForms |
| **Database** | Microsoft SQL Server (T-SQL) |
| **Email/OTP** | MailKit, MimeKit |
| **Security** | BouncyCastle Cryptography |

---

## Project Structure

```
├── AdminstratorUC/     # Admin user controls (User management, Dashboard)
├── PharmacistUC/       # Pharmacist controls (Medicine mgmt, Selling, Validity)
├── CustomerUC/         # Customer-facing features
├── CustomerSignInUC/   # Customer authentication
├── DataAccess/         # Database interaction layer
├── Model/              # Domain models (Medicine, User, Transaction)
├── OTP/                # Secure OTP handling module
├── SQLQuery.sql        # Complete database schema
├── Program.cs          # Entry point
├── SignInGui.cs        # Main login
├── PharmacistGUI.cs    # Pharmacist dashboard
└── Adminstrator.cs     # Admin dashboard
```

---

## Database Schema

Tables include:
- **Admin** - Administrator accounts
- **Pharmacist** - Pharmacist users (linked to Admin)
- **Customer** - Customer accounts
- **Medicine** - Inventory with expiry tracking
- **Coupons** - Discount management
- **Transactions** - Sales records

---

## Skills Demonstrated

### Technical Skills
- **.NET Desktop Development** - WinForms, C#
- **Database Design** - SQL Server, relational modeling
- **Security Implementation** - OTP, encryption
- **Multi-Role Architecture** - Access control patterns
- **Modern UI/UX** - Third-party UI libraries

### Soft Skills
- Enterprise application architecture
- Security-first design thinking
- Comprehensive feature planning

---

## LinkedIn/Resume Bullet Points

> **Pharmacy Management System** | C#, .NET, SQL Server  
> - Developed **multi-role enterprise application** with Admin, Pharmacist, and Customer interfaces
> - Implemented **OTP-based authentication** using MailKit and BouncyCastle cryptography
> - Built **inventory management system** with automated expiry alerts and stock tracking
> - Designed **relational database schema** in SQL Server for transactions, coupons, and medicines
> - Created modern, responsive UI using **Guna.UI2 WinForms** components
