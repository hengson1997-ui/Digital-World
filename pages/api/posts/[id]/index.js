import prisma from '../../../../lib/prisma';
import { mapPost, canEditPost } from '../../../../lib/postMapper';

export default async function handler(req, res) {
  const { id } = req.query;
  const postId = parseInt(id, 10);

  if (isNaN(postId)) {
    return res.status(400).json({ error: '无效的帖子ID' });
  }

  // GET - 获取单个帖子详情
  if (req.method === 'GET') {
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { author: true, tags: true, category: true }
      });
      if (!post) {
        return res.status(404).json({ error: '帖子不存在' });
      }
      res.status(200).json(mapPost(post));
    } catch (error) {
      console.error('获取帖子详情失败:', error);
      res.status(500).json({ error: '获取帖子详情失败' });
    }
    return;
  }

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: '方法不允许' });
  }

  const currentUserId = 1; // 无认证系统，固定为用户 1

  try {
    const { title, content, categoryKey, tags } = req.body || {};

    // 校验必填字段
    if (!title || !title.trim() || !content || !content.trim()) {
      return res.status(400).json({ error: '标题和内容不能为空' });
    }

    // 查找帖子，校验存在性
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { category: true, tags: true }
    });
    if (!post) {
      return res.status(404).json({ error: '帖子不存在' });
    }

    // 校验编辑权限：仅作者本人
    if (post.authorId !== currentUserId) {
      return res.status(403).json({ error: '只有作者本人可以编辑该帖子' });
    }

    // 校验编辑窗口：72 小时内
    if (!canEditPost(post.createdAt)) {
      return res.status(403).json({ error: '已超过 72 小时编辑期限，无法编辑' });
    }

    // 解析分类 ID
    let categoryId = post.categoryId;
    if (categoryKey !== undefined) {
      if (categoryKey) {
        const category = await prisma.category.findUnique({ where: { key: categoryKey } });
        categoryId = category ? category.id : null;
      } else {
        categoryId = null;
      }
    }

    // 处理标签：先删除原有关联，再按去重后的新标签建立
    if (Array.isArray(tags)) {
      const cleanTags = [...new Set(
        tags
          .map(t => (typeof t === 'string' ? t.trim() : ''))
          .filter(t => t.length > 0 && t.length <= 20)
      )].slice(0, 8);

      await prisma.postTag.deleteMany({ where: { postId } });
      if (cleanTags.length > 0) {
        await prisma.postTag.createMany({
          data: cleanTags.map(tag => ({ postId, tag }))
        });
      }
    }

    // 更新帖子
    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        title: title.trim(),
        content: content.trim(),
        categoryId
      },
      include: {
        author: true,
        tags: true,
        category: true
      }
    });

    res.status(200).json(mapPost(updated));
  } catch (error) {
    console.error('编辑帖子失败:', error);
    res.status(500).json({ error: '编辑帖子失败' });
  }
}
