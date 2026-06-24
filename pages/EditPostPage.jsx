import { useState, useEffect, useRef } from 'react';
import useFetch from '../hooks/useFetch';

const defaultCategories = [
  { key: 'general', label: '综合' },
  { key: 'phone', label: '手机' },
  { key: 'computer', label: '电脑' },
  { key: 'headphone', label: '耳机' },
  { key: 'camera', label: '相机' },
  { key: 'smarthome', label: '智能家居' },
  { key: 'game', label: '游戏' },
  { key: 'wear', label: '穿戴' }
];

export default function EditPostPage({ postId, onBack, onSuccess }) {
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const isDirtyRef = useRef(false);

  const { data: categories } = useFetch('/api/categories');
  const displayCategories = categories || defaultCategories;

  // 拉取帖子详情
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || '加载帖子失败');
        }
        const data = await res.json();
        if (cancelled) return;
        setPost(data);
        setTitle(data.title || '');
        setContent(data.content || '');
        setTagsText((data.tags || []).join(' '));
        setSelectedCategory(data.categoryKey || 'general');
      } catch (err) {
        if (!cancelled) setLoadError(err.message);
      } finally {
        if (!cancelled) setLoadingPost(false);
      }
    })();
    return () => { cancelled = true; };
  }, [postId]);

  // 编辑锁：超 72h 不可保存
  const editable = post?.canEdit !== false;

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  // 离开提示
  useEffect(() => {
    if (!isDirtyRef.current) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  });

  const handleSubmit = async () => {
    if (!editable) return;
    if (!title.trim() || !content.trim()) {
      setMessage({ text: '请填写标题和内容', type: 'error' });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const tags = tagsText
        .split(/[\s,，]+/)
        .map(t => t.trim())
        .filter(Boolean);

      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          categoryKey: selectedCategory,
          tags
        })
      });

      if (res.ok) {
        setMessage({ text: '保存成功！', type: 'success' });
        isDirtyRef.current = false;
        if (onSuccess) {
          setTimeout(() => onSuccess(), 800);
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage({ text: data.error || '保存失败', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: '网络错误，请重试', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // 加载中
  if (loadingPost) {
    return (
      <div className="post-page">
        <div className="sub-page-header">
          <button className="sub-page-back" onClick={onBack}>← 返回</button>
          <div className="sub-page-title">编辑帖子</div>
        </div>
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#8e8e93' }}>加载中...</div>
      </div>
    );
  }

  // 加载失败 / 无权限 / 超时
  if (loadError || !post) {
    return (
      <div className="post-page">
        <div className="sub-page-header">
          <button className="sub-page-back" onClick={onBack}>← 返回</button>
          <div className="sub-page-title">编辑帖子</div>
        </div>
        <div className="error-state">
          <div>{loadError || '无法加载帖子'}</div>
          <button className="error-state-btn" onClick={onBack}>返回</button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-page">
      <div className="sub-page-header">
        <button className="sub-page-back" onClick={onBack}>← 返回</button>
        <div className="sub-page-title">编辑帖子</div>
      </div>

      {!editable && (
        <div className="edit-locked-banner">
          该帖已发布超过 72 小时，编辑功能已关闭
        </div>
      )}

      <div className="post-form-section">
        <div className="post-form-label">标题</div>
        <input
          type="text"
          className="post-form-input"
          placeholder="一个吸引眼球的标题"
          value={title}
          onChange={e => { isDirtyRef.current = true; setTitle(e.target.value); }}
          maxLength={100}
          disabled={!editable}
        />
      </div>

      <div className="post-form-section">
        <div className="post-form-label">内容</div>
        <textarea
          className="post-form-textarea"
          placeholder="分享你想说的内容..."
          value={content}
          onChange={e => { isDirtyRef.current = true; setContent(e.target.value); }}
          maxLength={5000}
          disabled={!editable}
        />
      </div>

      <div className="post-form-section">
        <div className="post-form-label">选择分类</div>
        <div className="category-select">
          {displayCategories.map(cat => (
            <button
              key={cat.key}
              className={`category-select-btn ${selectedCategory === cat.key ? 'active' : ''}`}
              onClick={() => { if (editable) { isDirtyRef.current = true; setSelectedCategory(cat.key); } }}
              disabled={!editable}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="post-form-section">
        <div className="post-form-label">标签 <span style={{ color: '#8e8e93', fontWeight: 'normal' }}>（用空格或逗号分隔，最多 8 个）</span></div>
        <input
          type="text"
          className="post-form-input"
          placeholder="例如：iPhone 拍照 体验"
          value={tagsText}
          onChange={e => { isDirtyRef.current = true; setTagsText(e.target.value); }}
          maxLength={200}
          disabled={!editable}
        />
      </div>

      {message && (
        <div className={`toast-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <button
        className="submit-post-btn"
        onClick={handleSubmit}
        disabled={submitting || !editable}
      >
        {submitting ? '保存中...' : '保存修改'}
      </button>
    </div>
  );
}
