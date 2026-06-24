import useFetch from '../../hooks/useFetch';
import PostCard from '../PostCard';
import PostCardSkeleton from '../PostCardSkeleton';

export default function HistoryPage({ onBack, onLike }) {
  const { data: posts, loading, error } = useFetch('/api/users/history');

  return (
    <div className="profile-page">
      <div className="sub-page-header">
        <button className="sub-page-back" onClick={onBack}>← 返回</button>
        <div className="sub-page-title">浏览历史</div>
      </div>

      {loading && !posts && (
        <>
          <PostCardSkeleton />
          <PostCardSkeleton />
        </>
      )}

      {error && (
        <div className="error-state">
          <div>加载失败</div>
          <button className="error-state-btn" onClick={onBack}>返回</button>
        </div>
      )}

      {posts && posts.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📖</div>
          <div className="empty-state-title">还没有浏览记录</div>
          <div className="empty-state-desc">浏览帖子后会自动记录在这里</div>
        </div>
      )}

      {posts && posts.map(post => (
        <PostCard key={post.id} post={post} onLike={onLike ? () => onLike(post.id) : undefined} />
      ))}
    </div>
  );
}
