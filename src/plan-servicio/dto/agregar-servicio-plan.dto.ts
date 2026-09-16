import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class AgregarServicioPlanDto {
  @IsString()
  @IsNotEmpty()
  servicioId: string;
}