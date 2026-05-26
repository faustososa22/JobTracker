import type { Application } from "./Application";
import type { ApplicationStatus } from "./ApplicationStatus";

export interface StatusHistory{
    id: number,
    application?: Application,
    applicationId: number,
    status: ApplicationStatus,
    changedAt: string,
    notes?: string

}