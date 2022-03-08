import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../tasks-status.enum";

export class GetTaskFilterDto {

    @IsOptional()
    @IsEnum(TaskStatus)
    @ApiProperty({required: false})
    status?: TaskStatus;

    @IsOptional()
    @IsString()
    @ApiProperty({required: false})
    search?: string;
}