import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Medidores } from "./Medidores";

@Index("registros_medidas_pkey", ["id"], { unique: true })
@Entity("registros_medidas", { schema: "public" })
export class RegistrosMedidas {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("integer", { name: "numero_sensor" })
  numeroSensor: number;

  @Column("numeric", { name: "valor_watios", precision: 10, scale: 3 })
  valorWatios: number;

  @Column("timestamp without time zone", {
    name: "timestamp",
    nullable: true,
    default: () => "now()",
  })
  timestamp: Date | null;

  @ManyToOne(() => Medidores, (medidores) => medidores.registrosMedidas, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "medidor_codigo", referencedColumnName: "codigo" }])
  medidorCodigo: Medidores;
}
