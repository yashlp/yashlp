export const PHOTO_APPROVAL_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type PhotoApprovalStatus =
  (typeof PHOTO_APPROVAL_STATUS)[keyof typeof PHOTO_APPROVAL_STATUS];

export type PhotoApprovalItemType = "incident_photo" | "comment_photo";

export function isApprovedPhotoStatus(status: string | null | undefined): boolean {
  return status === PHOTO_APPROVAL_STATUS.APPROVED;
}

export function sanitizePublicComment<
  T extends {
    photoUrl: string | null;
    photoApprovalStatus: string | null;
    photoReviewedAt?: Date | string | null;
    photoReviewedBy?: string | null;
  },
>(comment: T) {
  return {
    ...comment,
    photoUrl: isApprovedPhotoStatus(comment.photoApprovalStatus) ? comment.photoUrl : null,
    photoApprovalStatus: undefined,
    photoReviewedAt: undefined,
    photoReviewedBy: undefined,
  };
}

export function sanitizePublicIncident<
  T extends {
    photos: { approvalStatus: string }[];
    comments: Parameters<typeof sanitizePublicComment>[0][];
  },
>(incident: T | null) {
  if (!incident) return null;
  return {
    ...incident,
    photos: incident.photos.filter((p) => isApprovedPhotoStatus(p.approvalStatus)),
    comments: incident.comments.map(sanitizePublicComment),
  };
}
