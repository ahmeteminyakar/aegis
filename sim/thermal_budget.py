"""Thermal budget for the Aegis Peltier wristband.

A back-of-envelope estimate of how long the device can deliver useful
cooling bursts on a wristband-sized LiPo, plus the hot-side dissipation
the heatsink design has to handle. All inputs are placeholders pending
bench measurement. Pure stdlib.

Run: python sim/thermal_budget.py
"""

# Inputs. Tune as bench data arrives.
TEC_MAX_POWER_W = 4.5         # peak TEC draw at full duty cycle
LIPO_CAPACITY_WH = 1.85       # 500 mAh x 3.7 V nominal
DUTY_CYCLE = 0.35             # average PWM duty in typical use
BURST_DURATION_S = 90         # default burst length
COP_TYPICAL = 1.2             # coefficient of performance, single-stage TEC


def main() -> None:
    avg_w = TEC_MAX_POWER_W * DUTY_CYCLE
    cont_runtime_min = (LIPO_CAPACITY_WH / TEC_MAX_POWER_W) * 60
    pwm_runtime_min = (LIPO_CAPACITY_WH / avg_w) * 60
    energy_per_burst_wh = (TEC_MAX_POWER_W * BURST_DURATION_S) / 3600
    bursts_per_charge = LIPO_CAPACITY_WH / energy_per_burst_wh
    hot_side_w = TEC_MAX_POWER_W * (1 + 1 / COP_TYPICAL)

    print(f"peak draw:                 {TEC_MAX_POWER_W:6.2f} W")
    print(f"avg draw at {int(DUTY_CYCLE*100):>3d}% duty:     {avg_w:6.2f} W")
    print(f"continuous-on runtime:     {cont_runtime_min:6.1f} min")
    print(f"PWM-duty runtime:          {pwm_runtime_min:6.1f} min")
    print(f"bursts per charge ({BURST_DURATION_S}s):  {bursts_per_charge:6.0f}")
    print(f"hot-side dissipation:      {hot_side_w:6.2f} W (heatsink target)")


if __name__ == "__main__":
    main()
