"""Thermal budget for the Aegis Peltier wristband.

A back-of-envelope estimate of how long the device can deliver useful
cooling bursts on a wristband-sized LiPo, the hot-side heat the heatsink
has to shed, and whether the cell can even source the peak draw. Pure
stdlib.

Constants were grounded in the 2026-05-29 research pass (Sources below).
They are starting points for the control-loop and BOM work, not bench
measurements. Update as real hardware data arrives.

Run: python sim/thermal_budget.py

Sources
  TEC peak electrical draw (~1 W, 0.30 A on a 24x44 mm wearable TEC):
    Materials 2025, 10.3390/ma18071576
  Skin-contact dT (~2.5 C, sustained ~10 min) and the hot-side / PCM
    buffer saturating near 605 s:
    Materials 2025, 10.3390/ma18071576 + companion sim 10.3390/ma17133266
  COP 0.3-0.7 single-stage, rising to 1-2 only at very small dT below Imax:
    Meerstetter and Sheetak TEC design guides
  Hot-side identity Qh = Qc + Pin. The "up to ~2.6x Qmax" figure is a
    separate datasheet point (Qh vs a module's rated Qmax near Imax), not
    this 1.7 W operating point:
    Meerstetter TEC design guide
  Cell 350 mAh / 1.30 Wh at 3.7 V, 1.5C max continuous discharge:
    PKCELL LP552530 datasheet (bracket: EEMB LP502030 250 mAh / 0.93 Wh,
    PKCELL LP503035 500 mAh / 1.85 Wh)
"""

# Inputs. Tune as bench data arrives.
TEC_MAX_POWER_W = 1.0        # peak ELECTRICAL draw (Pin), not heat pumped.
                             # ~1 W at 0.30 A on a 24x44 mm wearable TEC.
COP_TYPICAL = 0.7            # cooling COP = Qc / Pin. Conservative single
                             # stage; rises to 1-2 only at very small dT.
LIPO_CAPACITY_WH = 1.30      # 350 mAh x 3.7 V (PKCELL LP552530). Bracket:
                             # 0.93 Wh (250 mAh) to 1.85 Wh (500 mAh).
DUTY_CYCLE = 0.35            # average PWM duty in typical use.
BURST_DURATION_S = 90        # default burst length. The hot-side / PCM
                             # buffer saturates near 605 s, so a burst plus
                             # its rest window must stay well under that.
CELL_VOLTAGE_V = 3.7         # nominal LiPo cell voltage.
MAX_C_RATE = 1.5             # max continuous discharge for a small pouch cell.


def main() -> None:
    avg_w = TEC_MAX_POWER_W * DUTY_CYCLE
    cooling_w = TEC_MAX_POWER_W * COP_TYPICAL            # Qc = COP * Pin
    hot_side_w = TEC_MAX_POWER_W * (1 + COP_TYPICAL)     # Qh = Qc + Pin
    cont_runtime_min = (LIPO_CAPACITY_WH / TEC_MAX_POWER_W) * 60
    pwm_runtime_min = (LIPO_CAPACITY_WH / avg_w) * 60
    energy_per_burst_wh = (TEC_MAX_POWER_W * BURST_DURATION_S) / 3600
    bursts_per_charge = LIPO_CAPACITY_WH / energy_per_burst_wh

    # Can the cell even source the peak draw? Small pouch cells are rate
    # limited before they are capacity limited.
    capacity_ah = LIPO_CAPACITY_WH / CELL_VOLTAGE_V
    max_cont_power_w = capacity_ah * MAX_C_RATE * CELL_VOLTAGE_V
    rate_ok = TEC_MAX_POWER_W <= max_cont_power_w
    two_w_amps = 2.0 / CELL_VOLTAGE_V
    two_w_c_rate = two_w_amps / capacity_ah

    duty_label = f"avg draw at {int(DUTY_CYCLE * 100)}% duty:"
    burst_label = f"bursts per charge ({BURST_DURATION_S}s):"

    print(f"{'peak draw (electrical):':<27}{TEC_MAX_POWER_W:6.2f} W")
    print(f"{duty_label:<27}{avg_w:6.2f} W")
    print(f"{'cooling delivered (Qc):':<27}{cooling_w:6.2f} W")
    print(f"{'hot-side dissipation (Qh):':<27}{hot_side_w:6.2f} W  (= Qc + Pin, heatsink target)")
    print(f"{'continuous-on runtime:':<27}{cont_runtime_min:6.1f} min")
    print(f"{'PWM-duty runtime:':<27}{pwm_runtime_min:6.1f} min")
    print(f"{burst_label:<27}{bursts_per_charge:6.0f}  (energy-only; ignores PCM saturation, rest, converter loss)")
    print(f"{'discharge ceiling (1.5C):':<27}{max_cont_power_w:6.2f} W")
    print(f"{'peak draw within ceiling:':<27}{('yes' if rate_ok else 'no'):>6} ({TEC_MAX_POWER_W:.2f} W vs {max_cont_power_w:.2f} W)")
    print(f"note: 2.00 W draw = {two_w_amps:.2f} A = {two_w_c_rate:.2f}C, exceeds {MAX_C_RATE:.1f}C max; not feasible on this cell")


if __name__ == "__main__":
    main()
