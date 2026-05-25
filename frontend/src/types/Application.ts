import type { ApplicationStatus } from "./ApplicationStatus";
import type { User } from "./User";

export interface Application{
    id: number,
    userId: number,
    user?: User,
    companyName: string,
    jobTitle: string,
    description: string,
    appliedDate: Date,
    lastUpdated: Date,
    status: ApplicationStatus
}