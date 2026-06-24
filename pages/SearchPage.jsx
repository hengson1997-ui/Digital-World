import { useState, useMemo, useCallback } from 'react';
import useFetch from '../hooks/useFetch';

const defaultData = {
  trending: [
    { rank: 1, title: 'iPhone 17 系列发布会', hot: '🔥 12.5万 讨论' },
    { rank: 2, title: 'Vision Pro 2 使用体验', hot: '🔥 9.8万 讨论' },
    { rank: 3, title: 'M5 芯片性能评测', hot: '🔥 7.3万 讨论' },
    { rank: 4, title: 'AirPods Pro 3 曝光', hot: '5.6万 讨论' },
    { rank: 5, title: 'Apple Watch 新功能', hot: '4.2万 讨论' }
  ],
  tags: ['iPhone', 'Mac', 'iPad', 'AirPods', 'Apple Watch', 'Vision Pro', '相机', '耳机'],
  users: [
    { id: 1, avatar: '科', avatarGradient: 'linear-gradient(135deg, #ff6b9d, #c06eff)', name: '科技小王子', followers: '12.8万 粉丝' },
    { id: 2, avatar: '数', avatarGradient: 'linear-gradient(135deg, #5ac8fa, #007aff)', name: '数码发烧友', followers: '8.2万 粉丝' },
    { id: 3, avatar: '拍', avatarGradient: 'linear-gradient(135deg, #ffcc00, #ff9500)', name: '拍照达人', followers: '5.6万 粉丝' },
    { id: 4, avatar: 'M', avatarGradient: 'linear-gradient(135deg, #34c759, #30d158)', name: 'MacBook深度用户', followers: '4.3万 粉丝' }
  ],
  recentSearches: ['iPhone 17', 'M5 MacBook', '最好用的耳机', '相机推荐', '小米15']
};

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const { data, refetch } = useFetch('/api/search/page-data');

  const trendingTopics = data?.trending || defaultData.trending;
  const hotTags = data?.tags || defaultData.tags;
  const users = data?.users || defaultData.users;
  const recentSearches = data?.recentSearches || defaultData.recentSearches;

  // 记录搜索词到后端
  const recordSearch = useCallback((keyword) => {
    fetch('/api/search/recent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword })
    }).then(() => refetch()).catch(() => {});
  }, [refetch]);

  // 搜索框回车记录
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && query.trim()) {
      recordSearch(query.trim());
    }
  }, [query, recordSearch]);

  // 点击搜索词
  const handleSearchClick = useCallback((keyword) => {
    setQuery(keyword);
    recordSearch(keyword);
  }, [recordSearch]);

  // 搜索过滤
  const q = query.trim().toLowerCase();
  const hasQuery = q.length > 0;

  const filteredTrending = useMemo(() =>
    hasQuery ? trendingTopics.filter(t => t.title.toLowerCase().includes(q)) : trendingTopics,
    [trendingTopics, q, hasQuery]
  );
  const filteredTags = useMemo(() =>
    hasQuery ? hotTags.filter(t => t.toLowerCase().includes(q)) : hotTags,
    [hotTags, q, hasQuery]
  );
  const filteredUsers = useMemo(() =>
    hasQuery ? users.filter(u => u.name.toLowerCase().includes(q)) : users,
    [users, q, hasQuery]
  );

  const noResults = hasQuery && filteredTrending.length === 0 && filteredTags.length === 0 && filteredUsers.length === 0;

  return (
    <div className="search-page">
      <div className="search-input-wrap">
        <input
          type="text"
          className="search-input glass"
          placeholder="搜索社区内容、用户、话题"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {noResults && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">未找到相关内容</div>
          <div className="empty-state-desc">换个关键词试试</div>
        </div>
      )}

      {filteredTrending.length > 0 && (
        <div className="search-section">
          <div className="search-section-title">热门话题</div>
          <div className="trending-list">
            {filteredTrending.map(topic => (
              <div key={topic.rank} className="trending-item" onClick={() => handleSearchClick(topic.title)}>
                <div className={`trending-rank ${topic.rank <= 3 ? 'top3' : ''}`}>{topic.rank}</div>
                <div className="trending-info">
                  <div className="trending-title">{topic.title}</div>
                  <div className="trending-hot">{topic.hot}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredTags.length > 0 && (
        <div className="search-section">
          <div className="search-section-title">热门标签</div>
          <div className="tag-cloud">
            {filteredTags.map(tag => (
              <div key={tag} className="cloud-tag" onClick={() => handleSearchClick(tag)}>{tag}</div>
            ))}
          </div>
        </div>
      )}

      {!hasQuery && recentSearches.length > 0 && (
        <div className="search-section">
          <div className="search-section-title">最近搜索</div>
          <div className="recent-list">
            {recentSearches.map(item => (
              <div key={item} className="recent-item" onClick={() => handleSearchClick(item)}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredUsers.length > 0 && (
        <div className="search-section">
          <div className="search-section-title">推荐用户</div>
          <div className="user-grid">
            {filteredUsers.map(u => (
              <div key={u.id} className="user-card">
                <div className="user-card-avatar" style={{ background: u.avatarGradient }}>
                  {u.avatar}
                </div>
                <div className="user-card-name">{u.name}</div>
                <div className="user-card-followers">{u.followers}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
