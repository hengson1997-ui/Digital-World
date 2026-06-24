import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const { filter } = req.query;

    // 构建查询条件
    const where = { recipientId: 1 }; // 当前用户（无认证系统）
    if (filter && filter !== 'all') {
      where.type = filter;
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: true
      },
      orderBy: { id: 'desc' }
    });

    // 格式化为前端需要的格式
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      avatar: msg.sender.avatar,
      gradient: msg.sender.avatarGradient,
      name: msg.sender.name,
      time: msg.time,
      preview: msg.preview,
      badge: msg.badge
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error('获取消息失败:', error);
    res.status(500).json({ error: '获取消息失败' });
  }
}
