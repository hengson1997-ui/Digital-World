// 帖子卡片骨架屏 — 加载时展示
export default function PostCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton skeleton-avatar"></div>
        <div>
          <div className="skeleton skeleton-username"></div>
          <div className="skeleton skeleton-meta"></div>
        </div>
      </div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-content"></div>
      <div className="skeleton skeleton-content-short"></div>
      <div className="skeleton-tags">
        <div className="skeleton skeleton-tag"></div>
        <div className="skeleton skeleton-tag"></div>
        <div className="skeleton skeleton-tag"></div>
      </div>
      <div className="skeleton-actions">
        <div className="skeleton skeleton-action"></div>
        <div className="skeleton skeleton-action"></div>
        <div className="skeleton skeleton-action"></div>
      </div>
    </div>
  );
}
