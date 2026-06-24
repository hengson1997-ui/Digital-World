import prisma from '../../../lib/prisma';
import { calcHotScore, formatHotValue } from '../../../lib/hotScore';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const [tags, users, recentSearches, postsWithTags] = await Promise.all([
      prisma.tag.findMany(),
      prisma.user.findMany({
        where: { name: { not: '系统消息' } },
        orderBy: { followers: 'desc' },
        take: 4
      }),
      prisma.recentSearch.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.post.findMany({
        include: {
          tags: true,
          _count: {
            select: {
              tags: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 100
      })
    ]);

    const favoriteCounts = await prisma.favorite.groupBy({
      by: ['postId'],
      _count: { postId: true }
    });
    const favoriteMap = new Map(favoriteCounts.map(f => [f.postId, f._count.postId]));

    const tagHotMap = new Map();
    for (const post of postsWithTags) {
      const favCount = favoriteMap.get(post.id) || 0;
      const score = calcHotScore(post, favCount);
      for (const tag of post.tags) {
        const current = tagHotMap.get(tag.tag) || 0;
        tagHotMap.set(tag.tag, current + score);
      }
    }

    const sortedTags = Array.from(tagHotMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const trending = sortedTags.map(([tag, score], idx) => ({
      rank: idx + 1,
      title: tag,
      hot: (idx < 3 ? '🔥 ' : '') + formatHotValue(score) + ' 热度'
    }));

    const hotTagsList = Array.from(tagHotMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag]) => tag);

    const allTags = tags.map(t => t.tag);
    const mergedTags = [...new Set([...hotTagsList, ...allTags])].slice(0, 12);

    const formattedUsers = users.map(user => ({
      id: user.id,
      avatar: user.avatar,
      avatarGradient: user.avatarGradient,
      name: user.name,
      followers: formatFollowers(user.followers)
    }));

    res.status(200).json({
      trending,
      tags: mergedTags,
      users: formattedUsers,
      recentSearches: recentSearches.map(r => r.keyword)
    });
  } catch (error) {
    console.error('获取搜索页数据失败:', error);
    res.status(500).json({ error: '获取搜索页数据失败' });
  }
}

function formatFollowers(count) {
  if (count >= 10000) {
    return (count / 10000).toFixed(1).replace(/\.0$/, '') + '万 粉丝';
  }
  return count + ' 粉丝';
}
