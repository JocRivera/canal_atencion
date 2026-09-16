import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ActualizarReservaDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  cantidadHuespedes?: number;

  @IsOptional()
  @IsString()
  alojamientoId?: string;

  @IsOptional()
  @IsDateString()
  fechaIngreso?: string;

  @IsOptional()
  @IsDateString()
  fechaSalida?: string;

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