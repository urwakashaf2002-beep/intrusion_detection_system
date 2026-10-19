"""Train the Random Forest (same settings as your Colab notebook) and save a
deployable bundle: backend/models/model_bundle.joblib

Run from the project root:   python backend\train_model.py
"""
from pathlib import Path
import json
import time

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (accuracy_score, f1_score, precision_score,
                             recall_score, roc_auc_score)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

ROOT = Path(__file__).resolve().parent.parent
CSV = ROOT / "data" / "LSNM2024_150K_ML_ready.csv"
BUNDLE = ROOT / "backend" / "models" / "model_bundle.joblib"

df = pd.read_csv(CSV)
print("Dataset shape:", df.shape)

# Same inputs/target/split as your notebook
X = df.drop(columns=["attack_type", "label"])
y = df["label"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=df["attack_type"]
)

pipeline = Pipeline([
    ("model", RandomForestClassifier(n_estimators=200, n_jobs=-1, random_state=42)),
])

start = time.time()
pipeline.fit(X_train, y_train)
print(f"Trained in {time.time() - start:.1f} s")

pred = pipeline.predict(X_test)
prob = pipeline.predict_proba(X_test)[:, 1]
metrics = {
    "accuracy": round(accuracy_score(y_test, pred) * 100, 2),
    "precision": round(precision_score(y_test, pred) * 100, 2),
    "recall": round(recall_score(y_test, pred) * 100, 2),
    "f1": round(f1_score(y_test, pred) * 100, 2),
    "roc_auc": round(roc_auc_score(y_test, prob) * 100, 2),
}
print("Test metrics (%):", metrics)

bundle = {
    "pipeline": pipeline,
    "features": list(X.columns),          # exact training input order
    "task": "classification",
    "class_names": ["Benign", "Attack"],  # label 0 / label 1
    "model_version": "1.0",
}
BUNDLE.parent.mkdir(parents=True, exist_ok=True)
joblib.dump(bundle, BUNDLE, compress=3)
print("Saved:", BUNDLE, f"({BUNDLE.stat().st_size / 1e6:.1f} MB)")

# Sample inputs: one correctly-classified Benign row + one Attack row (no target columns)
ok = pd.Series(pred == y_test.values, index=X_test.index)
benign_idx = y_test[(y_test == 0) & ok].index[0]
attack_idx = y_test[(y_test == 1) & ok].index[0]
sample = X_test.loc[[benign_idx, attack_idx]]
(ROOT / "data").mkdir(exist_ok=True)
sample.to_csv(ROOT / "data" / "sample_inputs.csv", index=False)
print("Saved data/sample_inputs.csv (row 1 = Benign, row 2 = Attack)")

(ROOT / "docs").mkdir(exist_ok=True)
(ROOT / "docs" / "model_metrics.json").write_text(json.dumps(metrics, indent=2))
