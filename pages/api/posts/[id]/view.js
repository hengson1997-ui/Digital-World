import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  const postId = parseInt(id, 10);

  if (isNaN(postId)) {
    return res.status(400).json({ error: '无效的帖子ID' });
  }

  if (req.method === 'POST') {
    try {
      const userId = 1;

      const post = await prisma.post.findUnique({
        where: { id: postId }
      });

      if (!post) {
        return res.status(404).json({ error: '帖子不存在' });
      }

      await prisma.post.update({
        where: { id: postId },
        data: { viewCount: { increment: 1 } }
      });

      const existingView = await prisma.viewHistory.findFirst({
        where: { userId, postId }
      });

      if (existingView) {
        await prisma.viewHistory.update({
          where: { id: existingView.id },
          data: { viewedAt: new Date() }
        });
      } else {
        await prisma.viewHistory.create({
          data: { userId, postId }
        });
      }

      res.status(200).json({ ok: true });
    } catch (error) {
      console.error('记录浏览失败:', error);
      res.status(500).json({ error: '记录浏览失败' });
    }
    return;
  }

  res.status(405).json({ error: '方法不允许' });
}
