// 全局常量定义：类别、单位、存放位置、难度、餐次、星期等

export const CATEGORIES = ['蔬菜', '肉类', '水产', '蛋奶', '主食', '调料', '干货', '其他']

export const CATEGORY_ICONS = {
  蔬菜: '🥬',
  肉类: '🥩',
  水产: '🐟',
  蛋奶: '🥚',
  主食: '🍚',
  调料: '🧂',
  干货: '🍄',
  其他: '📦',
}

export const CATEGORY_COLORS = {
  蔬菜: '#4caf50',
  肉类: '#ef5350',
  水产: '#2196f3',
  蛋奶: '#ffb300',
  主食: '#8d6e63',
  调料: '#7e57c2',
  干货: '#a1887f',
  其他: '#90a4ae',
}

export const UNITS = ['克', '千克', '毫升', '升', '个', '瓶', '袋', '盒', '把', '根', '颗', '勺', '块', '片']

export const LOCATIONS = ['冷藏', '冷冻', '常温']

export const LOCATION_ICONS = {
  冷藏: '❄️',
  冷冻: '🧊',
  常温: '🌡️',
}

export const DIFFICULTIES = ['简单', '中等', '困难']

export const DIFFICULTY_COLORS = {
  简单: '#4caf50',
  中等: '#ff9800',
  困难: '#ef5350',
}

export const MEALS = ['早餐', '午餐', '晚餐']

export const MEAL_ICONS = {
  早餐: '🌅',
  午餐: '☀️',
  晚餐: '🌙',
}

// 星期顺序（周一至周日）
export const WEEK_DAYS = [
  { key: 'monday', label: '周一' },
  { key: 'tuesday', label: '周二' },
  { key: 'wednesday', label: '周三' },
  { key: 'thursday', label: '周四' },
  { key: 'friday', label: '周五' },
  { key: 'saturday', label: '周六' },
  { key: 'sunday', label: '周日' },
]

// 菜品类别（用于营养评分）
export const DISH_CATEGORIES = ['蔬菜', '肉类', '水产', '蛋奶', '主食', '干货', '其他']

// 营养食物组
export const FOOD_GROUPS = {
  蛋白质: ['肉类', '水产', '蛋奶', '干货'],
  蔬菜: ['蔬菜'],
  主食: ['主食'],
  其他: ['调料', '其他'],
}

// 保质期预警阈值（天）
export const EXPIRY_WARN_DAYS = 3

// 挑战完成基础积分
export const CHALLENGE_POINTS = 10

// 清理挑战紧急度加成：按剩余保质期天数 remain 分档（remain < 0 表示已过期天数）
// 命中规则：从上到下取第一个 remain >= minRemain 的档位
export const CHALLENGE_URGENCY_TIERS = [
  { minRemain: 2, bonus: 0, label: '临期清理', desc: '剩2-3天' },
  { minRemain: 1, bonus: 5, label: '即将过期', desc: '剩1天' },
  { minRemain: 0, bonus: 10, label: '今日过期', desc: '今天过期' },
  { minRemain: -3, bonus: 15, label: '过期清理', desc: '过期1-3天' },
  { minRemain: -7, bonus: 25, label: '过期一周', desc: '过期4-7天' },
  { minRemain: -Infinity, bonus: 40, label: '过期超一周', desc: '过期8天+' },
]
