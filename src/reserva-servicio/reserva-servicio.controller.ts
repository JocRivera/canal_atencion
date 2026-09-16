import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';

import { AgregarServicioReservaDto } from './dto/agregar-servicio-reserva.dto.js';
import { ActualizarServicioReservaDto } from './dto/actualizar-servicio-reserva.dto.js';
import { ReservaServicioService } from './reserva-servicio.service.js';

@Controller('reservas/:reservaId/servicios')
export class ReservaServicioController {
	constructor(
		private readonly reservaServicioService: ReservaServicioService,
	) {}

	@Get()
	obtenerServicios(@Param('reservaId') reservaId: string) {
		return this.reservaServicioService.obtenerServiciosDeReserva(
			reservaId,
		);
	}

	@Post()
	agregarServicio(
		@Param('reservaId') reservaId: string,
		@Body() data: AgregarServicioReservaDto,
	) {
		return this.reservaServicioService.agregarServicioAReserva(
			reservaId,
			data.servicioId,
			data.cantidad,
		);
	}

	@Patch(':servicioId')
	actualizarCantidad(
		@Param('reservaId') reservaId: string,
		@Param('servicioId') servicioId: string,
		@Body() data: ActualizarServicioReservaDto,
	) {
		return this.reservaServicioService.actualizarCantidadDeServicioEnReserva(
			reservaId,
			servicioId,
			data.cantidad,
		);
	}
}
