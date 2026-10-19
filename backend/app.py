"""Flask REST API for the LSNM network-traffic attack detector.

GET  /health   -> status + number of features
POST /predict  -> JSON with all 44 features -> prediction (0 Benign / 1 Attack)
"""
from pathlib import Path
import math

import joblib
import pandas as pd
from flask import Flask, jsonify, request

MODEL_PATH = Path(__file__).resolve().parent / "models" / "model_bundle.joblib"
if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"{MODEL_PATH} not found. Run:  python backend\\train_model.py"
    )

BUNDLE = joblib.load(MODEL_PATH)  # trusted artifact created by train_model.py
MODEL = BUNDLE["pipeline"]
FEATURES = BUNDLE["features"]
TASK = BUNDLE["task"]
CLASS_NAMES = BUNDLE.get("class_names", [])

app = Flask(__name__)


@app.get("/health")
def health():
    return jsonify(status="ok", features=len(FEATURES), task=TASK,
                   model_version=BUNDLE.get("model_version"))


@app.post("/predict")
def predict():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error="Request body must be a JSON object"), 400

    missing = [f for f in FEATURES if f not in data]
    extra = [k for k in data if k not in FEATURES]
    if missing or extra:
        return jsonify(error="Feature mismatch", missing=missing, extra=extra), 400

    values = []
    for f in FEATURES:
        v = data[f]
        if isinstance(v, bool) or not isinstance(v, (int, float)) or not math.isfinite(v):
            return jsonify(error="Invalid input", detail=f"'{f}' must be a finite number"), 400
        values.append(float(v))

    frame = pd.DataFrame([values], columns=FEATURES)
    try:
        prediction = MODEL.predict(frame)[0]
        prediction = prediction.item() if hasattr(prediction, "item") else prediction
        result = {
            "prediction": prediction,
            "task": TASK,
            "disclaimer": "Research/teaching prototype only.",
        }
        if CLASS_NAMES:
            result["prediction_label"] = CLASS_NAMES[int(prediction)]
            result["class_names"] = CLASS_NAMES
        if TASK == "classification" and hasattr(MODEL, "predict_proba"):
            result["probabilities"] = MODEL.predict_proba(frame)[0].tolist()
        return jsonify(result)
    except (ValueError, TypeError) as exc:
        return jsonify(error="Invalid input", detail=str(exc)), 400
    except Exception:
        app.logger.exception("Prediction failed")
        return jsonify(error="Prediction processing failed"), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
