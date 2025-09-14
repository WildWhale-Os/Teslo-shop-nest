import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { Product } from './entities';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  @ApiCreatedResponse({
    description: 'Product created succesfully',
    type: Product,
  })
  @ApiForbiddenResponse({ description: 'Authorize user' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiBearerAuth()
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiOkResponse({
    description: 'Products obtaines succesfully',
    type: [Product],
  })
  @ApiBadRequestResponse({ description: 'Needs limit  query param' })
  @ApiInternalServerErrorResponse({ description: 'something went bad' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOkResponse({ description: 'Product with term found', type: Product })
  @ApiNotFoundResponse({ description: 'Product with term not found' })
  @ApiBadRequestResponse({ description: 'Needs term param' })
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Product with id modified succesfully',
    type: Product,
  })
  @ApiBadRequestResponse({ description: 'Bad request, needs id param' })
  @ApiNotFoundResponse({ description: 'Product with id was not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @ApiOkResponse({
    description: 'Product with id deleted succesfully',
  })
  @ApiBadRequestResponse({ description: 'Bad request, needs id param' })
  @ApiNotFoundResponse({ description: 'Product with id was not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
