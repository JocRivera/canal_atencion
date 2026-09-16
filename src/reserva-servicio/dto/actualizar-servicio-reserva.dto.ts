import {
  IsInt,
  Min,
} from 'class-validator';

export class ActualizarServicioReservaDto {
  @IsInt()
  @Min(1)
  cantidad: number;
}