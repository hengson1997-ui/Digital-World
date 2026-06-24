export default function Header({ activeTab, onTabChange }) {
  const tabs = [
    { key: 'follow', label: '关注' },
    { key: 'recommend', label: '推荐' },
    { key: 'latest', label: '最新' }
  ];

  return (
    <div className="top-nav">
      <div className="top-nav-inner glass">
        <div className="logo">
          <img src="/styles/logo.svg" alt="数界" className="logo-img" />
        </div>
        <div className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`nav-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => onTabChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
