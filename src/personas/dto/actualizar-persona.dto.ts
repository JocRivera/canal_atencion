import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class ActualizarPersonaDto {
  @IsOptional()
  @IsEnum(['CC', 'CE', 'TI', 'PASAPORTE'])
  tipoDocumento?: 'CC' | 'CE' | 'TI' | 'PASAPORTE';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  documento?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  nombre?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fechaNacimiento?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  contacto?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  eps?: string;
}