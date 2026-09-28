# LSNM Network Intrusion Detection (Random Forest vs LightGBM)

Binary network intrusion detection: classify traffic as **normal** or **attack** using two tree-based machine learning models trained on the LSNM2024 dataset.

## Description

This project trains and compares two supervised classifiers on a 150K-row, ML-ready sample of the **Large-Scale Network Cyberattacks Multiclass Dataset 2024 (LSNM2024)**. The target column `label` is binary (0 = normal, 1 = attack). The `attack_type` column is used only to stratify the train/test split so every attack category is proportionally represented in both sets.

The work is based on the paper:

> Q. Abu Al-Haija, Z. Masoud, A. Yasin, K. Alesawi, Y. Alkarnawi, *"End-to-End Threat Hunting with a Novel Multiclass Dataset for Intelligent Intrusion Detection"*, TechRxiv preprint, 2025 (not peer reviewed). DOI: https://doi.org/10.36227/techrxiv.175459955.56010835/v1

## Dataset

- **Source:** LSNM2024 on Mendeley Data
  - Link: https://data.mendeley.com/datasets/7pzyfvv9jn/1
  - DOI: 10.17632/7pzyfvv9jn.1
- **File used:** `LSNM2024_150K_ML_ready.csv` (150K rows, all-numeric features plus `attack_type` and `label`)
- The dataset covers normal traffic plus 15 attack types (e.g. DoS, DDoS variants, SYN/ICMP flood, port scanning, SSH/FTP brute force, SQL injection, XSS, MITM ARP spoofing, fuzzing, remote code execution).
- The CSV is **not** included in this repository. Download it and place it in the project root (or update the path in the script).

## Algorithms

| Model | Key settings |
|---|---|
| Random Forest | `n_estimators=200`, `n_jobs=-1`, `random_state=42` |
| LightGBM | `n_estimators=300`, `learning_rate=0.1`, `random_state=42` |

**Split:** 80% train / 20% test, `random_state=42`, stratified by `attack_type`.

## Metrics

Accuracy, Precision, Recall, F1 score, ROC-AUC (all as percentages), training time (seconds), and a confusion matrix for each model.

## Project structure

```
.
├── lsnm_devop.py                 # Load data, split, train, evaluate, save models
├── LSNM2024_150K_ML_ready.csv    # Dataset (download separately, not tracked)
├── requirements.txt
├── .gitignore
└── README.md
```

Running the script produces `random_forest_model.pkl`, `lightgbm_model.pkl`, and `feature_columns.pkl`.

## How to run

The script was exported from Google Colab and uses `google.colab.files` to upload and download files.

### Option A: Google Colab (as written)

1. Open the notebook in Colab.
2. Upload `LSNM2024_150K_ML_ready.csv` to the session.
3. Run all cells. The three `.pkl` files download automatically at the end.

### Option B: Local machine

1. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate      # Windows: .venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Put the CSV in the project root.
4. In `lsnm_devop.py`, remove the `from google.colab import files` lines and the three `files.download(...)` calls (and replace `display(df.head())` with `print(df.head())`).
5. Run:
   ```bash
   python lsnm_devop.py
   ```

## Results

Fill in after running the script.

| Model | Accuracy (%) | Precision (%) | Recall (%) | F1 (%) | ROC-AUC (%) | Train time (s) |
|---|---|---|---|---|---|---|
| Random Forest | | | | | | |
| LightGBM | | | | | | |

For reference, the original paper reports 99.9% accuracy for decision-tree and random-forest based models on the multiclass task using the full dataset. Results here will differ because this project uses a 150K sample and a binary target.

## Using the saved models

```python
import joblib
import pandas as pd

model = joblib.load("random_forest_model.pkl")
columns = joblib.load("feature_columns.pkl")

new_data = pd.read_csv("new_traffic.csv")[columns]   # same feature order as training
predictions = model.predict(new_data)                # 0 = normal, 1 = attack
```

## Contributors

- Name 1 (Owner)
- Name 2
- Name 3

## License and citation

Code license: add your chosen license (e.g. MIT).
The dataset is provided by its original authors on Mendeley Data; please check its license and cite the paper above if you use it.
