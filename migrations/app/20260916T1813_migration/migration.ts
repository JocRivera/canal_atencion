#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/79a1ae55eda94ffcfb5e0c141ab25855d779a32fd8ce23ea6aa835cc4e3d5c19/contract';
import endContract from '../../snapshots/79a1ae55eda94ffcfb5e0c141ab25855d779a32fd8ce23ea6aa835cc4e3d5c19/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/8542b29d0acf1673b6ad74e3d012d7ad4c658d480cce2ee1b7fe9afa28ce4db1/contract';
import startContract from '../../snapshots/8542b29d0acf1673b6ad74e3d012d7ad4c658d480cce2ee1b7fe9afa28ce4db1/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'plan',
        column: col('incluyeAlojamiento', 'bool', {
          notNull: true,
          default: lit(false),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'reserva',
        column: col('cantidadHuespedes', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-reserva-cantidadHuespedes', {
        check: () => placeholder('backfill-reserva-cantidadHuespedes:check'),
        run: () => placeholder('backfill-reserva-cantidadHuespedes:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'reserva', column: 'cantidadHuespedes' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
