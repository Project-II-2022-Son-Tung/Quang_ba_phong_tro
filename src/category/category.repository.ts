import { CategoryDocument, CategoryModel } from './category.model';

export class CategoryRepository {
  async getAllCategories(): Promise<CategoryDocument[] | null> {
    return CategoryModel.find().lean();
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
}
