import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    // 并行查询所有搜索页数据
    const [trending, tags, users, recentSearches] = await Promise.all([
      // 热门话题（按排名排序）
      prisma.trendingTopic.findMany({
        orderBy: { rank: 'asc' }
      }),
      // 热门标签
      prisma.tag.findMany(),
      // 推荐用户（按粉丝数排序，取前 4 个）
      prisma.user.findMany({
        where: { name: { not: '系统消息' } }, // 排除系统消息用户
        orderBy: { followers: 'desc' },
        take: 4
      }),
      // 最近搜索
      prisma.recentSearch.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    // 格式化用户数据（添加粉丝数显示文本）
    const formattedUsers = users.map(user => ({
      id: user.id,
      avatar: user.avatar,
      avatarGradient: user.avatarGradient,
      name: user.name,
      followers: formatFollowers(user.followers)
    }));

    // 返回所有数据
    res.status(200).json({
      trending,
      tags: tags.map(t => t.tag),
      users: formattedUsers,
      recentSearches: recentSearches.map(r => r.keyword)
    });
  } catch (error) {
    console.error('获取搜索页数据失败:', error);
    res.status(500).json({ error: '获取搜索页数据失败' });
  }
}

// 格式化粉丝数显示
function formatFollowers(count) {
  if (count >= 10000) {
    return (count / 10000).toFixed(1).replace(/\.0$/, '') + '万 粉丝';
  }
  return count + ' 粉丝';
}
