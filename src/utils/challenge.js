// 清理挑战积分计算：基础分 + 按食材紧急程度的加成

import { CHALLENGE_POINTS, CHALLENGE_URGENCY_TIERS } from '@/constants'

// 根据剩余保质期天数（负数表示已过期天数）计算挑战奖励
// 返回 { points, bonus, label }：总积分、紧急度加成、积分来源说明
export function challengeReward(remain) {
  const tier = CHALLENGE_URGENCY_TIERS.find((t) => remain >= t.minRemain)
  return {
    points: CHALLENGE_POINTS + tier.bonus,
    bonus: tier.bonus,
    label: tier.label,
  }
}
