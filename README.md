# STELLAR

## Introduction
This is the app for doing Systematic Topic Evaluation Leveraging Lists of ARticles.


## Setup & Installation
```bash
git clone <repo-url>
```

```bash
pip install -r requirements.txt
```

## Files required
Two files are required to run the app. 
1. articles_df.csv 
    The articles and their labels. Must contain the columns ["text", "title", "keywords", "label", "x", "y", "z"]
2. topics_df.csv
    The topics list. Must contain the columns ["topic_id", "keywords"] 



## Running The App

```bash
python main.py
```

## Viewing The App

Go to `http://127.0.0.1:5000/`


## Dataset 
Demo news data from BBC news from D. Greene and P. Cunningham.
"Practical Solutions to the Problem of Diagonal Dominance in Kernel Document Clustering", Proc. ICML 2006.

http://mlg.ucd.ie/datasets/bbc.html

** Note that this dataset is not the same industry dataset that was used in the original article. This is only for demo purposes. **


## Instructions human evaluation
