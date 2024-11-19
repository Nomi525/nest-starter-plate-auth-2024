import {
  Body,
  Catch,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { TaskService } from "./task.service";
import { Task } from "./task.model";
import { CreateTaskDto, listResponseDto, TaskByIdDto, TaskQueryParamDto } from "./task.dto";
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { NO_ENTITY_FOUND, INTERNAL_SERVER_ERROR } from "../../app.constants";
import { PrivateGetRequest } from "../../../common/utils/annotations/controllers/private-get-request";

// swagger tags

@ApiTags("tasks apis")
@Catch()
@ApiInternalServerErrorResponse()
@ApiNotFoundResponse()
@ApiForbiddenResponse()
@ApiUnauthorizedResponse()
@Controller("tasks")
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @PrivateGetRequest("get-tasks", listResponseDto, "get all the task of")
  async findAll(
    // @Query() param: TaskQueryParamDto,
    // @Query('email', EmailValidationPipe) email: string
  ): Promise<listResponseDto[]> {
    return this.taskService.findAll();
  }

}