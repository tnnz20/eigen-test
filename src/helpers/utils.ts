export function isOverdue(borrowDate: number): boolean {
    const currentDate = new Date().getTime();
    const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    return currentDate - borrowDate >= sevenDaysInMilliseconds;
}

export function calculatePenaltyExpirationDate(days: number = 3): number {
    const currentDate = new Date().getTime();
    const daysInMilliseconds = days * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    return currentDate + daysInMilliseconds;
}
