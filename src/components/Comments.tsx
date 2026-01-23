'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  replies: Comment[];
}

interface CommentsProps {
  slug: string;
}

export default function Comments({ slug }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const storageKey = `blog-comments-${slug}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setComments(JSON.parse(saved));
    }
  }, [storageKey]);

  const saveComments = (newComments: Comment[]) => {
    setComments(newComments);
    localStorage.setItem(storageKey, JSON.stringify(newComments));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: author.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      replies: [],
    };

    saveComments([newComment, ...comments]);
    setContent('');
  };

  const handleReply = (commentId: string) => {
    if (!author.trim() || !replyContent.trim()) return;

    const newReply: Comment = {
      id: Date.now().toString(),
      author: author.trim(),
      content: replyContent.trim(),
      createdAt: new Date().toISOString(),
      replies: [],
    };

    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply],
        };
      }
      return comment;
    });

    saveComments(updatedComments);
    setReplyTo(null);
    setReplyContent('');
  };

  const handleDelete = (commentId: string, parentId?: string) => {
    if (parentId) {
      const updatedComments = comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.filter(r => r.id !== commentId),
          };
        }
        return comment;
      });
      saveComments(updatedComments);
    } else {
      saveComments(comments.filter(c => c.id !== commentId));
    }
  };

  const CommentItem = ({
    comment,
    parentId,
    depth = 0,
  }: {
    comment: Comment;
    parentId?: string;
    depth?: number;
  }) => (
    <div className={`${depth > 0 ? 'ml-8 mt-4' : ''}`}>
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">{comment.author}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(comment.createdAt), 'yyyy.MM.dd HH:mm', { locale: ko })}
            </span>
          </div>
          <button
            onClick={() => handleDelete(comment.id, parentId)}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            삭제
          </button>
        </div>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {comment.content}
        </p>
        {depth === 0 && (
          <button
            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
            className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            답글
          </button>
        )}
      </div>

      {replyTo === comment.id && (
        <div className="mt-4 ml-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="답글을 입력하세요..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleReply(comment.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              등록
            </button>
          </div>
        </div>
      )}

      {comment.replies.map(reply => (
        <CommentItem key={reply.id} comment={reply} parentId={comment.id} depth={depth + 1} />
      ))}
    </div>
  );

  return (
    <section>
      <h2 className="text-xl font-bold mb-6">
        댓글 {comments.length > 0 && <span className="text-blue-600">({comments.length})</span>}
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="이름"
            className="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="댓글을 입력하세요..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          댓글 등록
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map(comment => <CommentItem key={comment.id} comment={comment} />)
        ) : (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">
            아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
          </p>
        )}
      </div>
    </section>
  );
}
