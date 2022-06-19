import { CategoryStatus } from './category-status.enum';
import { CategoryDocument, CategoryModel } from './category.model';
import { ChangeCategoryDetailDto } from './dtos/changeCategoryDetail.dto';
import { CreateCategoryDto } from './dtos/createCategory.dto';

export class CategoryRepository {
  async getAllCategories(): Promise<CategoryDocument[] | null> {
    return CategoryModel.find({ status: CategoryStatus.ACTIVE }).sort('- priority').lean();
  }

  async getCategoryBySlug(slug: string): Promise<string | null> {
    const category = await CategoryModel.findOne({ slug }).lean();
    return category?._id;
  }

  async getCategoriesIDBySlugArray(slugs: string[]): Promise<string[] | null> {
    const categories = await CategoryModel.find({
      slug: { $in: slugs },
    }).lean();
    return categories.map((category) => category._id);
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    await CategoryModel.create(createCategoryDto);
  }

  async changeCategoryDetail(
    category_id: string,
    changeCategoryDto: ChangeCategoryDetailDto,
  ) {
    return CategoryModel.findOneAndUpdate(
      { _id: category_id, status: CategoryStatus.ACTIVE },
      changeCategoryDto,
      {
        new: true,
      },
    );
  }

  async deleteCategory(category_id: string): Promise<CategoryDocument | null> {
    return CategoryModel.findOneAndUpdate(
      { _id: category_id, status: CategoryStatus.ACTIVE },
      {
        status: CategoryStatus.INACTIVE,
      },
      {
        new: true,
      },
    );
  }
}
