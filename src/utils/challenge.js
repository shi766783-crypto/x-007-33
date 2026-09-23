// 清理挑战积分规则：按食材紧急程度（剩余保质期天数）给不同积分
// remain = 剩余天数（与 inventory 的 remain 一致）：正数=还剩几天，0=今天过期，负数=已过期天数
// 规则：越临近过期、或过期越久，完成奖励越高

// 积分档位（按紧急程度从低到高排列，匹配时取第一个命中的区间）
export const CHALLENGE_POINT_TIERS = [
  { minRemain: 2, maxRemain: Infinity, points: 10, level: 'low', reason: '临期食材' },
  { minRemain: 1, maxRemain: 1, points: 15, level: 'medium', reason: '明天过期' },
  { minRemain: 0, maxRemain: 0, points: 20, level: 'high', reason: '今天过期' },
  { minRemain: -3, maxRemain: -1, points: 25, level: 'high', reason: '过期 1-3 天' },
  { minRemain: -7, maxRemain: -4, points: 30, level: 'urgent', reason: '过期 4-7 天' },
  { minRemain: -Infinity, maxRemain: -8, points: 40, level: 'urgent', reason: '过期超过 7 天' },
]

// 根据剩余天数计算挑战奖励：{ points, level, reason }
export function challengePoints(remain) {
  const r = Number(remain)
  if (Number.isNaN(r)) return CHALLENGE_POINT_TIERS[0]
  return (
    CHALLENGE_POINT_TIERS.find((t) => r >= t.minRemain && r <= t.maxRemain) ||
    CHALLENGE_POINT_TIERS[0]
  )
}
