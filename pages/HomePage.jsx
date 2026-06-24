import { useState, useCallback, useRef } from 'react';
import CategoryBar from '../components/CategoryBar';
import PostCard from '../components/PostCard';
import PostCardSkeleton from '../components/PostCardSkeleton';
import useFetch from '../hooks/useFetch';

export default function HomePage({ activeTab = 'recommend' }) {
  const [activeCategory, setActiveCategory] = useState('general');
  const processingLikes = useRef(new Set());

  // 从 API 获取帖子数据，包含分类和排序参数
  const { data: posts, loading, error, refetch, setData: setPosts } = useFetch(
    `/api/posts?category=${activeCategory}&sort=${activeTab}`
  );

  // 点赞处理（乐观更新 + 防抖）
  const handleLike = useCallback(async (postId) => {
    if (processingLikes.current.has(postId)) return;
    processingLikes.current.add(postId);

    setPosts(prev => {
      if (!prev) return prev;
      return prev.map(p => {
        if (p.id === postId) {
          return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
        }
        return p;
      });
    });

    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'PATCH' });
      if (!res.ok) {
        // 回滚
        setPosts(prev => {
          if (!prev) return prev;
          return prev.map(p => {
            if (p.id === postId) {
              return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
            }
            return p;
          });
        });
      }
    } catch (err) {
      console.error('点赞请求失败:', err);
    } finally {
      processingLikes.current.delete(postId);
    }
  }, [setPosts]);

  const isEmpty = posts && posts.length === 0;

  // 加载中 — 骨架屏
  if (loading && !posts) {
    return (
      <>
        <CategoryBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </>
    );
  }

  // 错误状态 — 带重试按钮
  if (error) {
    return (
      <>
        <CategoryBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        <div className="error-state">
          <div>加载失败</div>
          <button className="error-state-btn" onClick={refetch}>
            重新加载
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <CategoryBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      {/* 切换分类/Tab 时的加载指示 */}
      {loading && posts && <div className="loading-spinner" style={{ padding: '8px' }}></div>}
      {isEmpty ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            {activeTab === 'follow' ? '📌' : '📭'}
          </div>
          <div className="empty-state-title">
            {activeTab === 'follow' ? '还没有关注内容' : '暂无内容'}
          </div>
          <div className="empty-state-desc">
            {activeTab === 'follow' ? '点赞帖子会出现在这里' : '换个分类试试'}
          </div>
        </div>
      ) : (
        posts && posts.map(post => (
          <PostCard key={post.id} post={post} onLike={() => handleLike(post.id)} />
        ))
      )}
    </>
  );
}
