import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CrearAlojamientoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEnum(['HABITACION', 'CABANA'])
  tipo: 'HABITACION' | 'CABANA';

  @IsInt()
  @Min(1)
  capacidad: number;

  @IsOptional()
  @IsString()
  descripcion?: string;
}