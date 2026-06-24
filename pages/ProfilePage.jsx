import { useState, useCallback, useRef, useMemo } from 'react';
import useFetch from '../hooks/useFetch';
import PostCard from '../components/PostCard';
import PostCardSkeleton from '../components/PostCardSkeleton';
import FavoritesPage from '../components/profile/FavoritesPage';
import HistoryPage from '../components/profile/HistoryPage';
import CommentsPage from '../components/profile/CommentsPage';
import SettingsPage from '../components/profile/SettingsPage';

const quickActions = [
  { icon: '⭐', label: '收藏', gradient: 'linear-gradient(135deg, #ffcc00, #ff9500)', action: 'favorites' },
  { icon: '📖', label: '历史', gradient: 'linear-gradient(135deg, #5ac8fa, #007aff)', action: 'history' },
  { icon: '💬', label: '评论', gradient: 'linear-gradient(135deg, #af52de, #5856d6)', action: 'comments' },
  { icon: '⚙', label: '设置', gradient: 'linear-gradient(135deg, #34c759, #30d158)', action: 'settings' }
];

const defaultUser = {
  id: 1,
  avatar: '数',
  avatarGradient: 'linear-gradient(135deg, #af52de, #5856d6)',
  name: '数码社区用户',
  bio: '热爱数码，热爱生活 · 加入 365 天',
  postCount: 0,
  followerCount: '2.5k',
  followingCount: '896',
  posts: []
};

export default function ProfilePage({ onNavigate }) {
  const { data: user, setData: setUser, refetch } = useFetch('/api/users/profile');
  const profile = user || defaultUser;
  const processingLikes = useRef(new Set());
  const postsRef = useRef(null);

  const [subPage, setSubPage] = useState(null); // null = 主页面
  const [postSort, setPostSort] = useState('latest'); // 'latest' | 'hot'

  // 排序后的帖子
  const sortedPosts = useMemo(() => {
    if (!profile.posts) return [];
    const arr = [...profile.posts];
    if (postSort === 'hot') {
      arr.sort((a, b) => b.likes - a.likes);
    } else {
      arr.sort((a, b) => b.id - a.id); // id 越大越新
    }
    return arr;
  }, [profile.posts, postSort]);

  // 快捷功能点击
  const handleQuickAction = useCallback((action) => {
    setSubPage(action);
  }, []);

  // 点赞处理
  const handleLike = useCallback(async (postId) => {
    if (processingLikes.current.has(postId)) return;
    processingLikes.current.add(postId);

    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        posts: prev.posts.map(p => {
          if (p.id === postId) {
            return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
          }
          return p;
        })
      };
    });

    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'PATCH' });
      if (!res.ok) {
        setUser(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            posts: prev.posts.map(p => {
              if (p.id === postId) {
                return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
              }
              return p;
            })
          };
        });
      }
    } catch (err) {
      console.error('点赞失败:', err);
    } finally {
      processingLikes.current.delete(postId);
    }
  }, [setUser]);

  // 渲染二级页面
  if (subPage === 'favorites') {
    return <FavoritesPage onBack={() => setSubPage(null)} onLike={handleLike} />;
  }
  if (subPage === 'history') {
    return <HistoryPage onBack={() => setSubPage(null)} onLike={handleLike} />;
  }
  if (subPage === 'comments') {
    return <CommentsPage onBack={() => setSubPage(null)} />;
  }
  if (subPage === 'settings') {
    return <SettingsPage onBack={() => { setSubPage(null); refetch(); }} profile={profile} />;
  }

  // 主页面
  return (
    <div className="profile-page">
      {/* 个人信息头部 */}
      <div className="profile-header">
        <div
          className="profile-avatar"
          style={profile.avatarGradient ? { background: profile.avatarGradient } : undefined}
        >
          {profile.avatar}
        </div>
        <div className="profile-name">{profile.name}</div>
        <div className="profile-bio">{profile.bio}</div>
        <div className="profile-stats">
          <div className="profile-stat">
            <div className="profile-stat-value">{profile.postCount}</div>
            <div className="profile-stat-label">帖子</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-value">{profile.followerCount}</div>
            <div className="profile-stat-label">粉丝</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-value">{profile.followingCount}</div>
            <div className="profile-stat-label">关注</div>
          </div>
        </div>
      </div>

      {/* 快捷功能 */}
      <div className="profile-section">
        <div className="profile-section-title">快捷功能</div>
        <div className="profile-quick-actions">
          {quickActions.map((action, idx) => (
            <div
              key={idx}
              className="profile-quick-action"
              onClick={() => handleQuickAction(action.action)}
            >
              <div
                className="profile-quick-action-icon"
                style={{ background: action.gradient }}
              >
                {action.icon}
              </div>
              <div className="profile-quick-action-label">{action.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 我的内容 */}
      <div className="profile-section" ref={postsRef}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div className="profile-section-title" style={{ marginBottom: 0 }}>我的内容</div>
          <div className="sort-tabs">
            <button
              className={`sort-tab ${postSort === 'latest' ? 'active' : ''}`}
              onClick={() => setPostSort('latest')}
            >
              最新
            </button>
            <button
              className={`sort-tab ${postSort === 'hot' ? 'active' : ''}`}
              onClick={() => setPostSort('hot')}
            >
              最热
            </button>
          </div>
        </div>

        {sortedPosts.length > 0 ? (
          sortedPosts.map(post => (
            <PostCard key={post.id} post={post} onLike={() => handleLike(post.id)} />
          ))
        ) : (
          <div className="empty-state" style={{ padding: '30px 20px' }}>
            <div className="empty-state-icon">✏️</div>
            <div className="empty-state-title">还没有发布内容</div>
            <div className="empty-state-desc">点击下方发帖按钮，分享你的第一篇内容吧！</div>
          </div>
        )}
      </div>
    </div>
  );
}
