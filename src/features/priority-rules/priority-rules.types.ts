export interface PriorityRule {
  id: string
  name: string
  priorityLevel: number
  description: string | null
}

export interface CreatePriorityRuleInput {
  name: string
  priorityLevel: number
  description?: string | null
}

export interface UpdatePriorityRuleInput {
  name: string
  priorityLevel: number
  description?: string | null
}
