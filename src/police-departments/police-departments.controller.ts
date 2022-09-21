import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PoliceDepartmentsService } from './police-departments.service';
import {
  CreatePoliceDepartmentDto,
  DefaultColumnsResponseDepartment,
} from './dto/create-police-department.dto';
import { UpdatePoliceDepartmentDto } from './dto/update-police-department.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Police departments')
@Controller('police-departments')
export class PoliceDepartmentsController {
  constructor(
    private readonly policeDepartmentsService: PoliceDepartmentsService,
  ) {}

  @ApiOperation({ summary: 'Create a police departments' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponseDepartment,
  })
  @Post()
  create(@Body() createPoliceDepartmentDto: CreatePoliceDepartmentDto) {
    return this.policeDepartmentsService.create(createPoliceDepartmentDto);
  }

  @ApiResponse({
    status: 200,
    isArray: true,
    type: DefaultColumnsResponseDepartment,
  })
  @Get()
  findAll() {
    return this.policeDepartmentsService.findAll();
  }

  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseDepartment,
  })
  @Get(':departmentId')
  findOne(@Param('departmentId', ParseIntPipe) departmentId: number) {
    return this.policeDepartmentsService.findOne({ departmentId });
  }

  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseDepartment,
  })
  @Put(':departmentId')
  update(
    @Param('departmentId', ParseIntPipe) departmentId: number,
    @Body() updatePoliceDepartmentDto: UpdatePoliceDepartmentDto,
  ) {
    return this.policeDepartmentsService.update({
      departmentId,
      updatePoliceDepartmentDto,
    });
  }

  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseDepartment,
  })
  @Delete(':departmentId')
  remove(@Param('departmentId', ParseIntPipe) departmentId: number) {
    return this.policeDepartmentsService.remove({ departmentId });
  }
}
