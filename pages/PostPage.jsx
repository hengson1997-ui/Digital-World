import { useState, useEffect } from 'react';
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

export default function PostPage({ onPostSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const { data: categories } = useFetch('/api/categories');
  const displayCategories = categories || defaultCategories;

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setMessage({ text: '请填写标题和内容', type: 'error' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          categoryKey: selectedCategory
        })
      });

      if (res.ok) {
        setMessage({ text: '发布成功！', type: 'success' });
        setTitle('');
        setContent('');
        if (onPostSuccess) {
          setTimeout(() => onPostSuccess(), 1000);
        }
      } else {
        const data = await res.json();
        setMessage({ text: data.error || '发布失败', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: '网络错误，请重试', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="post-page">
      <div className="post-form-title">发布新帖</div>

      <div className="post-form-section">
        <div className="post-form-label">标题</div>
        <input
          type="text"
          className="post-form-input"
          placeholder="一个吸引眼球的标题"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={100}
        />
      </div>

      <div className="post-form-section">
        <div className="post-form-label">内容</div>
        <textarea
          className="post-form-textarea"
          placeholder="分享你想说的内容..."
          value={content}
          onChange={e => setContent(e.target.value)}
          maxLength={5000}
        />
      </div>

      <div className="post-form-section">
        <div className="post-form-label">选择分类</div>
        <div className="category-select">
          {displayCategories.map(cat => (
            <button
              key={cat.key}
              className={`category-select-btn ${selectedCategory === cat.key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <div className={`toast-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <button
        className="submit-post-btn"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? '发布中...' : '发布内容'}
      </button>
    </div>
  );
}
