import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 간단한 해시 함수
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// GET: 조회수 가져오기
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;

  const { count, error } = await supabase
    .from("post_views")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (error) {
    return NextResponse.json({ views: 0 }, { status: 200 });
  }

  return NextResponse.json({ views: count || 0 });
}

// POST: 조회수 증가
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;

  // visitor 식별자 생성 (IP + User-Agent + postId 조합)
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
             request.headers.get("x-real-ip") ||
             "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const visitorHash = simpleHash(`${ip}-${userAgent}-${postId}`);

  // 10분 내 같은 방문자가 조회했는지 확인 (더 짧은 시간으로 변경)
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

  const { data: existingView } = await supabase
    .from("post_views")
    .select("id")
    .eq("post_id", postId)
    .eq("visitor_hash", visitorHash)
    .gte("viewed_at", tenMinutesAgo)
    .maybeSingle();

  // 10분 내 조회 기록이 없으면 새로 추가
  if (!existingView) {
    await supabase
      .from("post_views")
      .insert({
        post_id: postId,
        visitor_hash: visitorHash,
      });
  }

  // 총 조회수 반환
  const { count } = await supabase
    .from("post_views")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  return NextResponse.json({ views: count || 0 });
}
