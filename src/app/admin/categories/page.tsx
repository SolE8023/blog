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
    <div>
      <h1 className="text-3xl font-bold mb-8">카테고리 관리</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">새 카테고리</h2>
          <CategoryForm />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">카테고리 목록</h2>
          <CategoryList categories={categories} />
        </div>
      </div>
    </div>
  );
}
