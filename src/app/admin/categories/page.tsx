import { createClient } from "@/lib/supabase-server";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { CategoryList } from "@/components/admin/CategoryList";
import type { Category } from "@/types";

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return categories || [];
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="admin-ui">
      <h1 className="text-2xl font-semibold mb-8">카테고리</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-sm font-medium text-[var(--text-muted)] mb-4 tracking-wide">새 카테고리</h2>
          <CategoryForm />
        </div>

        <div>
          <h2 className="text-sm font-medium text-[var(--text-muted)] mb-4 tracking-wide">카테고리 목록</h2>
          <CategoryList categories={categories} />
        </div>
      </div>
    </div>
  );
}
