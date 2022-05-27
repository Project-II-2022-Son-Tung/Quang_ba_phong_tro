import { JsonController, Get } from 'routing-controllers';
import { CategoryService } from './category.service';
@JsonController('/categories')
export class CategoryController {
  private readonly categoryService = new CategoryService();

  @Get('', { transformResponse: false })
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }
}
