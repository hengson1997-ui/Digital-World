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
    bookmarked
  };
}
