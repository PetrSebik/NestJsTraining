import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { AccessLevel } from 'src/auth/users-accesslevel.enum';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksRepository)
        private taskRepository: TasksRepository,
    ) {}


    getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const task = await this.taskRepository.findOne({ id, user });
        if (!task) {
            throw new NotFoundException();
        } 
        return task;
    }

    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTask(id: string, user: User): Promise<void> {
        const result = await this.taskRepository.delete({ id, user });
        
        if(result.affected === 0) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }

    }


    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await this.taskRepository.save(task);
        return task;
    }

    getAllTasksAsAdmin(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        if (user.accessLevel != AccessLevel.ADMIN) {
            throw new ForbiddenException('you are not allowed to access this resource');
        }
        const tasks = this.taskRepository.getTasks(filterDto, user);
        return tasks
    }
}
