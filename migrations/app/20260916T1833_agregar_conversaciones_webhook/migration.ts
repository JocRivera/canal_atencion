#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/79a1ae55eda94ffcfb5e0c141ab25855d779a32fd8ce23ea6aa835cc4e3d5c19/contract';
import startContract from '../../snapshots/79a1ae55eda94ffcfb5e0c141ab25855d779a32fd8ce23ea6aa835cc4e3d5c19/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/9f1db085b884a6d4871eac86665170e4a27cbb1fae8429eb4488c985a5ca2fc0/contract';
import endContract from '../../snapshots/9f1db085b884a6d4871eac86665170e4a27cbb1fae8429eb4488c985a5ca2fc0/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'conversacion',
        columns: [
          col('canal', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('contexto', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('estado', 'text', {
            notNull: true,
            default: lit('INICIO'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('identificadorExterno', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('ultimoMensajeId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'conversacion',
        constraint: 'conversacion_canal_identificadorExterno_key',
        columns: ['canal', 'identificadorExterno'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
