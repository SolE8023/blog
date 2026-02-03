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
    <div className="admin-ui">
      <h1 className="text-2xl font-semibold mb-8">태그</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-sm font-medium text-[var(--text-muted)] mb-4 tracking-wide">새 태그</h2>
          <TagForm />
        </div>

        <div>
          <h2 className="text-sm font-medium text-[var(--text-muted)] mb-4 tracking-wide">태그 목록</h2>
          <TagList tags={tags} />
        </div>
      </div>
    </div>
  );
}
