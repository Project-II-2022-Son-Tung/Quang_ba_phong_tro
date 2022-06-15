import { CategoryStatus } from './category-status.enum';
import { CategoryDocument } from './category.model';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dtos/createCategory.dto';

export class CategoryService {
  private readonly categoryRepository = new CategoryRepository();

  async getAllCategories() {
    return this.categoryRepository.getAllCategories();
  }

  async getCategoryBySlug(slug: string): Promise<string | null> {
    return this.categoryRepository.getCategoryBySlug(slug);
  }

  async getCategoriesIDBySlugString(slug: string): Promise<string[] | null> {
    return this.categoryRepository.getCategoriesIDBySlugArray(slug.split(','));
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    Object.assign(createCategoryDto, { status: CategoryStatus.ACTIVE });
    await this.categoryRepository.createCategory(createCategoryDto);
  }

  async changeCategoryDetail(
    category_id: string,
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryRepository.changeCategoryDetail(
      category_id,
      createCategoryDto,
    );
  }

  async deleteCategory(category_id: string): Promise<CategoryDocument | null> {
    return this.categoryRepository.deleteCategory(category_id);
  }
}
