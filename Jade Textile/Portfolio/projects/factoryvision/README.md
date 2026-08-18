# FactoryVision — Garment Workforce Vision Demonstrator

A portfolio-ready static demonstrator for a two-zone computer-vision system: facial attendance at the employee entrance, and anonymous worker-to-machine activity monitoring on the sewing floor.

## What the demo shows

- Entry-gate face matching for check-in and absence only
- CCTV views of male garment workers operating sewing machines
- Green overlays for workers actively at machines and red overlays for workers away from their stations
- Anonymous machine-station activity signals on the production floor
- Attendance and active-time records
- Privacy mode that obscures matched faces after check-in
- Human review queue for low-confidence or context-sensitive events
- Edge-first system architecture
- CSV shift-report export

All people, events, and metrics are synthetic. This is a front-end system concept, not a deployed surveillance product. A real implementation would require factory-specific model validation, worker notice and consent processes, access controls, retention policies, bias testing, and human review.

## Proposed implementation stack

Python, OpenCV, YOLO, face embeddings, multi-object tracking, FastAPI, PostgreSQL, and edge inference hardware.

## Deploy

Deploy this folder as a static Vercel project. Select **Other**, use no build command, and set the output directory to `.`.
