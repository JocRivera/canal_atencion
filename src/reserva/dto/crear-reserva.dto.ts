import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CrearReservaDto {
  @IsString()
  titularId: string;

  @IsString()
  planId: string;

  @IsOptional()
  @IsString()
  alojamientoId?: string;

  @IsDateString()
  fechaIngreso: string;

  @IsDateString()
  fechaSalida: string;

  @IsOptional()
  @IsEnum(['PENDIENTE_PAGO', 'CONFIRMADA', 'CANCELADA'])
  estado?: 'PENDIENTE_PAGO' | 'CONFIRMADA' | 'CANCELADA';

  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}