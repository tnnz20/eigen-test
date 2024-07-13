export type MemberResponse = {
    id: number
    code: string
    name: string
    created_at: number
    updated_at: number
}

export type CreateMemberRequest = {
    code: string
    name: string
}
