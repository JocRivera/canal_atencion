import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class AgregarServicioReservaDto {
  @IsString()
  @IsNotEmpty()
  servicioId: string;

  @IsInt()
  @Min(1)
  cantidad: number;
}