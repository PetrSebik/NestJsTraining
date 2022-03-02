import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity'
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksRepository)
        private taskRepository: TasksRepository
    ) {}


    getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto);
    }

    async getTaskById(id: string): Promise<Task> {
        const task = await this.taskRepository.findOne(id)
        if (!task) {
            throw new NotFoundException();
        } 
        return task;
    }

    createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto)
    }

    async deleteTask(id: string): Promise<void> {
        const result = await this.taskRepository.delete(id);
        
        if(result.affected === 0) {
            throw new NotFoundException(`Task with id ${id} not found`)
        }

    }


    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await this.taskRepository.save(task);
        return task;
    }
}
