// 综合热度算法配置
const WEIGHTS = {
  views: 0.1,
  likes: 1,
  comments: 3,
  favorites: 2,
};

const TIME_DECAY_POWER = 1.2;

function calcHotScore(post, favoriteCount = 0) {
  const now = new Date();
  const createdAt = new Date(post.createdAt);
  const hoursDiff = Math.max(0, (now - createdAt) / (1000 * 60 * 60));

  const timeDecay = Math.pow(1 + hoursDiff, TIME_DECAY_POWER);

  const baseScore =
    (post.viewCount || 0) * WEIGHTS.views +
    (post.likes || 0) * WEIGHTS.likes +
    (post.comments || 0) * WEIGHTS.comments +
    favoriteCount * WEIGHTS.favorites;

  return baseScore / timeDecay;
}

function formatHotValue(score) {
  if (score >= 10000) {
    return (score / 10000).toFixed(1).replace(/\.0$/, '') + '万';
  }
  if (score >= 1000) {
    return (score / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return Math.floor(score).toString();
}

module.exports = {
  calcHotScore,
  formatHotValue,
  WEIGHTS,
};
