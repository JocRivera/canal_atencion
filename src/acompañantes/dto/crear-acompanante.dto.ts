import { IsNotEmpty, IsString } from 'class-validator';

export class CrearAcompananteDto {
  @IsString()
  @IsNotEmpty()
  personaId: string;

  @IsString()
  @IsNotEmpty()
  reservaId: string;
}