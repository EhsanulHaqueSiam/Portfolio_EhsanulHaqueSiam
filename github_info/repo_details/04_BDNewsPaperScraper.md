# BDNewsPaperScraper - Deep Analysis

**GitHub:** https://github.com/EhsanulHaqueSiam/BDNewsPaperScraper  
**Language:** Python (100%) | **Stars:** 1 | **Forks:** 1 | **Contributors:** 2

---

## Overview
Advanced news scraper for major Bangladeshi newspapers with cross-platform support, comprehensive logging, and intelligent data extraction. Features API-based scraping, date filtering, real-time monitoring, and automated export tools.

---

## 📰 Supported Newspapers (7 Spiders)

| Spider | Command |
|--------|---------|
| **Prothom Alo** | `uv run scrapy crawl prothomalo` |
| **Daily Sun** | `uv run scrapy crawl dailysun` |
| **Daily Ittefaq** | `uv run scrapy crawl ittefaq` |
| **BD Pratidin** | `uv run scrapy crawl BDpratidin` |
| **Bangladesh Today** | `uv run scrapy crawl bangladesh_today` |
| **The Daily Star** | `uv run scrapy crawl thedailystar` |
| **Kaler Kantho** | `uv run scrapy crawl kalerKantho` |

---

## 🗂️ Database Schema

```sql
CREATE TABLE articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    paper_name TEXT NOT NULL,
    headline TEXT NOT NULL,
    article TEXT NOT NULL,
    publication_date TEXT,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 Key Features

| Feature | Description |
|---------|-------------|
| **Date Range Filtering** | `start_date` and `end_date` parameters for all spiders |
| **Cross-Platform** | Windows (.bat), Linux/macOS (.sh), Python runner |
| **Shared Database** | Single SQLite database for all newspapers |
| **Duplicate Prevention** | Automatic URL checking |
| **Smart Extraction** | Multiple fallback content extraction methods |
| **Bengali Date Conversion** | Optimized Bengali to English date processing |
| **Auto Data Cleaning** | Text normalization and sanitization |
| **Export Tools** | Excel and CSV export support |
| **Comprehensive Logging** | DEBUG, INFO, WARNING, ERROR levels |

---

## ⚙️ Spider Configuration

```bash
# Limit articles per spider
uv run scrapy crawl prothomalo -s CLOSESPIDER_ITEMCOUNT=100

# Add delays between requests
uv run scrapy crawl dailysun -s DOWNLOAD_DELAY=2

# Increase concurrent requests
uv run scrapy crawl ittefaq -s CONCURRENT_REQUESTS=32

# Set log level
uv run scrapy crawl BDpratidin -L DEBUG
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Language** | Python |
| **Framework** | Scrapy |
| **Database** | SQLite3 |
| **Package Manager** | UV (modern Python) |
| **Build Tools** | Shell scripts, Batch files |
| **CI/CD** | GitHub Actions support |
| **Export** | Excel, CSV |

---

## 🚀 Run Methods

1. **Individual Spider Commands** - Best for development
2. **Enhanced Batch Runner** - Recommended for production
3. **Python Runner** - Cross-platform with full output
4. **Makefile Approach** - Simple commands
5. **CI/CD Pipeline** - Automated runs
6. **Docker/Container** - Isolated environment
7. **System Service** - Linux/macOS daemon
8. **Cron Scheduling** - Automated scheduling

---

## LinkedIn/Resume Bullet Points

> **BD NewsPaper Scraper** | Python, Scrapy, SQLite | ⭐ Open Source  
> - Built **web scraping framework** for **7 major Bangladeshi newspapers** using Scrapy
> - Implemented **date range filtering** and **duplicate URL prevention** for data quality
> - Designed **unified SQLite database schema** storing headlines, articles, and metadata
> - Created **cross-platform runners** (Windows .bat, Linux .sh, Python) with comprehensive logging
> - Developed **Bengali date conversion** and **smart content extraction** with fallback methods
> - Built **export tools** for Excel and CSV with advanced filtering options
