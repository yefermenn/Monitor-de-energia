import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UsuarioMedidor } from "./UsuarioMedidor";

@Index("usuarios_correo_key", ["correo"], { unique: true })
@Index("usuarios_pkey", ["id"], { unique: true })
@Entity("usuarios", { schema: "public" })
export class Usuarios {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "nombre", length: 255 })
  nombre: string;

  @Column("character varying", { name: "correo", unique: true, length: 255 })
  correo: string;

  @Column("character varying", { name: "contraseña", length: 255 })
  contraseA: string;

  @Column("timestamp without time zone", {
    name: "fecha_creacion",
    nullable: true,
    default: () => "now()",
  })
  fechaCreacion: Date | null;

  @OneToMany(() => UsuarioMedidor, (usuarioMedidor) => usuarioMedidor.usuario)
  usuarioMedidors: UsuarioMedidor[];
}
