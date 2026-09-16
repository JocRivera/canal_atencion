#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/8542b29d0acf1673b6ad74e3d012d7ad4c658d480cce2ee1b7fe9afa28ce4db1/contract';
import endContract from '../../snapshots/8542b29d0acf1673b6ad74e3d012d7ad4c658d480cce2ee1b7fe9afa28ce4db1/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'acompanante',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('personaId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('reservaId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('tipoHuesped', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'acompanante_tipoHuesped_check_868d10e0',
            "\"tipoHuesped\" IN ('ADULTO', 'NINO', 'BEBE')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'alojamiento',
        columns: [
          col('capacidad', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('descripcion', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('estado', 'text', {
            notNull: true,
            default: lit('OPERATIVO'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('nombre', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('tipo', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'alojamiento_estado_check_d2557066',
            "\"estado\" IN ('OPERATIVO', 'MANTENIMIENTO', 'FUERA_SERVICIO')",
          ),
          checkExpression(
            'alojamiento_tipo_check_f0bfe4af',
            "\"tipo\" IN ('HABITACION', 'CABANA')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'persona',
        columns: [
          col('contacto', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('documento', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('email', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('eps', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('fechaNacimiento', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('nombre', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('tipoDocumento', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'persona_tipoDocumento_check_0a53733e',
            "\"tipoDocumento\" IN ('CC', 'CE', 'TI', 'PASAPORTE')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'plan',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('descripcion', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('nombre', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('precio', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('soloParejas', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'planServicio',
        columns: [
          col('planId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('servicioId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['planId', 'servicioId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'programacionPlan',
        columns: [
          col('activo', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('fechaFin', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('fechaInicio', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('observaciones', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('planId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'reserva',
        columns: [
          col('alojamientoId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('estado', 'text', {
            notNull: true,
            default: lit('PENDIENTE_PAGO'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('fechaIngreso', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('fechaSalida', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('observaciones', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('planId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('precioPlan', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('titularId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('total', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'reserva_estado_check_dca8981a',
            "\"estado\" IN ('PENDIENTE_PAGO', 'CONFIRMADA', 'CANCELADA')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'reservaServicio',
        columns: [
          col('cantidad', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('precio', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('reservaId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('servicioId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['reservaId', 'servicioId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'servicio',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('descripcion', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('nombre', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('precio', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('soloRomantico', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'acompanante',
        constraint: 'acompanante_reservaId_personaId_key',
        columns: ['reservaId', 'personaId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'persona',
        constraint: 'persona_documento_key',
        columns: ['documento'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'plan',
        constraint: 'plan_nombre_key',
        columns: ['nombre'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'servicio',
        constraint: 'servicio_nombre_key',
        columns: ['nombre'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'acompanante',
        index: 'acompanante_personaId_idx_758ca1fb',
        columns: ['personaId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'acompanante',
        index: 'acompanante_reservaId_idx_178ec2fd',
        columns: ['reservaId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'planServicio',
        index: 'planServicio_planId_idx_5b32079a',
        columns: ['planId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'planServicio',
        index: 'planServicio_servicioId_idx_70be2758',
        columns: ['servicioId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'programacionPlan',
        index: 'programacionPlan_fechaInicio_fechaFin_idx_0bdb592c',
        columns: ['fechaInicio', 'fechaFin'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'programacionPlan',
        index: 'programacionPlan_planId_idx_5b32079a',
        columns: ['planId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'reserva',
        index: 'reserva_alojamientoId_idx_662b074b',
        columns: ['alojamientoId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'reserva',
        index: 'reserva_planId_idx_5b32079a',
        columns: ['planId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'reserva',
        index: 'reserva_titularId_idx_8aeff669',
        columns: ['titularId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'reservaServicio',
        index: 'reservaServicio_reservaId_idx_178ec2fd',
        columns: ['reservaId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'reservaServicio',
        index: 'reservaServicio_servicioId_idx_70be2758',
        columns: ['servicioId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'acompanante',
        foreignKey: {
          name: 'acompanante_reservaId_fkey',
          columns: ['reservaId'],
          references: { schema: 'public', table: 'reserva', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'acompanante',
        foreignKey: {
          name: 'acompanante_personaId_fkey',
          columns: ['personaId'],
          references: { schema: 'public', table: 'persona', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'planServicio',
        foreignKey: {
          name: 'planServicio_planId_fkey',
          columns: ['planId'],
          references: { schema: 'public', table: 'plan', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'planServicio',
        foreignKey: {
          name: 'planServicio_servicioId_fkey',
          columns: ['servicioId'],
          references: { schema: 'public', table: 'servicio', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'programacionPlan',
        foreignKey: {
          name: 'programacionPlan_planId_fkey',
          columns: ['planId'],
          references: { schema: 'public', table: 'plan', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'reserva',
        foreignKey: {
          name: 'reserva_titularId_fkey',
          columns: ['titularId'],
          references: { schema: 'public', table: 'persona', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'reserva',
        foreignKey: {
          name: 'reserva_planId_fkey',
          columns: ['planId'],
          references: { schema: 'public', table: 'plan', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'reserva',
        foreignKey: {
          name: 'reserva_alojamientoId_fkey',
          columns: ['alojamientoId'],
          references: { schema: 'public', table: 'alojamiento', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'reservaServicio',
        foreignKey: {
          name: 'reservaServicio_reservaId_fkey',
          columns: ['reservaId'],
          references: { schema: 'public', table: 'reserva', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'reservaServicio',
        foreignKey: {
          name: 'reservaServicio_servicioId_fkey',
          columns: ['servicioId'],
          references: { schema: 'public', table: 'servicio', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
