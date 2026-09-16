import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ActualizarAlojamientoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre?: string;

  @IsOptional()
  @IsEnum(['HABITACION', 'CABANA'])
  tipo?: 'HABITACION' | 'CABANA';

  @IsOptional()
  @IsInt()
  @Min(1)
  capacidad?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsEnum([
    'OPERATIVO',
    'MANTENIMIENTO',
    'FUERA_SERVICIO',
  ])
  estado?:
    | 'OPERATIVO'
    | 'MANTENIMIENTO'
    | 'FUERA_SERVICIO';
}