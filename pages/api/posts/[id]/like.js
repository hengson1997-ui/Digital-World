import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  // PATCH - 切换点赞状态（原子操作，避免竞态）
  if (req.method === 'PATCH') {
    try {
      const { id } = req.query;
      const postId = parseInt(id);

      // 读取当前状态
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { liked: true, likes: true }
      });

      if (!post) {
        return res.status(404).json({ error: '帖子不存在' });
      }

      // 原子更新：用 increment/decrement 避免竞态
      const nowLiked = !post.liked;
      const updated = await prisma.post.update({
        where: { id: postId },
        data: {
          liked: nowLiked,
          likes: nowLiked ? { increment: 1 } : { decrement: 1 }
        },
        select: { liked: true, likes: true }
      });

      res.status(200).json(updated);
    } catch (error) {
      console.error('点赞失败:', error);
      res.status(500).json({ error: '点赞失败' });
    }
    return;
  }

  res.status(405).json({ error: '方法不允许' });
}
