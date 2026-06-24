import prisma from '../../../lib/prisma';
import { mapPost } from '../../../lib/postMapper';

export default async function handler(req, res) {
  const userId = 1; // 当前用户（无认证）

  // GET - 获取用户资料
  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: { select: { posts: true } },
          posts: {
            include: { author: true, tags: true, category: true },
            orderBy: { createdAt: 'desc' },
            take: 20
          }
        }
      });

      if (!user) return res.status(404).json({ error: '用户不存在' });

      // 查询收藏状态
      const favorites = await prisma.favorite.findMany({
        where: { userId, postId: { in: user.posts.map(p => p.id) } },
        select: { postId: true }
      });
      const favoriteSet = new Set(favorites.map(f => f.postId));

      res.status(200).json({
        id: user.id,
        avatar: user.avatar,
        avatarGradient: user.avatarGradient,
        name: user.name,
        bio: user.bio,
        postCount: user._count.posts,
        followerCount: formatCount(user.followerCount),
        followingCount: formatCount(user.followingCount),
        posts: user.posts.map(p => mapPost(p, { bookmarked: favoriteSet.has(p.id) }))
      });
    } catch (error) {
      console.error('获取用户资料失败:', error);
      res.status(500).json({ error: '获取用户资料失败' });
    }
    return;
  }

  // PATCH - 更新用户资料
  if (req.method === 'PATCH') {
    try {
      const { avatar, avatarGradient, name, bio } = req.body;

      const data = {};
      if (avatar !== undefined) data.avatar = avatar;
      if (avatarGradient !== undefined) data.avatarGradient = avatarGradient;
      if (name !== undefined) data.name = name;
      if (bio !== undefined) data.bio = bio;

      if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: '没有要更新的字段' });
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data
      });

      res.status(200).json({ ok: true, user: { id: user.id, avatar: user.avatar, avatarGradient: user.avatarGradient, name: user.name, bio: user.bio } });
    } catch (error) {
      console.error('更新资料失败:', error);
      res.status(500).json({ error: '更新资料失败' });
    }
    return;
  }

  res.status(405).json({ error: '方法不允许' });
}

function formatCount(count) {
  if (count >= 10000) {
    return (count / 10000).toFixed(1).replace(/\.0$/, '') + '万';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return count.toString();
}
