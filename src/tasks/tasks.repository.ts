import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTaskFilterDto } from "./dto/get-task-filter.dto";
import { Task } from './task.entity'
import { User } from '../auth/user.entity'
import { TaskStatus } from "./tasks-status.enum";
import { AccessLevel } from "src/auth/users-accesslevel.enum";


@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {

    async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');

        if (user.accessLevel != AccessLevel.ADMIN) {
            query.where({ user });
        }

        if (status) {
            query.andWhere('task.status = :status', {status});
        }

        if (search) {
            query.andWhere(
                '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                { search: `%${search}%` }
            );
        }

        const tasks = await query.getMany();        
        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user: user,
        });

        await this.save(task);
        return task;
    }

}