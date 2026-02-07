# Spotify Review Sentiment Analysis - Deep Analysis

**GitHub:** https://github.com/EhsanulHaqueSiam/spotify-review-sentiment  
**Language:** Jupyter Notebook | **License:** MIT

---

## Overview
A complete NLP sentiment analysis project analyzing 52,702 Spotify user reviews using Naïve Bayes classification, achieving 85-90% accuracy with TF-IDF feature extraction and comprehensive visualizations.

---

## 📊 Dataset Information

| Metric | Value |
|--------|-------|
| **Source** | [Kaggle - Spotify Dataset](https://www.kaggle.com/datasets/alexandrakim2201/spotify-dataset) |
| **Size** | 52,702 user reviews |
| **Features** | Review text, Sentiment label |
| **Distribution** | 55.8% Negative, 44.2% Positive |
| **Expected Accuracy** | 85-90% |

---

## 🔧 Machine Learning Pipeline

### Text Preprocessing Pipeline
1. **Tokenization** - Breaking text into individual words
2. **Case Folding** - Converting text to lowercase
3. **Punctuation Removal** - Cleaning special characters
4. **Stop Words Removal** - Filtering common words
5. **Stemming** - Reducing words to root form
6. **TF-IDF Vectorization** - Converting text to numerical features

### Model Configuration
| Component | Value |
|-----------|-------|
| **Algorithm** | MultinomialNB (Naïve Bayes) |
| **Features** | 5000+ TF-IDF features |
| **N-grams** | Unigrams and Bigrams |
| **Smoothing** | Laplace smoothing |

---

## 📋 Complete Notebook Pipeline (17 Tasks)

### Tasks 1-4: Setup & Data Loading
- Import libraries and basic data handling
- Load 52,702 Spotify reviews from Kaggle
- Data exploration and sentiment distribution analysis
- Initialize NLP preprocessing tools

### Tasks 5-8: Text Processing
- Build text cleaning and preprocessing functions
- Apply preprocessing to raw text data
- Extract TF-IDF numerical features
- Prepare train/test data split

### Tasks 9-12: Model Training & Evaluation
- Train MultinomialNB classifier
- Make test set predictions
- Calculate basic metrics (Accuracy, Precision, Recall, F1)
- Generate detailed classification report

### Tasks 13-17: Analysis & Visualization
- Plot confusion matrix
- Analyze most important features per class
- Create performance visualization charts
- Examine sample predictions
- Generate complete model summary

---

## 🤖 ML Evaluation Metrics

| Metric | Description |
|--------|-------------|
| **Accuracy** | Overall prediction correctness |
| **Precision** | True positives / Predicted positives |
| **Recall** | True positives / Actual positives |
| **F1-Score** | Harmonic mean of precision and recall |
| **Confusion Matrix** | Visual prediction analysis |

---

## 💻 Platform Support

| Platform | Feature |
|----------|---------|
| **Google Colab** | Zero setup, auto-installation |
| **Kaggle Secrets** | Secure credential management |
| **Mobile** | Works on phones/tablets |
| **Local** | Full local development support |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Language** | Python |
| **ML Framework** | scikit-learn |
| **NLP** | NLTK, TF-IDF |
| **Algorithm** | MultinomialNB |
| **Visualization** | Matplotlib, Seaborn |
| **Data Handling** | Pandas, NumPy |
| **Notebook** | Jupyter, Google Colab |
| **Data Source** | Kaggle API |

---

## LinkedIn/Resume Bullet Points

> **Spotify Sentiment Analysis** | Python, NLP, scikit-learn | MIT License  
> - Built **NLP sentiment classifier** analyzing **52,702 Spotify reviews** with **85-90% accuracy**
> - Implemented **complete text preprocessing pipeline** (tokenization, stemming, TF-IDF vectorization)
> - Trained **MultinomialNB classifier** with **5000+ TF-IDF features** using unigrams and bigrams
> - Created **comprehensive visualizations** including confusion matrix and feature importance charts
> - Designed **17-task structured notebook** demonstrating full ML pipeline from data loading to evaluation
> - Built **Google Colab integration** with auto-installation and Kaggle API credential management
