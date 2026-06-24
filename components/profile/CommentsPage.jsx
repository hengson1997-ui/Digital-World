import useFetch from '../../hooks/useFetch';

export default function CommentsPage({ onBack }) {
  const { data: comments, loading, error } = useFetch('/api/users/comments');

  return (
    <div className="profile-page">
      <div className="sub-page-header">
        <button className="sub-page-back" onClick={onBack}>← 返回</button>
        <div className="sub-page-title">我的评论</div>
      </div>

      {loading && !comments && (
        <div className="loading-spinner">加载中...</div>
      )}

      {error && (
        <div className="error-state">
          <div>加载失败</div>
          <button className="error-state-btn" onClick={onBack}>返回</button>
        </div>
      )}

      {comments && comments.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">💬</div>
          <div className="empty-state-title">还没有评论</div>
          <div className="empty-state-desc">在帖子下方发表评论后会出现在这里</div>
        </div>
      )}

      {comments && comments.map(comment => (
        <div key={comment.id} className="comment-item">
          <div className="comment-post-title">回复：{comment.postTitle}</div>
          <div className="comment-content">{comment.content}</div>
          <div className="comment-time">{formatTime(comment.createdAt)}</div>
        </div>
      ))}
    </div>
  );
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
  return d.toLocaleDateString('zh-CN');
}
