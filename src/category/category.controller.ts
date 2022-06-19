import {
  JsonController,
  Get,
  Post,
  Body,
  Authorized,
  Put,
  Delete,
  Param,
  BadRequestError,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CategoryService } from './category.service';
import { CreateCategoryDto as ChangeCategoryDetailDto } from './dtos/createCategory.dto';

@JsonController('/categories')
export class CategoryController {
  private readonly categoryService = new CategoryService();

  @Get('', { transformResponse: false })
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Post('')
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Create new category',
  })
  @Authorized(['admin'])
  async createNewCategory(@Body() createCategoryDto: ChangeCategoryDetailDto) {
    await this.categoryService.createCategory(createCategoryDto);
    return {
      message: 'Create successfully',
    };
  }

  @Put('/:category_id', { transformResponse: false })
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Change category detail',
  })
  @Authorized(['admin'])
  async changeNewCategory(
    @Body() changeCategoryDetailDto: ChangeCategoryDetailDto,
    @Param('category_id') category_id: string,
  ) {
    return this.categoryService.changeCategoryDetail(
      category_id,
      changeCategoryDetailDto,
    );
  }

  @Delete('/:category_id')
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Delete a category',
  })
  @Authorized(['admin'])
  async deleteCategory(@Param('category_id') category_id: string) {
    if (!(await this.categoryService.deleteCategory(category_id))) {
      throw new BadRequestError('Delete unsuccessfully');
    }
    return {
      message: 'Delete successfully',
    };
  }
}
