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
the top of the file. Edit those, run the script, read the six-line
summary.

```bash
python sim/thermal_budget.py
```

Output:

```
peak draw:                   4.50 W
avg draw at  35% duty:       1.57 W
continuous-on runtime:       24.7 min
PWM-duty runtime:            70.5 min
bursts per charge (90s):      16
hot-side dissipation:        8.25 W (heatsink target)
```

Every number is a placeholder. Update the constants in the script as
bench measurements come in.
