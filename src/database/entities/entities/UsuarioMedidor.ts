import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Medidores } from "./Medidores";
import { Usuarios } from "./Usuarios";

@Index("usuario_medidor_pkey", ["id"], { unique: true })
@Index(
  "usuario_medidor_usuario_id_medidor_codigo_key",
  ["medidorCodigo", "usuarioId"],
  { unique: true }
)
@Entity("usuario_medidor", { schema: "public" })
export class UsuarioMedidor {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "usuario_id", nullable: true, unique: true })
  usuarioId: number | null;

  @Column("character varying", {
    name: "medidor_codigo",
    nullable: true,
    unique: true,
    length: 100,
  })
  medidorCodigo: string | null;

  @Column("character varying", { name: "nombre_personalizado", length: 100 })
  nombrePersonalizado: string;

  @Column("timestamp without time zone", {
    name: "fecha_asignacion",
    nullable: true,
    default: () => "now()",
  })
  fechaAsignacion: Date | null;

  @ManyToOne(() => Medidores, (medidores) => medidores.usuarioMedidors, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "medidor_codigo", referencedColumnName: "codigo" }])
  medidorCodigo2: Medidores;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.usuarioMedidors, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "usuario_id", referencedColumnName: "id" }])
  usuario: Usuarios;
}
