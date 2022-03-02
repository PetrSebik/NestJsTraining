import internal from "stream";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { AccessLevel } from "./users-accesslevel.enum";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: BigInteger;

    @Column({ unique: true})
    email: string;
    
    @Column()
    password: string;

    @Column()
    accessLevel: AccessLevel;
}