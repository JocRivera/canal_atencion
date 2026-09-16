import {
  IsDateString,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';

export class ConsultarDisponibilidadDto {
  @IsDateString()
  fechaIngreso: string;

  @IsDateString()
  fechaSalida: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  cantidadHuespedes?: number;
}