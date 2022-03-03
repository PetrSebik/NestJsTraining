import { Task } from "src/tasks/task.entity";
import internal from "stream";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
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

    @OneToMany(_type => Task, task => task.user, { eager: true })
    tasks: Task[];
}