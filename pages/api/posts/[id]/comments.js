import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  const postId = parseInt(id);
  const userId = 1; // 当前用户（无认证）

  // GET - 获取帖子评论
  if (req.method === 'GET') {
    try {
      const comments = await prisma.comment.findMany({
        where: { postId },
        orderBy: { createdAt: 'desc' },
        take: 50
      });

      // 获取评论者信息
      const userIds = [...new Set(comments.map(c => c.userId))];
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, avatar: true, avatarGradient: true, name: true }
      });
      const userMap = Object.fromEntries(users.map(u => [u.id, u]));

      const result = comments.map(c => {
        const u = userMap[c.userId] || {};
        return {
          id: c.id,
          content: c.content,
          userId: c.userId,
          avatar: u.avatar || '?',
          avatarGradient: u.avatarGradient,
          username: u.name || '匿名',
          createdAt: c.createdAt
        };
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('获取评论失败:', error);
      res.status(500).json({ error: '获取评论失败' });
    }
    return;
  }

  // POST - 发表评论
  if (req.method === 'POST') {
    try {
      const { content } = req.body;
      if (!content?.trim()) {
        return res.status(400).json({ error: '评论内容不能为空' });
      }

      const comment = await prisma.comment.create({
        data: { userId, postId, content: content.trim() }
      });

      // 更新帖子评论计数
      await prisma.post.update({
        where: { id: postId },
        data: { comments: { increment: 1 } }
      });

      // 获取当前用户信息用于返回
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true, avatarGradient: true, name: true }
      });

      res.status(201).json({
        id: comment.id,
        content: comment.content,
        userId,
        avatar: user?.avatar || '?',
        avatarGradient: user?.avatarGradient,
        username: user?.name || '匿名',
        createdAt: comment.createdAt
      });
    } catch (error) {
      console.error('发表评论失败:', error);
      res.status(500).json({ error: '发表评论失败' });
    }
    return;
  }

  res.status(405).json({ error: '方法不允许' });
}
