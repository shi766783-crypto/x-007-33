<script setup>
import { reactive, computed } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import { useChallengeStore } from '@/stores/challenge'
import { useMealPlanStore } from '@/stores/mealPlan'
import { useUserStore } from '@/stores/user'
import { CHALLENGE_POINT_TIERS, challengePoints } from '@/utils/challenge'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseEmpty from '@/components/common/BaseEmpty.vue'
import { expiryDateKey } from '@/utils/date'

const inventory = useInventoryStore()
const challenge = useChallengeStore()
const mealPlan = useMealPlanStore()
const user = useUserStore()

// 每个食材对应的“要做的菜”输入（动态 key，需用 reactive）
const pickedDish = reactive({})

// 可挑战食材 = 临期 + 过期，越紧急越靠前
const candidates = computed(() =>
  [...inventory.nearExpiryItems, ...inventory.expiredItems].sort((a, b) => a.remain - b.remain),
)

// 奖励档位（按紧急程度从低到高，用于规则说明）
const rewardTiers = CHALLENGE_POINT_TIERS

// 食材当前可获得的奖励
function rewardOf(item) {
  return challengePoints(item.remain)
}

// 历史记录的积分来源（兼容旧记录：没有档位信息时只显示积分）
function rewardLabel(record) {
  return record.pointsReason || '清理奖励'
}

function complete(item) {
  const dishName = pickedDish[item.id]
  if (!dishName || !dishName.trim()) {
    alert('请先选择或输入要做的菜')
    return
  }
  challenge.complete({
    ingredientId: item.id,
    ingredientName: item.name,
    dishName: dishName.trim(),
    remain: item.remain,
  })
  delete pickedDish[item.id]
}

function fmt(iso) {
  const d = new Date(iso)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}
</script>

<template>
  <div>
    <div class="page-head">
      <h2>🧹 冰箱清理挑战</h2>
      <span class="points-chip">⭐ 当前积分 {{ user.points }}</span>
    </div>

    <p class="muted">
      选择临期/过期食材，做一道菜吃掉它即可打卡。奖励按紧急程度计算：
      <b>越临近过期、或过期越久，积分越高</b>。
    </p>

    <div class="reward-rules card">
      <span class="rules-title">🏅 积分规则</span>
      <span v-for="t in rewardTiers" :key="t.reason" class="rule-item">
        <span class="pts-badge" :class="`lv-${t.level}`">{{ t.points }}分</span>
        {{ t.reason }}
      </span>
    </div>

    <BaseEmpty v-if="!candidates.length" emoji="🧊" text="没有需要清理的临期/过期食材，冰箱很干净！" />

    <div v-else class="grid grid-2">
      <div v-for="item in candidates" :key="item.id" class="challenge card">
        <div class="ch-head">
          <span class="emoji">🍲</span>
          <div class="info">
            <div class="name-row">
              <span class="name">{{ item.name }}</span>
              <span class="pts-badge" :class="`lv-${rewardOf(item).level}`">
                +{{ rewardOf(item).points }}积分
              </span>
            </div>
            <div class="muted small">
              {{ item.quantity }}{{ item.unit }} · 过期日 {{ expiryDateKey(item.purchaseDate, item.shelfLifeDays) }}
              ·
              <span :style="{ color: item.status === 'expired' ? '#ef5350' : '#ff9800' }">
                {{ item.status === 'expired' ? `已过期 ${Math.abs(item.remain)} 天` : `剩 ${item.remain} 天` }}
              </span>
            </div>
          </div>
        </div>

        <template v-if="!challenge.completedIngredientIds.has(item.id)">
          <div class="dish-pick">
            <select v-model="pickedDish[item.id]">
              <option value="">选择要做的菜…</option>
              <option v-for="d in mealPlan.dishes" :key="d.id" :value="d.name">{{ d.name }}</option>
            </select>
            <input v-model="pickedDish[item.id]" type="text" placeholder="或输入新菜名" />
          </div>
          <BaseButton block @click="complete(item)">
            ✅ 完成打卡 +{{ rewardOf(item).points }}积分
          </BaseButton>
        </template>
        <div v-else class="done">🎉 已清理</div>
      </div>
    </div>

    <div v-if="challenge.completed.length" class="card">
      <div class="section-title">清理记录</div>
      <div class="records">
        <div v-for="c in challenge.completed" :key="c.id" class="rec">
          <span class="rec-main">
            🧹 {{ c.ingredientName }} → 做了「{{ c.dishName }}」
            <span class="src-badge" :class="c.pointsLevel ? `lv-${c.pointsLevel}` : ''">
              积分来源：{{ rewardLabel(c) }}
            </span>
          </span>
          <span class="muted small">{{ fmt(c.date) }} · +{{ c.points }}积分</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.page-head h2 {
  margin: 0;
}
.points-chip {
  background: var(--warn-light);
  color: var(--warn);
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 600;
}
.reward-rules {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
  padding: 12px 16px;
  margin: 12px 0;
}
.rules-title {
  font-weight: 600;
}
.rule-item {
  font-size: 13px;
  color: var(--text-secondary, #666);
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.pts-badge {
  display: inline-block;
  padding: 2px 9px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}
.pts-badge.lv-low {
  background: #fff3e0;
  color: #ef6c00;
}
.pts-badge.lv-medium {
  background: #fff8e1;
  color: #f9a825;
}
.pts-badge.lv-high {
  background: #ffebee;
  color: #e53935;
}
.pts-badge.lv-urgent {
  background: #fce4ec;
  color: #c2185b;
}
.challenge {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ch-head {
  display: flex;
  gap: 12px;
  align-items: center;
}
.ch-head .emoji {
  font-size: 32px;
}
.name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.info .name {
  font-weight: 600;
}
.small {
  font-size: 12px;
}
.dish-pick {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dish-pick select,
.dish-pick input {
  padding: 9px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
}
.done {
  text-align: center;
  padding: 12px;
  background: var(--primary-light);
  border-radius: 8px;
  font-weight: 600;
  color: var(--primary-dark);
}
.records {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.rec {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
}
.rec:last-child {
  border-bottom: none;
}
.rec-main {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}
.src-badge {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 10px;
  font-size: 11px;
  background: var(--border);
  color: #555;
}
.src-badge.lv-low {
  background: #fff3e0;
  color: #ef6c00;
}
.src-badge.lv-medium {
  background: #fff8e1;
  color: #f9a825;
}
.src-badge.lv-high {
  background: #ffebee;
  color: #e53935;
}
.src-badge.lv-urgent {
  background: #fce4ec;
  color: #c2185b;
}
</style>
