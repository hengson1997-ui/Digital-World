// 帖子编辑窗口：发布后 72 小时内允许作者编辑
export const EDIT_WINDOW_HOURS = 72;

export function canEditPost(createdAt, now = new Date()) {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const hoursDiff = (now - created) / (1000 * 60 * 60);
  return hoursDiff >= 0 && hoursDiff < EDIT_WINDOW_HOURS;
}

// 将 Prisma 嵌套的帖子结构映射为 PostCard 需要的扁平结构
export function mapPost(post, { bookmarked = false } = {}) {
  return {
    id: post.id,
    avatar: post.author?.avatar || 'S',
    avatarGradient: post.author?.avatarGradient || undefined,
    username: post.author?.name || '匿名用户',
    meta: post.meta || '',
    title: post.title,
    content: post.content,
    images: Array.from({ length: post.images || 0 }, (_, i) => i + 1),
    likes: post.likes,
    comments: post.comments,
    liked: post.liked,
    bookmarked,
    // 编辑相关字段
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    categoryKey: post.category?.key || null,
    tags: (post.tags || []).map(t => t.tag),
    canEdit: canEditPost(post.createdAt)
  };
}
