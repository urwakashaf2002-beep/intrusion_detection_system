import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FEATURES } from './feature-schema';
import { SAMPLES } from './samples';
import { PredictionService, PredictionResponse } from './prediction.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly fields = FEATURES;
  readonly deployedStatic = !['localhost', '127.0.0.1'].includes(window.location.hostname);

  values: Record<string, number | null> = {};
  loading = signal(false);
  error = signal('');
  result = signal<PredictionResponse | null>(null);

  private api = inject(PredictionService);

  constructor() {
    this.clear();
  }

  clear() {
    for (const field of this.fields) this.values[field.name] = null;
    this.error.set('');
    this.result.set(null);
  }

  fillSample(kind: 'benign' | 'attack') {
    this.clear();
    const sample = SAMPLES[kind];
    for (const field of this.fields) this.values[field.name] = sample[field.name];
  }

  pct(p: number): string {
    return (p * 100).toFixed(2) + ' %';
  }

  submit() {
    this.error.set('');
    this.result.set(null);

    if (this.deployedStatic) {
      this.error.set('Static GitHub Pages demo: start Flask + Angular locally for predictions.');
      return;
    }

    const payload: Record<string, number> = {};
    for (const field of this.fields) {
      const value = this.values[field.name];
      if (value === null || value === undefined || (value as unknown) === '') {
        this.error.set(`Enter a value for ${field.label}`);
        return;
      }
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) {
        this.error.set(`Invalid number for ${field.label}`);
        return;
      }
      if ((field.min !== undefined && numeric < field.min) ||
          (field.max !== undefined && numeric > field.max)) {
        this.error.set(`Out-of-range value for ${field.label}`);
        return;
      }
      payload[field.name] = numeric;
    }

    this.loading.set(true);
    this.api.predict(payload).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(
          `API error ${err.status || ''}: ` +
          (err.error?.error || err.message || 'Check the Flask terminal'));
        this.loading.set(false);
      },
    });
  }
}
