import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PoliceDepartmentsService } from './police-departments.service';
import {
  CreatePoliceDepartmentDto,
  DefaultColumnsResponseDepartment,
} from './dto/create-police-department.dto';
import { UpdatePoliceDepartmentDto } from './dto/update-police-department.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from './../auth-police-officer/decorators/roles.decorator';
import { JwtAuthPoliceGuard } from './../auth-police-officer/guards/jwt-auth-police.guards';
import { RolesGuard } from './../auth-police-officer/guards/roles.guard';
import { Role } from './../utils/enum/role.enum';

@Roles(Role.DIRECTOR)
@UseGuards(JwtAuthPoliceGuard, RolesGuard)
@ApiTags('Police departments')
@Controller('police-departments')
export class PoliceDepartmentsController {
  constructor(
    private readonly policeDepartmentsService: PoliceDepartmentsService,
  ) {}

  @Roles(Role.DIRECTOR)
  @ApiOperation({ summary: 'Create a police departments' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponseDepartment,
  })
  @Post()
  create(@Body() createPoliceDepartmentDto: CreatePoliceDepartmentDto) {
    return this.policeDepartmentsService.create(createPoliceDepartmentDto);
  }

  @Roles(Role.DIRECTOR)
  @ApiResponse({
    status: 200,
    isArray: true,
    type: DefaultColumnsResponseDepartment,
  })
  @Get()
  findAll() {
    return this.policeDepartmentsService.findAll();
  }

  @Roles(Role.DIRECTOR)
  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseDepartment,
  })
  @Get(':departmentId')
  findOne(@Param('departmentId', ParseIntPipe) departmentId: number) {
    return this.policeDepartmentsService.findOne({ departmentId });
  }

  @Roles(Role.DIRECTOR)
  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseDepartment,
  })
  @Roles(Role.DIRECTOR)
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

  @Roles(Role.DIRECTOR)
  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseDepartment,
  })
  @Delete(':departmentId')
  remove(@Param('departmentId', ParseIntPipe) departmentId: number) {
    return this.policeDepartmentsService.remove({ departmentId });
  }
}
