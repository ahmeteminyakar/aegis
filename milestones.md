# Milestones

Canonical project roadmap. The landing-page `Roadmap` section currently
hardcodes the same four entries in
`src/components/sections/Roadmap.astro`. Refactoring the component to
read from this file is a deliberate later concern; for now, edit both
when a milestone shifts.

## Q2 2026 — Concept, thermal budget, control-loop sim

Sizing the TEC. Picking the sensor stack. Drawing the H-bridge. Running
a closed-loop simulation in Python before any solder touches a board.
Output: thermal budget on paper, simulated step responses, BOM v0.

## Q3 2026 — Bench prototype on STM32 dev board

Nucleo plus breadboard. First PID tuning against a Peltier dev module.
Open-loop wattage curves. Honest writeup of what the measured COP
actually looks like versus the textbook number. Output: working
breadboard, first devlog entry with real data.

## Q4 2026 — Custom PCB and enclosure v1

KiCad layout. Fab through JLCPCB. SLA-printed wristband shell. First
wearable revision; probably ugly. Output: a thing on the wrist that
turns on and does not catch fire.

## Q1 2027 — Field testing and devlog write-up

Real wrist time on real hot days in Istanbul (or wherever the day
finds it). Failure modes documented. The build becomes a piece of
the MSc application portfolio. Output: a body of bench and field
evidence the application committee can read.
