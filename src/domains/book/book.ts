export type BookResponse = {
    id: number;
    code: string;
    title: string;
    author: string;
    stock: number;
    is_borrowed: boolean;
    created_at: number;
    updated_at: number;
};

export type CreateBookRequest = {
    code: string;
    title: string;
    author: string;
    stock: number;
};
