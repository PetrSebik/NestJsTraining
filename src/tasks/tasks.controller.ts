import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity'
import { User } from '../auth/user.entity'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private taskService: TasksService){}

    @Get()
    @ApiResponse({status: 200, type: Task, isArray: true})
    getTasks(@Query() filterDto: GetTaskFilterDto, @GetUser() user: User): Promise<Task[]> {
        return this.taskService.getTasks(filterDto, user);
    }

    @Get('/admin')
    @ApiResponse({status: 200, type: Task, isArray: true})
    getAllTasksAsAdmin(@Query() filterDto: GetTaskFilterDto, @GetUser() user: User): Promise<Task[]> {
        return this.taskService.getAllTasksAsAdmin(filterDto, user);
    }

    @Get('/:id')
    @ApiResponse({status: 200, type: Task})
    getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
        return this.taskService.getTaskById(id, user);
    }

    @Post()
    @ApiResponse({status: 201, type: Task})
    createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
        return this.taskService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    @ApiResponse({status: 200})
    deteleTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
        return this.taskService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    @ApiResponse({status: 200, type: Task})
    updateTaskStatus(@Param('id') id: string, @Body() updateTaskStatusDto: UpdateTaskStatusDto,
                     @GetUser() user: User): Promise<Task> {
        const status = updateTaskStatusDto.status;
        return this.taskService.updateTaskStatus(id, status, user);
    }

}
