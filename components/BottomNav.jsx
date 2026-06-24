export default function BottomNav({ activePage, onPageChange }) {
  const pages = [
    { key: 'home', label: '首页' },
    { key: 'messages', label: '消息' },
    { key: 'post', label: '发帖' },
    { key: 'search', label: '热搜' },
    { key: 'profile', label: '我的' }
  ];

  const renderIcon = (key) => {
    if (key === 'post') {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
    }
    if (key === 'search') {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
      );
    }
    const icons = {
      home: '⌂',
      messages: '✉',
      profile: '☺'
    };
    return icons[key] || '';
  };

  return (
    <nav className="bottom-nav">
      {pages.map(p => (
        <button
          key={p.key}
          className={`nav-item ${activePage === p.key ? 'active' : ''}`}
          onClick={() => onPageChange(p.key)}
        >
          <span className="nav-item-icon">{renderIcon(p.key)}</span>
          <span className="nav-item-label">{p.label}</span>
        </button>
      ))}
    </nav>
  );
}
