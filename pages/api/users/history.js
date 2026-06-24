import prisma from '../../../lib/prisma';
import { mapPost } from '../../../lib/postMapper';

export default async function handler(req, res) {
  const userId = 1;

  // GET - 获取浏览历史
  if (req.method === 'GET') {
    try {
      const history = await prisma.viewHistory.findMany({
        where: { userId },
        orderBy: { viewedAt: 'desc' },
        take: 50
      });

      const postIds = history.map(h => h.postId);
      const posts = await prisma.post.findMany({
        where: { id: { in: postIds } },
        include: { author: true, tags: true, category: true }
      });

      const sortedPosts = postIds
        .map(id => posts.find(p => p.id === id))
        .filter(Boolean)
        .map(mapPost);

      res.status(200).json(sortedPosts);
    } catch (error) {
      console.error('获取浏览历史失败:', error);
      res.status(500).json({ error: '获取浏览历史失败' });
    }
    return;
  }

  // POST - 记录浏览
  if (req.method === 'POST') {
    try {
      const { postId } = req.body;
      if (!postId) return res.status(400).json({ error: '缺少 postId' });

      await prisma.viewHistory.create({
        data: { userId, postId: parseInt(postId) }
      });
      res.status(201).json({ ok: true });
    } catch (error) {
      console.error('记录浏览失败:', error);
      res.status(500).json({ error: '记录浏览失败' });
    }
    return;
  }

  res.status(405).json({ error: '方法不允许' });
}
