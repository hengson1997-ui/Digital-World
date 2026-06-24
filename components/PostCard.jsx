import { useState, useCallback, useEffect } from 'react';

// SVG 图标组件
const IconLike = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconComment = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconBookmark = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const IconShare = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

export default function PostCard({ post, onLike }) {
  const {
    id,
    avatar = 'S',
    avatarGradient,
    username = '数码发烧友',
    meta = '',
    title,
    content,
    images = [],
    likes = 0,
    comments: commentCount = 0,
    liked = false,
    bookmarked: initialBookmarked = false,
    createdAt,
    updatedAt
  } = post;

  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [expanded, setExpanded] = useState(false);
  const [showToast, setShowToast] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showCollectionPicker, setShowCollectionPicker] = useState(false);
  const [collections, setCollections] = useState([]);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(''), 1500);
    return () => clearTimeout(t);
  }, [showToast]);

  // 加载评论
  const loadComments = useCallback(async () => {
    setLoadingComments(true);
    try {
      const res = await fetch(`/api/posts/${id}/comments`);
      if (res.ok) setComments(await res.json());
    } catch (err) {
      console.error('加载评论失败:', err);
    } finally {
      setLoadingComments(false);
    }
  }, [id]);

  const toggleComments = useCallback(() => {
    const next = !showComments;
    setShowComments(next);
    if (next && comments.length === 0) loadComments();
  }, [showComments, comments.length, loadComments]);

  const handleSubmitComment = useCallback(async () => {
    if (!commentText.trim() || submittingComment) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/posts/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText.trim() })
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments(prev => [newComment, ...prev]);
        setCommentText('');
      }
    } catch (err) {
      console.error('发表评论失败:', err);
    } finally {
      setSubmittingComment(false);
    }
  }, [id, commentText, submittingComment]);

  // 加载收藏夹列表（含当前帖子是否已在其中）
  const loadCollections = useCallback(async () => {
    setLoadingCollections(true);
    try {
      const res = await fetch('/api/users/favorites/collections');
      if (res.ok) {
        const allCollections = await res.json();
        // 查询当前帖子在哪些收藏夹中
        const favRes = await fetch(`/api/users/favorites?postId=${id}`);
        if (favRes.ok) {
          const favData = await favRes.json();
          const inCollectionIds = new Set((favData.collections || []).map(c => c.id));
          setCollections(allCollections.map(c => ({
            ...c,
            containsPost: inCollectionIds.has(c.id)
          })));
        } else {
          setCollections(allCollections);
        }
      }
    } catch (err) {
      console.error('加载收藏夹失败:', err);
    } finally {
      setLoadingCollections(false);
    }
  }, [id]);

  // 添加到指定收藏夹
  const handleAddToCollection = useCallback(async (collectionId) => {
    setShowCollectionPicker(false);
    setBookmarked(true);
    setShowToast('已收藏');

    try {
      const res = await fetch('/api/users/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id, collectionId })
      });
      if (!res.ok) {
        setBookmarked(false);
        setShowToast('收藏失败');
      }
    } catch {
      setBookmarked(false);
      setShowToast('网络错误');
    }
  }, [id]);

  // 取消收藏
  const handleRemoveBookmark = useCallback(async () => {
    setBookmarked(false);
    setShowToast('已取消收藏');
    try {
      await fetch('/api/users/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id })
      });
    } catch {
      setBookmarked(true);
    }
  }, [id]);

  // 创建新收藏夹并收藏
  const handleCreateAndCollect = useCallback(async (name) => {
    if (!name) return;
    try {
      const createRes = await fetch('/api/users/favorites/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (createRes.ok) {
        const newCollection = await createRes.json();
        await handleAddToCollection(newCollection.id);
        setShowCreateInput(false);
        setNewCollectionName('');
      } else {
        const data = await createRes.json();
        setShowToast(data.error || '创建失败');
      }
    } catch {
      setShowToast('网络错误');
    }
  }, [handleAddToCollection]);

  // 点击收藏按钮
  const handleBookmarkClick = useCallback(() => {
    if (bookmarked) {
      handleRemoveBookmark();
    } else {
      setShowCollectionPicker(true);
      setShowCreateInput(false);
      setNewCollectionName('');
      loadCollections();
    }
  }, [bookmarked, loadCollections, handleRemoveBookmark]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try { await navigator.share({ title, text: content?.slice(0, 100) }); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(title);
        setShowToast('已复制标题');
      } catch {}
    }
  }, [title, content]);

  const imageClass = (idx) => {
    if (idx === 0) return 'post-image';
    if (idx === 1) return 'post-image gradient-2';
    if (idx === 2) return 'post-image gradient-3';
    if (idx === 3) return 'post-image gradient-4';
    return 'post-image gradient-5';
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const diff = Date.now() - d.getTime();
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
    return d.toLocaleDateString('zh-CN');
  };

  // 仅在 updatedAt 晚于 createdAt 时显示"已编辑"
  const isEdited = createdAt && updatedAt && new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 1000;

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="avatar" style={avatarGradient ? { background: avatarGradient } : undefined}>
          {avatar}
        </div>
        <div className="user-info">
          <div className="username">{username}</div>
          <div className="post-meta">{meta}</div>
        </div>
      </div>

      <div className="post-title">{title}</div>
      {!expanded && content && content.length > 200 ? (
        <div className="post-content-wrap">
          <div className="post-content clamp">{content}</div>
          <div className="post-content-more" onClick={() => setExpanded(true)}>...更多</div>
        </div>
      ) : (
        <div className="post-content">{content}</div>
      )}
      {expanded && content && content.length > 200 && (
        <div className="post-content-collapse" onClick={() => setExpanded(false)}>收起</div>
      )}

      {images.length > 0 && (
        <div className={`post-images ${images.length === 1 ? 'single-col' : images.length === 2 ? 'two-col' : ''}`}>
          {images.map((_, idx) => (
            <div key={idx} className={imageClass(idx)}></div>
          ))}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="post-actions">
        <button className={`action-btn ${liked ? 'liked' : ''}`} onClick={() => onLike && onLike()}>
          <IconLike filled={liked} />
          <span>{likes}</span>
        </button>
        <button
          className={`action-btn ${showComments ? 'active-comment' : ''}`}
          onClick={toggleComments}
        >
          <IconComment />
          <span>{commentCount}</span>
        </button>
        <button
          className={`action-btn ${bookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmarkClick}
        >
          <IconBookmark filled={bookmarked} />
        </button>
        <button className="action-btn" onClick={handleShare}>
          <IconShare />
        </button>
      </div>

      {/* 收藏夹选择（内联展开） */}
      {showCollectionPicker && (
        <div className="collection-inline">
          <div className="collection-inline-title">收藏到</div>
          {loadingCollections && (
            <div style={{ padding: '8px 0', color: '#8e8e93', fontSize: '13px' }}>加载中...</div>
          )}
          <div className="collection-inline-list">
            {collections.map(c => (
              <button
                key={c.id}
                className={`collection-inline-btn ${c.containsPost ? 'already-in' : ''}`}
                onClick={() => { if (!c.containsPost) handleAddToCollection(c.id); }}
              >
                {c.containsPost ? '✅' : '📁'} {c.name}
              </button>
            ))}
            {!showCreateInput ? (
              <button className="collection-inline-btn collection-inline-add" onClick={() => setShowCreateInput(true)}>
                + 新建
              </button>
            ) : (
              <div className="collection-inline-new">
                <input
                  type="text"
                  placeholder="名称"
                  value={newCollectionName}
                  onChange={e => setNewCollectionName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleCreateAndCollect(newCollectionName.trim()); }}
                  autoFocus
                  maxLength={20}
                />
                <button onClick={() => handleCreateAndCollect(newCollectionName.trim())} disabled={!newCollectionName.trim()}>
                  创建
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 评论区 */}
      {showComments && (
        <div className="comment-section">
          <div className="comment-input-row">
            <input
              type="text"
              className="comment-input"
              placeholder="写评论..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmitComment(); }}
            />
            <button
              className="comment-submit"
              onClick={handleSubmitComment}
              disabled={!commentText.trim() || submittingComment}
            >
              {submittingComment ? '...' : '发送'}
            </button>
          </div>

          {loadingComments && (
            <div style={{ textAlign: 'center', padding: '16px', color: '#8e8e93', fontSize: '13px' }}>加载中...</div>
          )}

          {!loadingComments && comments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#8e8e93', fontSize: '13px' }}>还没有评论，快来抢沙发吧</div>
          )}

          {comments.map(c => (
            <div key={c.id} className="comment-bubble">
              <div className="comment-avatar" style={c.avatarGradient ? { background: c.avatarGradient } : undefined}>
                {c.avatar}
              </div>
              <div className="comment-body">
                <div className="comment-header">
                  <span className="comment-username">{c.username}</span>
                  <span className="comment-time">{formatTime(c.createdAt)}</span>
                </div>
                <div className="comment-text">{c.content}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showToast && <div className="card-toast">{showToast}</div>}
    </div>
  );
}
