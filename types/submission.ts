export type Submission = {
    dueDate: string;
    eventDate: string;
    eventImageLink: string;
    eventName: string;
    isFightTitled: boolean;
    offerId: string;
    fighterStateApprove: string;
    typeOfSubmission: string;
    formattedName: string;
    statusFighter: string;
    closedReason?: string;
    fighterId: string;
};

export type SubmissionTabType = 'Active' | 'Inactive';