import prisma from '../../../lib/prisma';
import { mapPost } from '../../../lib/postMapper';

export default async function handler(req, res) {
  // GET - 获取帖子列表
  if (req.method === 'GET') {
    try {
      const { category, sort } = req.query;

      // 构建查询条件
      const where = {};
      if (category && category !== 'general') {
        where.category = { key: category };
      }

      // 关注 Tab：显示点赞过的帖子（模拟关注）
      if (sort === 'follow') {
        where.liked = true;
      }

      // 构建排序
      let orderBy;
      switch (sort) {
        case 'latest':
          orderBy = { createdAt: 'desc' };
          break;
        case 'recommend':
        default:
          orderBy = { likes: 'desc' };
          break;
      }

      const posts = await prisma.post.findMany({
        where,
        include: {
          author: true,
          tags: true,
          category: true
        },
        orderBy
      });

      // 查询当前用户的收藏列表
      const userId = 1;
      const favorites = await prisma.favorite.findMany({
        where: { userId, postId: { in: posts.map(p => p.id) } },
        select: { postId: true }
      });
      const favoriteSet = new Set(favorites.map(f => f.postId));

      // 映射为前端需要的格式
      const mappedPosts = posts.map(p => mapPost(p, { bookmarked: favoriteSet.has(p.id) }));
      res.status(200).json(mappedPosts);
    } catch (error) {
      console.error('获取帖子失败:', error);
      res.status(500).json({ error: '获取帖子失败' });
    }
    return;
  }

  // POST - 创建新帖
  if (req.method === 'POST') {
    try {
      const { title, content, categoryKey } = req.body;

      // 验证必填字段
      if (!title || !content) {
        return res.status(400).json({ error: '标题和内容不能为空' });
      }

      // 查找分类 ID
      let categoryId = null;
      if (categoryKey) {
        const category = await prisma.category.findUnique({
          where: { key: categoryKey }
        });
        if (category) categoryId = category.id;
      }

      // 创建帖子（默认作者为 userId=1）
      const now = new Date();
      const post = await prisma.post.create({
        data: {
          title,
          content,
          meta: '刚刚发布',
          authorId: 1, // 当前用户（无认证系统）
          categoryId
        },
        include: {
          author: true,
          tags: true,
          category: true
        }
      });

      // 更新作者帖子计数
      await prisma.user.update({
        where: { id: 1 },
        data: { postCount: { increment: 1 } }
      });

      res.status(201).json(mapPost(post));
    } catch (error) {
      console.error('创建帖子失败:', error);
      res.status(500).json({ error: '创建帖子失败' });
    }
    return;
  }

  res.status(405).json({ error: '方法不允许' });
}
