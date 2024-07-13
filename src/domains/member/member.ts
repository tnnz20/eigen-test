export type MemberResponse = {
    id: number;
    code: string;
    name: string;
    borrowed_books?: number;
    created_at: number;
    updated_at: number;
};

export type CreateMemberRequest = {
    code: string;
    name: string;
};

export type GetMembersRequest = {
    code?: string;
    name?: string;
    page: number;
    size: number;
};
