import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const userId = 1;

  // GET - 获取所有收藏夹
  if (req.method === 'GET') {
    try {
      const collections = await prisma.favoriteCollection.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        include: { _count: { select: { favorites: true } } }
      });

      res.status(200).json(collections.map(c => ({
        id: c.id,
        name: c.name,
        count: c._count.favorites
      })));
    } catch (error) {
      console.error('获取收藏夹失败:', error);
      res.status(500).json({ error: '获取收藏夹失败' });
    }
    return;
  }

  // POST - 创建新收藏夹
  if (req.method === 'POST') {
    try {
      const { name } = req.body;
      if (!name?.trim()) return res.status(400).json({ error: '名称不能为空' });

      // 检查重名
      const existing = await prisma.favoriteCollection.findFirst({
        where: { userId, name: name.trim() }
      });
      if (existing) return res.status(400).json({ error: '收藏夹名称已存在' });

      const collection = await prisma.favoriteCollection.create({
        data: { userId, name: name.trim() }
      });
      res.status(201).json({ id: collection.id, name: collection.name, count: 0 });
    } catch (error) {
      console.error('创建收藏夹失败:', error);
      res.status(500).json({ error: '创建收藏夹失败' });
    }
    return;
  }

  // PATCH - 重命名收藏夹
  if (req.method === 'PATCH') {
    try {
      const { id, name } = req.body;
      if (!id || !name?.trim()) return res.status(400).json({ error: '缺少 id 或 name' });

      // 不允许重命名默认收藏夹
      const target = await prisma.favoriteCollection.findUnique({ where: { id: parseInt(id) } });
      if (!target) return res.status(404).json({ error: '收藏夹不存在' });
      if (target.name === '默认') return res.status(400).json({ error: '不能重命名默认收藏夹' });

      const updated = await prisma.favoriteCollection.update({
        where: { id: parseInt(id) },
        data: { name: name.trim() }
      });
      res.status(200).json({ ok: true, id: updated.id, name: updated.name });
    } catch (error) {
      console.error('重命名失败:', error);
      res.status(500).json({ error: '重命名失败' });
    }
    return;
  }

  // DELETE - 删除收藏夹（帖子会随 onDelete: Cascade 一起删除）
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: '缺少 id' });

      // 不允许删除默认收藏夹
      const target = await prisma.favoriteCollection.findUnique({ where: { id: parseInt(id) } });
      if (!target) return res.status(404).json({ error: '收藏夹不存在' });
      if (target.name === '默认') return res.status(400).json({ error: '不能删除默认收藏夹' });

      await prisma.favoriteCollection.delete({ where: { id: parseInt(id) } });
      res.status(200).json({ ok: true });
    } catch (error) {
      console.error('删除收藏夹失败:', error);
      res.status(500).json({ error: '删除收藏夹失败' });
    }
    return;
  }

  res.status(405).json({ error: '方法不允许' });
}
