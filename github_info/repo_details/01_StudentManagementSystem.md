# StudentManagementSystem - Deep Analysis

**GitHub:** https://github.com/EhsanulHaqueSiam/StudentManagementSystem  
**Language:** Java (100%) | **Stars:** 17 | **Forks:** 8

---

## Overview
A comprehensive Student Management System built with Java and MySQL, featuring advanced database design with full normalization documentation, multiple connection strategies, and professional-grade documentation via GitHub Wiki.

---

## 📖 Wiki Documentation (4 Pages)

### 1. Database Design & ER Diagram
- Complete Entity-Relationship diagram for SMS
- Data architecture ensuring robustness and data integrity
- Optimized query performance design

### 2. Normalization & Finalization
**Database Tables Normalized to 3NF:**

| Entity | Attributes | Relationships |
|--------|------------|---------------|
| **Student** | S_ID(PK), S_name, S_contact, S_mail, EnrollYear | Enrolls, Takes, Sits |
| **Faculty** | F_ID(PK), F_name, F_contact, F_mail | Teaches |
| **Department** | D_ID(PK), D_name, D_head | Assigns, Conducts |
| **Program** | P_ID(PK), P_name, P_duration, P_type | Assigns |
| **Exam** | E_ID(PK), E_Date, E_type, E_roomno, Mark | Conducts, Sits |
| **Course** | C_ID(PK), C_name, C_credit | Offers, Takes |

**Normalization Process Documented:**
- Unnormalized Form → 1NF → 2NF → 3NF
- Full functional dependency analysis
- Junction tables for many-to-many relationships

### 3. Table Creation Scripts
- **Oracle SQL** scripts for table creation
- **MySQL** scripts for table creation
- Step-by-step setup instructions
- Foreign key relationships and constraints

### 4. Database Connection Strategies Comparison
**6 Connection Strategies Tested & Benchmarked:**

| Strategy | Connect Time (Dhaka) | Connect Time (NJ) | Query Time | Memory |
|----------|---------------------|-------------------|------------|--------|
| Singleton + Connection Pool | 7-9s | 45-50s | 6-8ms | Moderate |
| No Singleton, No Pool | 7-9s each | 45-50s each | 6-8ms | High |
| Singleton Shared Socket | 7-9s | 45-50s | 6-8ms | Minimal |
| Singleton Non-Shared Socket | 7-9s | 45-50s | 1s | Minimal |
| Multi Shared Sockets | 7-9s | 45-50s | 6-8ms | Moderate |
| Multi Non-Shared Sockets | 7-9s | 45-50s | 1s | High |

**Winning Strategy:** Singleton Pattern with Dynamic Connection Pool
- Efficient connection reuse
- Optimized resource utilization
- 10 connections default pool size

---

## Technical Skills Demonstrated

### Database Design
- **ER Modeling** - Entity-Relationship diagram design
- **Normalization** - 1NF, 2NF, 3NF implementation
- **Schema Design** - Primary/Foreign key relationships
- **Cross-database** - Oracle SQL and MySQL support

### Software Architecture
- **Singleton Pattern** - Design pattern implementation
- **Connection Pooling** - Dynamic pool sizing
- **Performance Benchmarking** - Geographic latency testing
- **Memory Optimization** - Resource utilization analysis

### Java Development
- **JDBC** - Java Database Connectivity
- **Object Serialization** - Data persistence
- **Multi-threading** - Connection management
- **Exception Handling** - Robust error management

---

## Key Features

1. **Student Management** - CRUD operations for student records
2. **Course Registration** - Enrollment and course management
3. **Faculty Records** - Teacher information management
4. **Department Management** - Departmental hierarchy
5. **Exam Management** - Exam scheduling and marks
6. **Multi-database Support** - Oracle and MySQL

---

## LinkedIn/Resume Bullet Points

> **Student Management System** | Java, MySQL, JDBC | ⭐17 Stars  
> - Designed **normalized database schema** (3NF) with 6+ entities and documented ER diagrams
> - Implemented **Singleton pattern with dynamic connection pooling** reducing query time to 6-8ms
> - Benchmarked **6 connection strategies** across geographic locations (Dhaka vs New Jersey)  
> - Created comprehensive **GitHub Wiki documentation** covering database design, normalization, and SQL scripts
> - Built system handling **student, faculty, course, and exam management** with full CRUD operations
> - Achieved **17 GitHub stars** and **8 forks** demonstrating project quality and community interest
