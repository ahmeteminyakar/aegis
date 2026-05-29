# 0003. Prototype hardware vs production-target parts

* Status: Accepted
* Date: 2026-05-29
* Deciders: Ahmet Emin Yakar

## Context

`bom/components.csv` shipped with seven production-leaning placeholder
rows (an STM32L4 MCU, a BMI270 IMU, a TMP117 skin sensor, a DW01A +
FS8205A protection pair, a USB-C receptacle, a 500 mAh production cell,
and a TEC1-12706) with fabricated supplier links. That is a guess at the
finished product, not a list anyone can order to start work.

What the project actually needs first is to de-risk the two open
hypotheses from the thermal-budget entry: that a sub-watt TEC on the
inner wrist produces a felt cooling effect, and that the hot side and
the cell behave the way the napkin math predicts. None of that requires
the production parts. It requires cheap bench gear, a few wearable-scale
Peltiers, and an MCU to drive a control loop.

Two MCU boards are already on hand: an STM32F411RE Nucleo and an
ESP32-S3 devkit. Buying a production-class STM32L4 or STM32WB board now
would add cost and bring-up time the bench phase does not need, and the
production MCU choice depends on power and thermal numbers that only
Stage 2 will produce.

The physics anchors this BOM must respect live in the project memory
(`aegis-physics-anchors`): TEC ~1 W peak electrical, sub-watt class, a
~24x44 mm wearable precedent, and a 350 mAh / 1.30 Wh cell whose 1.5C
discharge ceiling is ~1.95 W, so 2 W is infeasible on the wristband
cell.

## Decision

`components.csv` becomes the Stages 0-2 prototype buy-now BOM. The seven
production candidates are removed from the CSV and preserved in this ADR
as Stage 3 target candidates, not yet bought.

Prototype MCUs, both owned, used on purpose instead of the production
target:

* **STM32F411RE Nucleo** runs the real-time control loop. A Cortex-M4F
  is enough to develop and validate the PWM drive, the ADC sampling, and
  the burst scheduling on the bench.
* **ESP32-S3 devkit** handles fast bring-up and telemetry. Its built-in
  BLE and USB make logging the bench data faster to stand up than wiring
  a separate radio to the F411.

The control-loop code is written portable: the loop math and the
scheduling logic stay off any vendor HAL, so the eventual port to the
production MCU is mechanical rather than a rewrite.

Stage definitions used in the BOM `notes` column:

* **S0** feel-test. Tape a TEC to the wrist, drive it from a
  current-limited supply, find out if the effect is real.
* **S1** instrumented bench. Measure real draw, surface temperatures,
  and hot-side behaviour against the sim.
* **S2** untethered wearable. Wearable-scale Peltier, the realistic
  cell, a wrist mount.
* **S3** production part selection. Deferred until Stage 2 validates the
  thermal approach.

Production-target MCU is STM32L4-class. The likely final pick is an
**STM32WB**: BLE and low power in one chip, and it keeps the STM32
toolchain the prototype loop was written against, so the F411 control
code ports across the family rather than to a new vendor.

### Stage 3 target candidates (not yet bought, pending Stage 2)

These were the original CSV rows. They are candidates, not selections.
Each is revisited once Stage 2 thermal data is in hand.

| Function          | Candidate            | Note                                        |
| ----------------- | -------------------- | ------------------------------------------- |
| MCU               | STM32L432KCU6 / L4   | L4-class; STM32WB the likely final pick for integrated BLE |
| IMU               | BMI270               | low-power 6-axis for the adaptive mode      |
| Skin temp         | TMP117               | high-accuracy I2C; MAX30205 is the prototype stand-in |
| Cell protection   | DW01A + FS8205A      | discrete BMS pair, or an integrated module  |
| USB-C receptacle  | USB4085-30-A         | confirm against final enclosure thickness   |
| Cell              | PL-401221 (500 mAh)  | production cell; within the anchor bracket  |
| Production TEC    | TBD                  | sized from Stage 2 data, not from the catalogue; the wearable precedent is ~24x44 mm |

## Consequences

Positive:

* The BOM is orderable today. Bench work can start without waiting on a
  production part decision.
* The two owned MCUs cost nothing, so the core kit stays cheap.
* Writing the control loop portable means the L4/WB port is a mechanical
  step, not a second project.
* Production parts get chosen against measured Stage 2 data instead of a
  guess made before the first wattmeter reading.

Negative / accepted:

* The prototype and product MCUs differ on purpose. Some control-loop
  validation has to be re-run on the production MCU, and power numbers
  measured on the F411 (an F4, not a low-power L4) do not transfer; the
  real power budget is an L4/WB measurement.
* The ESP32-S3 BLE telemetry is prototype-throwaway. STM32WB's BLE stack
  is different, so the telemetry code does not carry over.
* The 40x40 mm bench TEC is not the wearable module. Wearable-scale
  thermal results come only from the mini Peltiers at Stage 2; the bench
  TEC is for cheap, forgiving characterization.
* `components.csv` no longer holds the production candidates. When
  Stage 2 validates the thermal approach, a Stage 3 ADR selects the
  production parts and the production BOM becomes its own artifact.

## Alternatives considered

* **Prototype directly on an STM32L4 / WB devkit.** Rejected for now.
  Ahmet already owns the F411 and the ESP32-S3; buying an L4/WB board
  adds cost and bring-up time the bench phase does not need, and the
  ESP32-S3's built-in BLE stands up telemetry faster than wiring a radio
  to the F411. The production MCU is still targeted at L4/WB; this only
  defers buying one until the loop is validated.
* **Keep the production candidates in the CSV alongside the prototype
  parts.** Rejected. It mixes buy-now with maybe-later in one file,
  makes the order list ambiguous, and the future `aegis-bom-add`
  validator would treat both as orderable. The ADR is the right home for
  not-yet-bought candidates.
* **Pick the production MCU and PMIC now.** Rejected. Premature before
  Stage 2 thermal data. The cooling approach could shift the power and
  thermal envelope enough to change the MCU, the regulator, and the cell,
  so committing now risks buying the wrong part twice.
