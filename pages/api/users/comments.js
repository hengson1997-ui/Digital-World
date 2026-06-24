import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const userId = 1;

  // GET - 获取我的评论
  if (req.method === 'GET') {
    try {
      const comments = await prisma.comment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50
      });

      // 获取关联帖子信息
      const postIds = [...new Set(comments.map(c => c.postId))];
      const posts = await prisma.post.findMany({
        where: { id: { in: postIds } },
        select: { id: true, title: true }
      });
      const postMap = Object.fromEntries(posts.map(p => [p.id, p.title]));

      const result = comments.map(c => ({
        id: c.id,
        content: c.content,
        postId: c.postId,
        postTitle: postMap[c.postId] || '已删除的帖子',
        createdAt: c.createdAt
      }));

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
      const { postId, content } = req.body;
      if (!postId || !content?.trim()) {
        return res.status(400).json({ error: '缺少 postId 或 content' });
      }

      const comment = await prisma.comment.create({
        data: { userId, postId: parseInt(postId), content: content.trim() }
      });

      // 更新帖子评论计数
      await prisma.post.update({
        where: { id: parseInt(postId) },
        data: { comments: { increment: 1 } }
      });

      res.status(201).json({ ok: true, id: comment.id });
    } catch (error) {
      console.error('发表评论失败:', error);
      res.status(500).json({ error: '发表评论失败' });
    }
    return;
  }

  res.status(405).json({ error: '方法不允许' });
}
