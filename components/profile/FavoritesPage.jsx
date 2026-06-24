import { useState, useCallback, useEffect } from 'react';
import useFetch from '../../hooks/useFetch';
import PostCard from '../PostCard';
import PostCardSkeleton from '../PostCardSkeleton';

export default function FavoritesPage({ onBack, onLike }) {
  const [view, setView] = useState('collections'); // 'collections' | 'posts'
  const [activeCollection, setActiveCollection] = useState(null);
  const [collections, setCollections] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [toast, setToast] = useState('');

  // Toast 自动消失
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  // 加载收藏夹列表
  const loadCollections = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users/favorites');
      if (res.ok) {
        const data = await res.json();
        setCollections(data.collections || []);
      }
    } catch (err) {
      console.error('加载收藏夹失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 加载某个收藏夹的帖子
  const loadPosts = useCallback(async (collectionId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/favorites?collectionId=${collectionId}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('加载帖子失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  // 进入收藏夹
  const handleOpenCollection = (collection) => {
    setActiveCollection(collection);
    setView('posts');
    loadPosts(collection.id);
  };

  // 返回收藏夹列表
  const handleBackToCollections = () => {
    setView('collections');
    setActiveCollection(null);
    loadCollections(); // 刷新计数
  };

  // 创建收藏夹
  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const res = await fetch('/api/users/favorites/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() })
      });
      if (res.ok) {
        const collection = await res.json();
        setCollections(prev => [...prev, collection]);
        setNewName('');
        setShowCreate(false);
        setToast('收藏夹已创建');
      } else {
        const data = await res.json();
        setToast(data.error || '创建失败');
      }
    } catch {
      setToast('网络错误');
    }
  };

  // 删除收藏夹
  const handleDeleteCollection = async (e, collectionId) => {
    e.stopPropagation();
    if (!confirm('确定删除此收藏夹？其中的帖子也会被移除。')) return;
    try {
      const res = await fetch('/api/users/favorites/collections', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: collectionId })
      });
      if (res.ok) {
        setCollections(prev => prev.filter(c => c.id !== collectionId));
        setToast('已删除');
      } else {
        const data = await res.json();
        setToast(data.error || '删除失败');
      }
    } catch {
      setToast('网络错误');
    }
  };

  // 重命名收藏夹
  const handleRename = async (e, collection) => {
    e.stopPropagation();
    const name = prompt('输入新名称：', collection.name);
    if (!name?.trim() || name.trim() === collection.name) return;
    try {
      const res = await fetch('/api/users/favorites/collections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: collection.id, name: name.trim() })
      });
      if (res.ok) {
        setCollections(prev => prev.map(c =>
          c.id === collection.id ? { ...c, name: name.trim() } : c
        ));
        setToast('已重命名');
      } else {
        const data = await res.json();
        setToast(data.error || '重命名失败');
      }
    } catch {
      setToast('网络错误');
    }
  };

  // ========== 收藏夹列表视图 ==========
  if (view === 'collections') {
    return (
      <div className="profile-page">
        <div className="sub-page-header">
          <button className="sub-page-back" onClick={onBack}>← 返回</button>
          <div className="sub-page-title">我的收藏</div>
          <button
            className="sub-page-back"
            style={{ marginLeft: 'auto', background: '#007aff', color: '#fff' }}
            onClick={() => setShowCreate(!showCreate)}
          >
            {showCreate ? '取消' : '+ 新建'}
          </button>
        </div>

        {/* 创建收藏夹 */}
        {showCreate && (
          <div className="post-form-section" style={{ margin: '0 16px 16px' }}>
            <div className="comment-input-row">
              <input
                type="text"
                className="comment-input"
                placeholder="收藏夹名称"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
                maxLength={20}
              />
              <button
                className="comment-submit"
                onClick={handleCreate}
                disabled={!newName.trim()}
              >
                创建
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-spinner">加载中...</div>
        )}

        {!loading && collections.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">⭐</div>
            <div className="empty-state-title">还没有收藏夹</div>
            <div className="empty-state-desc">点击「+ 新建」创建你的第一个收藏夹</div>
          </div>
        )}

        {!loading && (
          <div className="collection-list">
            {collections.map(c => (
              <div
                key={c.id}
                className="collection-item"
                onClick={() => handleOpenCollection(c)}
              >
                <div className="collection-icon">📁</div>
                <div className="collection-info">
                  <div className="collection-name">{c.name}</div>
                  <div className="collection-count">{c.count} 篇帖子</div>
                </div>
                <div className="collection-actions">
                  {c.name !== '默认' && (
                    <>
                      <button
                        className="collection-action-btn"
                        onClick={(e) => handleRename(e, c)}
                        title="重命名"
                      >
                        ✏️
                      </button>
                      <button
                        className="collection-action-btn"
                        onClick={(e) => handleDeleteCollection(e, c.id)}
                        title="删除"
                      >
                        🗑
                      </button>
                    </>
                  )}
                  <span className="collection-arrow">›</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {toast && <div className="card-toast" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 9999 }}>{toast}</div>}
      </div>
    );
  }

  // ========== 收藏夹帖子视图 ==========
  return (
    <div className="profile-page">
      <div className="sub-page-header">
        <button className="sub-page-back" onClick={handleBackToCollections}>← 返回</button>
        <div className="sub-page-title">{activeCollection?.name || '收藏夹'}</div>
      </div>

      {loading && (
        <>
          <PostCardSkeleton />
          <PostCardSkeleton />
        </>
      )}

      {!loading && posts.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📂</div>
          <div className="empty-state-title">收藏夹是空的</div>
          <div className="empty-state-desc">在帖子下方点击「收藏」添加内容</div>
        </div>
      )}

      {!loading && posts.map(post => (
        <PostCard key={post.id} post={post} onLike={onLike ? () => onLike(post.id) : undefined} />
      ))}
    </div>
  );
}
