import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UnidadesMedidaDTO {

    @IsString()
    descripcion: string;

    @IsBoolean()
    @IsOptional()
    activo: boolean;

}