import useFetch from '../hooks/useFetch';

// 默认分类数据，用于加载中或 API 失败时显示
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

export default function CategoryBar({ activeCategory, onCategoryChange }) {
  const { data: categories, loading, error } = useFetch('/api/categories');

  // 使用 API 数据，加载中或失败时使用默认数据
  const displayCategories = categories || defaultCategories;

  return (
    <div className="category-bar">
      {displayCategories.map(cat => (
        <button
          key={cat.key}
          className={`category-tag glass ${activeCategory === cat.key ? 'active' : ''}`}
          onClick={() => onCategoryChange(cat.key)}
        >
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
