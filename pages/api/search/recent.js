import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  // POST - 记录搜索关键词
  if (req.method === 'POST') {
    try {
      const { keyword } = req.body;
      if (!keyword || !keyword.trim()) {
        return res.status(400).json({ error: '关键词不能为空' });
      }

      // 避免重复：如果已存在则更新时间
      const existing = await prisma.recentSearch.findFirst({
        where: { keyword: keyword.trim() }
      });

      if (existing) {
        await prisma.recentSearch.update({
          where: { id: existing.id },
          data: { createdAt: new Date() }
        });
      } else {
        await prisma.recentSearch.create({
          data: { keyword: keyword.trim() }
        });
      }

      res.status(200).json({ ok: true });
    } catch (error) {
      console.error('记录搜索失败:', error);
      res.status(500).json({ error: '记录搜索失败' });
    }
    return;
  }

  // DELETE - 清空搜索历史
  if (req.method === 'DELETE') {
    try {
      await prisma.recentSearch.deleteMany();
      res.status(200).json({ ok: true });
    } catch (error) {
      console.error('清空搜索历史失败:', error);
      res.status(500).json({ error: '清空失败' });
    }
    return;
  }

  res.status(405).json({ error: '方法不允许' });
}
