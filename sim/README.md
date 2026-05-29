# Simulation scripts

Pure Python, stdlib only. No matplotlib, no numpy, no pandas. The point
of this directory is to keep thermal and control-loop math runnable on
any machine that has a Python interpreter, with no environment to set
up.

If a script outgrows stdlib (real DSP, optimization, plotting),
promote it to its own subdirectory under `sim/` with its own
`requirements.txt` and `README.md`.

## thermal_budget.py

Back-of-envelope thermal budget. Inputs are module-level constants at
the top of the file. Edit those, run the script, read the summary.

```bash
python sim/thermal_budget.py
```

Output:

```
peak draw (electrical):      1.00 W
avg draw at 35% duty:        0.35 W
cooling delivered (Qc):      0.70 W
hot-side dissipation (Qh):   1.70 W  (= Qc + Pin, heatsink target)
continuous-on runtime:       78.0 min
PWM-duty runtime:           222.9 min
bursts per charge (90s):       52  (energy-only; ignores PCM saturation, rest, converter loss)
discharge ceiling (1.5C):    1.95 W
peak draw within ceiling:     yes (1.00 W vs 1.95 W)
note: 2.00 W draw = 0.54 A = 1.54C, exceeds 1.5C max; not feasible on this cell
```

As of the 2026-05-29 research pass these constants are grounded in cited
sources (TEC physics, the cell datasheet, the thermal-comfort literature)
rather than guesses. The DOIs are in the script header. They are still
starting points, not bench measurements: update them as real hardware
data comes in.
