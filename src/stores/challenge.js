import { defineStore } from 'pinia'
import { read, write } from '@/utils/storage'
import { uid } from '@/utils/id'
import { useUserStore } from './user'
import { challengePoints } from '@/utils/challenge'

const KEY = 'challenges'

export const useChallengeStore = defineStore('challenge', {
  state: () => ({
    completed: read(KEY, []),
    // [{ id, ingredientId, ingredientName, dishName, points, pointsReason, pointsLevel, remain, date }]
  }),

  getters: {
    challengeCount: (state) => state.completed.length,
    // 已完成挑战的食材 id 集合（用于判断是否还能挑战）
    completedIngredientIds() {
      return new Set(this.completed.map((c) => c.ingredientId))
    },
  },

  actions: {
    persist() {
      write(KEY, this.completed)
    },

    // remain：完成时该食材的剩余保质期天数（负数=已过期天数），用于确定积分档位
    complete({ ingredientId, ingredientName, dishName, remain }) {
      const user = useUserStore()
      const reward = challengePoints(remain)
      const record = {
        id: uid('ch'),
        ingredientId,
        ingredientName,
        dishName,
        points: reward.points,
        pointsReason: reward.reason,
        pointsLevel: reward.level,
        remain: Number.isNaN(Number(remain)) ? null : Number(remain),
        date: new Date().toISOString(),
      }
      this.completed.unshift(record)
      user.addPoints(reward.points)
      this.persist()
      return record
    },
  },
})
