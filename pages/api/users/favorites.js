import prisma from '../../../lib/prisma';
import { mapPost } from '../../../lib/postMapper';

export default async function handler(req, res) {
  const userId = 1;

  // GET - 获取所有收藏夹及其帖子
  if (req.method === 'GET') {
    try {
      const { collectionId, postId } = req.query;

      // 如果指定了 postId，返回包含该帖子的收藏夹
      if (postId) {
        const favorites = await prisma.favorite.findMany({
          where: { userId, postId: parseInt(postId) },
          select: { collectionId: true }
        });
        const collectionIds = favorites.map(f => f.collectionId);
        const collections = await prisma.favoriteCollection.findMany({
          where: { id: { in: collectionIds } },
          select: { id: true, name: true }
        });
        return res.status(200).json({ collections });
      }

      // 如果指定了收藏夹，只返回该收藏夹的帖子
      if (collectionId) {
        const favorites = await prisma.favorite.findMany({
          where: { userId, collectionId: parseInt(collectionId) },
          orderBy: { createdAt: 'desc' }
        });
        const postIds = favorites.map(f => f.postId);
        const posts = await prisma.post.findMany({
          where: { id: { in: postIds } },
          include: { author: true, tags: true, category: true }
        });
        const sortedPosts = postIds
          .map(id => posts.find(p => p.id === id))
          .filter(Boolean)
          .map(p => mapPost(p, { bookmarked: true }));

        return res.status(200).json({ posts: sortedPosts });
      }

      // 否则返回所有收藏夹（含帖子数量）
      const collections = await prisma.favoriteCollection.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        include: {
          _count: { select: { favorites: true } }
        }
      });

      const result = collections.map(c => ({
        id: c.id,
        name: c.name,
        count: c._count.favorites,
        createdAt: c.createdAt
      }));

      res.status(200).json({ collections: result });
    } catch (error) {
      console.error('获取收藏失败:', error);
      res.status(500).json({ error: '获取收藏失败' });
    }
    return;
  }

  // POST - 添加收藏
  if (req.method === 'POST') {
    try {
      const { postId, collectionId } = req.body;
      if (!postId) return res.status(400).json({ error: '缺少 postId' });

      // 默认收藏夹 ID
      let targetCollectionId = collectionId ? parseInt(collectionId) : null;
      if (!targetCollectionId) {
        const defaultCollection = await prisma.favoriteCollection.findFirst({
          where: { userId, name: '默认' }
        });
        if (!defaultCollection) {
          const created = await prisma.favoriteCollection.create({
            data: { userId, name: '默认' }
          });
          targetCollectionId = created.id;
        } else {
          targetCollectionId = defaultCollection.id;
        }
      }

      // 避免重复收藏（同一收藏夹）
      const existing = await prisma.favorite.findFirst({
        where: { userId, postId: parseInt(postId), collectionId: targetCollectionId }
      });
      if (existing) return res.status(200).json({ ok: true, message: '已收藏' });

      await prisma.favorite.create({
        data: { userId, postId: parseInt(postId), collectionId: targetCollectionId }
      });
      res.status(201).json({ ok: true, collectionId: targetCollectionId });
    } catch (error) {
      console.error('收藏失败:', error);
      res.status(500).json({ error: '收藏失败' });
    }
    return;
  }

  // DELETE - 取消收藏
  if (req.method === 'DELETE') {
    try {
      const { postId, collectionId } = req.body;
      if (!postId) return res.status(400).json({ error: '缺少 postId' });

      const where = { userId, postId: parseInt(postId) };
      if (collectionId) where.collectionId = parseInt(collectionId);

      await prisma.favorite.deleteMany({ where });
      res.status(200).json({ ok: true });
    } catch (error) {
      console.error('取消收藏失败:', error);
      res.status(500).json({ error: '取消收藏失败' });
    }
    return;
  }

  res.status(405).json({ error: '方法不允许' });
}
