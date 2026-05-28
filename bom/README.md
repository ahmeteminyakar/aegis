# BOM

Hand-edited bill of materials for the Aegis wristband. Single source of
truth: `components.csv`.

## Format

CSV with this header, in order:

```
ref,description,qty,part_no,supplier,unit_cost_usd,link,notes
```

| Column          | Description                                          |
| --------------- | ---------------------------------------------------- |
| `ref`           | Schematic reference designator (TEC1, U1, BT1, ...). Unique. |
| `description`   | Short part description, no marketing language.       |
| `qty`           | Integer quantity per unit.                           |
| `part_no`       | Manufacturer part number.                            |
| `supplier`      | Where the line item was sourced for the placeholder estimate. Update when ordering real stock. |
| `unit_cost_usd` | Unit price in USD as decimal. Placeholder until quoted. |
| `link`          | Supplier product page URL.                           |
| `notes`         | Free-text. Mark `placeholder` until verified against a real datasheet and a real order. |

## Adding a row

Open `components.csv` in a spreadsheet or text editor, append a row,
keep the ref unique. Note any tradeoff considerations in the `notes`
column.

A more structured BOM workflow (an `aegis-bom-add` Claude skill that
validates header alignment and warns on collisions) lands in v0.2.
For now, edit by hand.

## What this file is not

* Not a CAD-coupled netlist. The schematic and PCB live in a separate
  KiCad project once they exist; this file is the human-readable
  parts list for sourcing and cost estimation.
* Not a production BOM. Until real parts are ordered, every row is a
  candidate.
