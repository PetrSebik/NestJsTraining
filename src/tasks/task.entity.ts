import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { User } from "src/auth/user.entity";
import { AccessLevel } from "src/auth/users-accesslevel.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./tasks-status.enum";

@Entity()
export class Task {
    
    @ApiProperty({example: "c511d16c-fa08-4daa-b74a-de691aee1879", description: 'id of the task'})
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({example: "Clean room", description: "the title of the task"})
    @Column()
    title: string;

    @ApiProperty({example: "vacuum the floor", description: "description of the task"})
    @Column()
    description: string;

    @ApiProperty({example: "OPEN", description: "status of the task, can be one of [OPEN, IN_PROGRESS, DONE]"})
    @Column()
    status: TaskStatus;

    @ManyToOne(_type => User, user => user.tasks, { eager: false })
    @Expose({ groups: [AccessLevel.ADMIN]})
    user: User;
}