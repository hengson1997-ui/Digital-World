import { useState, useEffect } from 'react';

const gradientOptions = [
  'linear-gradient(135deg, #af52de, #5856d6)',
  'linear-gradient(135deg, #ff6b9d, #c06eff)',
  'linear-gradient(135deg, #5ac8fa, #007aff)',
  'linear-gradient(135deg, #ffcc00, #ff9500)',
  'linear-gradient(135deg, #34c759, #30d158)',
  'linear-gradient(135deg, #ff2d55, #ff3b30)',
  'linear-gradient(135deg, #5856d6, #007aff)',
  'linear-gradient(135deg, #ff9500, #ffcc00)'
];

export default function SettingsPage({ onBack, profile }) {
  const [avatar, setAvatar] = useState(profile?.avatar || '数');
  const [gradient, setGradient] = useState(profile?.avatarGradient || gradientOptions[0]);
  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 2000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleSave = async () => {
    if (!name.trim()) {
      setToast('名称不能为空');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avatar: avatar.trim() || '数',
          avatarGradient: gradient,
          name: name.trim(),
          bio: bio.trim()
        })
      });
      if (res.ok) {
        setToast('保存成功');
      } else {
        setToast('保存失败');
      }
    } catch {
      setToast('网络错误');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="sub-page-header">
        <button className="sub-page-back" onClick={onBack}>← 返回</button>
        <div className="sub-page-title">个人设置</div>
      </div>

      {/* 头像预览 */}
      <div className="settings-avatar-preview">
        <div
          className="profile-avatar"
          style={{ background: gradient, width: '80px', height: '80px', fontSize: '32px', margin: '0 auto 16px' }}
        >
          {avatar || '数'}
        </div>
        <div style={{ fontSize: '13px', color: '#8e8e93' }}>头像预览</div>
      </div>

      {/* 头像字符 */}
      <div className="post-form-section">
        <div className="post-form-label">头像字符 <span style={{ color: '#8e8e93', fontWeight: 400 }}>（建议单个字或 emoji）</span></div>
        <input
          type="text"
          className="post-form-input"
          value={avatar}
          onChange={e => setAvatar(e.target.value)}
          maxLength={4}
          placeholder="数"
        />
      </div>

      {/* 渐变色选择 */}
      <div className="post-form-section">
        <div className="post-form-label">头像背景色</div>
        <div className="gradient-picker">
          {gradientOptions.map(g => (
            <div
              key={g}
              className={`gradient-option ${gradient === g ? 'active' : ''}`}
              style={{ background: g }}
              onClick={() => setGradient(g)}
            />
          ))}
        </div>
      </div>

      {/* 用户 ID（只读） */}
      <div className="post-form-section">
        <div className="post-form-label">用户 ID</div>
        <input
          type="text"
          className="post-form-input"
          value={profile?.id || 1}
          disabled
          style={{ opacity: 0.5, cursor: 'not-allowed' }}
        />
      </div>

      {/* 名称 */}
      <div className="post-form-section">
        <div className="post-form-label">昵称</div>
        <input
          type="text"
          className="post-form-input"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={20}
          placeholder="你的昵称"
        />
      </div>

      {/* 个性签名 */}
      <div className="post-form-section">
        <div className="post-form-label">个性签名</div>
        <textarea
          className="post-form-textarea"
          value={bio}
          onChange={e => setBio(e.target.value)}
          maxLength={100}
          placeholder="写一句介绍自己吧..."
          style={{ minHeight: '80px' }}
        />
      </div>

      {toast && (
        <div className={`toast-message ${toast.includes('成功') ? 'success' : 'error'}`}>
          {toast}
        </div>
      )}

      <button
        className="submit-post-btn"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? '保存中...' : '保存设置'}
      </button>
    </div>
  );
}
