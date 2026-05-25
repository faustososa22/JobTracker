export const ApplicationStatus = {
    Applied: 0,
    Interviewing: 1,
    Offered: 2,
    Rejected: 3
} as const

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus]