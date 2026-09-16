import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PersonasService } from './personas.service.js';
import { CrearPersonaDto } from './dto/crear-persona.dto.js';

@Controller('personas')
export class PersonasController {
  constructor(private readonly personasService: PersonasService) {}

  @Get()
  obtenerPersonas() {
    return this.personasService.obtenerPersonas();
  }

  @Get(':id')
  obtenerPersonaPorId(@Param('id') id: string) {
    return this.personasService.obtenerPersonaPorId(id);
  }

  @Get('documento/:documento')
  obtenerPersonaPorDocumento(@Param('documento') documento: string) {
    return this.personasService.obtenerPersonaPorDocumento(documento);
  }

  @Post()
  crearPersona(@Body() data: CrearPersonaDto) {
    return this.personasService.crearPersona(data);
  }

  @Patch(':id')
  actualizarPersona(@Param('id') id: string, @Body() data: CrearPersonaDto) {
    return this.personasService.actualizarPersona(id, data);
  }
}
