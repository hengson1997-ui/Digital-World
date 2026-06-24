import { useState } from 'react';
import useFetch from '../hooks/useFetch';

const filterTabs = [
  { key: 'all', label: '全部' },
  { key: 'like', label: '赞' },
  { key: 'comment', label: '评论' },
  { key: 'follow', label: '关注' },
  { key: 'system', label: '系统' }
];

const defaultMessages = [
  { id: 1, avatar: '科', gradient: 'linear-gradient(135deg, #ff6b9d, #c06eff)', name: '科技小王子', time: '3分钟前', preview: '赞了你发布的内容：液态玻璃设计语言的新高度', badge: 2 },
  { id: 2, avatar: '数', gradient: 'linear-gradient(135deg, #5ac8fa, #007aff)', name: '数码发烧友', time: '15分钟前', preview: '评论：同感，我也觉得今年的升级太明显了', badge: 1 },
  { id: 3, avatar: '拍', gradient: 'linear-gradient(135deg, #ffcc00, #ff9500)', name: '拍照达人', time: '1小时前', preview: '关注了你' },
  { id: 4, avatar: 'M', gradient: 'linear-gradient(135deg, #34c759, #30d158)', name: 'MacBook深度用户', time: '3小时前', preview: '评论：说得对，Apple Silicon 确实改变了笔记本行业', badge: 5 },
  { id: 5, avatar: '系', gradient: 'linear-gradient(135deg, #af52de, #5856d6)', name: '系统消息', time: '昨天', preview: '你的帖子被标记为精华，感谢分享！', badge: 1 },
  { id: 6, avatar: 'A', gradient: 'linear-gradient(135deg, #ff9500, #ffcc00)', name: 'AirPods爱好者', time: '2天前', preview: '赞了你的评论：AirPods Pro 2 降噪效果真的很出色' }
];

export default function MessagesPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [readIds, setReadIds] = useState(new Set());

  const { data: messages, loading, error, refetch } = useFetch(
    `/api/messages?filter=${activeFilter}`
  );

  const displayMessages = messages ?? defaultMessages;
  const isEmpty = messages && messages.length === 0;

  // 点击消息标记为已读
  const handleMessageClick = (msgId) => {
    setReadIds(prev => {
      const next = new Set(prev);
      next.add(msgId);
      return next;
    });
  };

  return (
    <div className="messages-page">
      <div className="message-filter-tabs">
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            className={`message-filter-tab ${activeFilter === tab.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && !messages && (
        <div className="error-state">
          <div>加载失败</div>
          <button className="error-state-btn" onClick={refetch}>
            重新加载
          </button>
        </div>
      )}

      {isEmpty && (
        <div className="empty-state">
          <div className="empty-state-icon">💬</div>
          <div className="empty-state-title">暂无消息</div>
          <div className="empty-state-desc">互动消息会出现在这里</div>
        </div>
      )}

      {!isEmpty && (
        <div className="message-list">
          {displayMessages.map(msg => {
            const isRead = readIds.has(msg.id);
            return (
              <div
                key={msg.id}
                className="message-item"
                onClick={() => handleMessageClick(msg.id)}
                style={{ opacity: isRead ? 0.7 : 1 }}
              >
                <div
                  className="message-item-avatar"
                  style={{ background: msg.gradient }}
                >
                  {msg.avatar}
                </div>
                <div className="message-item-info">
                  <div className="message-item-name">
                    <span>{msg.name}</span>
                    <span className="message-item-time">{msg.time}</span>
                  </div>
                  <div className="message-item-preview">
                    {msg.preview}
                    {!isRead && msg.badge ? <span className="message-item-badge">{msg.badge}</span> : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
