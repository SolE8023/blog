import { createClient } from "@/lib/supabase-server";
import { TagForm } from "@/components/admin/TagForm";
import { TagList } from "@/components/admin/TagList";
import type { Tag } from "@/types";

async function getTags(): Promise<Tag[]> {
  const supabase = await createClient();

  const { data: tags, error } = await supabase
    .from("tags")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }

  return tags || [];
}

export default async function AdminTagsPage() {
  const tags = await getTags();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">태그 관리</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">새 태그</h2>
          <TagForm />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">태그 목록</h2>
          <TagList tags={tags} />
        </div>
      </div>
    </div>
  );
}
