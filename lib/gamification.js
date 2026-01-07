/**
 * Gamification System - XP, Level, and Badges
 */

// ========== XP CALCULATION ==========

/**
 * Calculate XP earned based on scan confidence
 * Range: 10-25 XP
 * - 90-100% confidence: 20-25 XP
 * - 70-89% confidence: 15-20 XP
 * - 50-69% confidence: 10-15 XP
 * - Below 50%: 10 XP (minimum)
 */
export function calculateXPFromConfidence(confidence) {
  // Confidence should be in decimal format (0.0 - 1.0)
  const confidencePercent = confidence * 100

  if (confidencePercent >= 90) {
    // High confidence: 20-25 XP
    return Math.floor(20 + (confidencePercent - 90) / 2)
  } else if (confidencePercent >= 70) {
    // Medium-high confidence: 15-20 XP
    return Math.floor(15 + (confidencePercent - 70) / 4)
  } else if (confidencePercent >= 50) {
    // Medium confidence: 10-15 XP
    return Math.floor(10 + (confidencePercent - 50) / 4)
  } else {
    // Low confidence: minimum 10 XP
    return 10
  }
}

// ========== LEVEL SYSTEM ==========

/**
 * Calculate level from total XP
 * Level formula: level = floor(sqrt(totalXP / 50)) + 1
 *
 * Level progression:
 * - Level 1: 0-49 XP
 * - Level 2: 50-199 XP
 * - Level 3: 200-449 XP
 * - Level 4: 450-799 XP
 * - Level 5: 800-1249 XP
 * - Level 10: 4500-4999 XP
 * - Level 20: 19000-19999 XP
 */
export function calculateLevel(totalXP) {
  return Math.floor(Math.sqrt(totalXP / 50)) + 1
}

/**
 * Calculate XP required for next level
 */
export function getXPForNextLevel(currentLevel) {
  return currentLevel * currentLevel * 50
}

/**
 * Calculate XP required for current level (start of level)
 */
export function getXPForCurrentLevel(currentLevel) {
  if (currentLevel <= 1) return 0
  return (currentLevel - 1) * (currentLevel - 1) * 50
}

/**
 * Get XP progress in current level
 */
export function getXPProgress(totalXP, currentLevel) {
  const currentLevelXP = getXPForCurrentLevel(currentLevel)
  const nextLevelXP = getXPForNextLevel(currentLevel)
  const xpInLevel = totalXP - currentLevelXP
  const xpNeeded = nextLevelXP - currentLevelXP

  return {
    xpInLevel,
    xpNeeded,
    percentage: Math.floor((xpInLevel / xpNeeded) * 100),
  }
}

// ========== BADGES SYSTEM ==========

/**
 * Badge definitions with unlock conditions
 */
export const BADGES = {
  // Scan count badges
  FIRST_SCAN: {
    id: "first_scan",
    name: "First Scan",
    description: "Selesaikan scan pertama kamu",
    icon: "🎯",
    condition: stats => stats.totalScans >= 1,
  },
  SCAN_10: {
    id: "scan_10",
    name: "Scanner Novice",
    description: "Selesaikan 10 scan",
    icon: "📸",
    condition: stats => stats.totalScans >= 10,
  },
  SCAN_50: {
    id: "scan_50",
    name: "Scanner Expert",
    description: "Selesaikan 50 scan",
    icon: "📷",
    condition: stats => stats.totalScans >= 50,
  },
  SCAN_100: {
    id: "scan_100",
    name: "Scanner Master",
    description: "Selesaikan 100 scan",
    icon: "🎥",
    condition: stats => stats.totalScans >= 100,
  },

  // Level badges
  LEVEL_5: {
    id: "level_5",
    name: "Eco Starter",
    description: "Capai Level 5",
    icon: "🌱",
    condition: stats => stats.level >= 5,
  },
  LEVEL_10: {
    id: "level_10",
    name: "Eco Warrior",
    description: "Capai Level 10",
    icon: "🌿",
    condition: stats => stats.level >= 10,
  },
  LEVEL_20: {
    id: "level_20",
    name: "Eco Champion",
    description: "Capai Level 20",
    icon: "🌳",
    condition: stats => stats.level >= 20,
  },

  // Confidence badges
  HIGH_CONFIDENCE: {
    id: "high_confidence",
    name: "Sharp Eye",
    description: "Dapatkan confidence 95%+",
    icon: "👁️",
    condition: stats => stats.highestConfidence >= 0.95,
  },
  PERFECT_SCAN: {
    id: "perfect_scan",
    name: "Perfect Scanner",
    description: "Dapatkan confidence 100%",
    icon: "💯",
    condition: stats => stats.highestConfidence >= 1.0,
  },

  // Waste type diversity badges
  WASTE_EXPLORER: {
    id: "waste_explorer",
    name: "Waste Explorer",
    description: "Scan 3 jenis sampah berbeda",
    icon: "🗺️",
    condition: stats => stats.wasteTypesScanned >= 3,
  },
  WASTE_MASTER: {
    id: "waste_master",
    name: "Waste Master",
    description: "Scan semua jenis sampah (6 jenis)",
    icon: "🏆",
    condition: stats => stats.wasteTypesScanned >= 6,
  },

  // Streak badges
  STREAK_7: {
    id: "streak_7",
    name: "Week Warrior",
    description: "Scan selama 7 hari berturut-turut",
    icon: "🔥",
    condition: stats => stats.streak >= 7,
  },
  STREAK_30: {
    id: "streak_30",
    name: "Month Master",
    description: "Scan selama 30 hari berturut-turut",
    icon: "⚡",
    condition: stats => stats.streak >= 30,
  },

  // Special badges
  ECO_HERO: {
    id: "eco_hero",
    name: "Eco Hero",
    description: "Capai 5000 total XP",
    icon: "🦸",
    condition: stats => stats.totalXP >= 5000,
  },
}

/**
 * Check which new badges should be unlocked
 * @param {Object} userStats - Current user statistics
 * @param {Array} currentBadges - Array of badge IDs user already has
 * @returns {Array} Array of newly unlocked badge IDs
 */
export function checkNewBadges(userStats, currentBadges = []) {
  const newBadges = []

  for (const [key, badge] of Object.entries(BADGES)) {
    // Skip if user already has this badge
    if (currentBadges.includes(badge.id)) {
      continue
    }

    // Check if condition is met
    if (badge.condition(userStats)) {
      newBadges.push(badge.id)
    }
  }

  return newBadges
}

/**
 * Get badge details by ID
 */
export function getBadgeDetails(badgeId) {
  const badge = Object.values(BADGES).find(b => b.id === badgeId)
  return badge || null
}

/**
 * Get all badges with locked/unlocked status
 */
export function getAllBadgesWithStatus(userBadges = []) {
  return Object.values(BADGES).map(badge => ({
    ...badge,
    unlocked: userBadges.includes(badge.id),
  }))
}
