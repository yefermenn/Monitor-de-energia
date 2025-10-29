import { Column, Entity, Index, OneToMany } from "typeorm";
import { RegistrosMedidas } from "./RegistrosMedidas";
import { UsuarioMedidor } from "./UsuarioMedidor";

@Index("medidores_pkey", ["codigo"], { unique: true })
@Entity("medidores", { schema: "public" })
export class Medidores {
  @Column("character varying", { primary: true, name: "codigo", length: 100 })
  codigo: string;

  @Column("integer", { name: "cantidad_sensores" })
  cantidadSensores: number;

  @OneToMany(
    () => RegistrosMedidas,
    (registrosMedidas) => registrosMedidas.medidorCodigo
  )
  registrosMedidas: RegistrosMedidas[];

  @OneToMany(
    () => UsuarioMedidor,
    (usuarioMedidor) => usuarioMedidor.medidorCodigo2
  )
  usuarioMedidors: UsuarioMedidor[];
}
