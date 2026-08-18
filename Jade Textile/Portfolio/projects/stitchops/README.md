# StitchOps — Garment Factory Workforce Analytics

A portfolio-ready analytics dashboard exploring how labor hours affect production output, efficiency, overtime, and garment quality.

## Business questions

- Which production lines generate the most units per paid hour?
- Are overtime hours associated with a higher defect rate?
- Which shifts and weekdays underperform?
- Is the factory meeting its production plan while protecting quality?

## Metrics

| Metric | Definition |
|---|---|
| Labor productivity | Good units / paid labor hours |
| Workforce efficiency | Standard earned hours / paid hours |
| Defect rate | Rejected units / total produced units |
| Target attainment | Actual output / planned output |

## Run locally

No build step or dependencies are required. Open `index.html` in a browser, or start any static file server in this folder.

For example, with VS Code use **Live Server**, or with Python:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Dataset note

The dashboard generates a deterministic synthetic dataset for January–June 2026 across four departments and five production lines. Use **Export data** in the sidebar to download the currently filtered records as CSV. No real company or employee data is included.

## Portfolio framing

Suggested project title: **Optimizing Labor Productivity in Garment Manufacturing**

Tell the story in three parts: diagnose the least productive line, quantify the overtime-quality relationship, and recommend workload balancing plus targeted shift reviews. Avoid claiming causation from correlation alone.
