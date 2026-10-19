# LSNM Network Attack Detector (ML -> Flask -> Angular -> GitHub CI/CD)

Teaching prototype. A Random Forest trained on the LSNM2024 150K packet dataset
(44 numeric features, label 0 = Benign, 1 = Attack) is served by a local Flask API
and used by an Angular form. GitHub Actions tests the code and publishes the static
Angular page to GitHub Pages.

**Important:** GitHub Pages hosts only the static Angular page. Flask and the model
run on your own PC, so live predictions work only locally.

## Versions
Python 3.12, Node.js LTS (24), Angular CLI (latest), Git.

## Run locally (project root = this folder)
Terminal 1 (Flask):
    .\.venv\Scripts\Activate.ps1
    python backend\app.py

Terminal 2 (Angular):
    cd frontend
    ng serve --open --proxy-config proxy.conf.json

Open http://localhost:4200

## Tests
    python -m pytest -q backend\tests

## Model
- Training script: backend/train_model.py (Random Forest, 200 trees, 80/20 stratified split)
- Features: see backend/models/model_bundle.joblib ("features") and frontend/src/app/feature-schema.ts
- Test metrics: docs/model_metrics.json

## Links
- GitHub repo: (add URL)
- GitHub Pages: (add URL)

## Disclaimer
Research/teaching prototype only. Not a production intrusion-detection system.
