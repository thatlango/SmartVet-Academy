import { api } from "@/lib/api";

export type AdminRole = "owner" | "admin" | "assessor" | "support";

export type AdminSession = {
  id: string;
  coreUserId: string;
  displayName: string | null;
  email: string | null;
  role: AdminRole;
};

export type AdminOverview = {
  learners: number;
  activeAccounts: number;
  active7d: number;
  activeEnrollments: number;
  quizAttempts: number;
  quizPasses: number;
  certificates: number;
  publishedQuestions: number;
};

export type AdminLearner = {
  core_user_id: string;
  full_name: string;
  email: string | null;
  status: "active" | "suspended";
  created_at: string;
  updated_at: string;
  modules_completed: number;
  assessment_attempts: number;
  assessment_passes: number;
  certificates: number;
  enrollments: Array<{ courseId: string; status: "active" | "suspended" | "withdrawn" }>;
};

export type AdminEnrollment = {
  core_user_id: string;
  course_id: string;
  status: "active" | "suspended" | "withdrawn";
  enrolled_at: string;
  updated_at: string;
  full_name: string;
  email: string | null;
};

export type AdminAssessmentQuestion = {
  id: string;
  course_id: string;
  position: number;
  question_text: string;
  options: string[];
  correct_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminCertificate = {
  id: string;
  core_user_id: string;
  course_id: string;
  verification_code: string;
  issued_at: string;
  revoked_at: string | null;
  revocation_reason: string | null;
  full_name: string;
  email: string | null;
};

export type AdminAuditRecord = {
  id: number;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
  full_name: string;
  email: string | null;
};

export const getAdminSession = () => api<AdminSession>("/api/admin/session");
export const getAdminOverview = () => api<AdminOverview>("/api/admin/overview");

export function getAdminLearners(search = "") {
  const params = new URLSearchParams({ limit: "100" });
  if (search.trim()) params.set("search", search.trim());
  return api<AdminLearner[]>(`/api/admin/learners?${params.toString()}`);
}

export function updateLearnerStatus(coreUserId: string, status: AdminLearner["status"]) {
  return api<Pick<AdminLearner, "core_user_id" | "full_name" | "email" | "status">>(
    `/api/admin/learners/${encodeURIComponent(coreUserId)}`,
    { method: "PATCH", body: JSON.stringify({ status }) },
  );
}

export function getAdminEnrollments(courseId = "") {
  const params = new URLSearchParams({ limit: "200" });
  if (courseId) params.set("courseId", courseId);
  return api<AdminEnrollment[]>(`/api/admin/enrollments?${params.toString()}`);
}

export function setAdminEnrollment(
  coreUserId: string,
  courseId: string,
  status: AdminEnrollment["status"],
) {
  return api<AdminEnrollment>(
    `/api/admin/enrollments/${encodeURIComponent(coreUserId)}/${encodeURIComponent(courseId)}`,
    { method: "PUT", body: JSON.stringify({ status }) },
  );
}

export function getAdminAssessment(courseId: string) {
  return api<AdminAssessmentQuestion[]>(
    `/api/admin/assessments?courseId=${encodeURIComponent(courseId)}`,
  );
}

export function createAssessmentQuestion(
  courseId: string,
  payload: { question: string; options: string[]; correctIndex: number; published: boolean },
) {
  return api<AdminAssessmentQuestion>(
    `/api/admin/assessments/${encodeURIComponent(courseId)}/questions`,
    { method: "POST", body: JSON.stringify(payload) },
  );
}

export function updateAssessmentQuestion(
  courseId: string,
  questionId: string,
  payload: { question: string; options: string[]; correctIndex: number; published: boolean },
) {
  return api<AdminAssessmentQuestion>(
    `/api/admin/assessments/${encodeURIComponent(courseId)}/questions/${encodeURIComponent(questionId)}`,
    { method: "PATCH", body: JSON.stringify(payload) },
  );
}

export function deleteAssessmentQuestion(courseId: string, questionId: string) {
  return api<{ deleted: boolean }>(
    `/api/admin/assessments/${encodeURIComponent(courseId)}/questions/${encodeURIComponent(questionId)}`,
    { method: "DELETE", body: "{}" },
  );
}

export function getAdminCertificates(search = "", courseId = "") {
  const params = new URLSearchParams({ limit: "200" });
  if (search.trim()) params.set("search", search.trim());
  if (courseId) params.set("courseId", courseId);
  return api<AdminCertificate[]>(`/api/admin/certificates?${params.toString()}`);
}

export function setCertificateRevoked(certificateId: string, revoked: boolean, reason = "") {
  return api<AdminCertificate>(
    `/api/admin/certificates/${encodeURIComponent(certificateId)}`,
    { method: "PATCH", body: JSON.stringify({ revoked, reason }) },
  );
}

export function getAdminAudit() {
  return api<AdminAuditRecord[]>("/api/admin/audit?limit=100");
}


export type AcademyAdminRecord = {
  core_user_id: string;
  role: AdminRole;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string | null;
};

export type AdminInviteRecord = {
  id: string;
  email: string;
  role: AdminRole;
  expires_at: string;
  created_at: string;
  updated_at?: string;
  accepted_at: string | null;
  revoked_at: string | null;
  invited_by_name: string;
  invited_by_email: string | null;
};

export type AdminDirectory = {
  admins: AcademyAdminRecord[];
  invites: AdminInviteRecord[];
};

export type AdminInviteCreateResult = {
  id: string;
  email: string;
  role: AdminRole;
  expires_at: string;
  created_at: string;
  inviteUrl: string;
  delivery: { delivered: boolean; reason: string | null };
};

export type AdminInvitePreview = {
  email: string;
  role: AdminRole;
  expires_at: string;
};

export const getAdminDirectory = () => api<AdminDirectory>("/api/admin/admins");

export function createAdminInvite(email: string, role: AdminRole) {
  return api<AdminInviteCreateResult>("/api/admin/invites", {
    method: "POST",
    body: JSON.stringify({ email, role }),
  });
}

export function resendAdminInvite(inviteId: string) {
  return api<AdminInviteCreateResult>(`/api/admin/invites/${encodeURIComponent(inviteId)}/resend`, {
    method: "POST",
    body: "{}",
  });
}

export function revokeAdminInvite(inviteId: string) {
  return api<{ revoked: boolean }>(`/api/admin/invites/${encodeURIComponent(inviteId)}`, {
    method: "DELETE",
    body: "{}",
  });
}

export function updateAdminRole(coreUserId: string, role: AdminRole) {
  return api<Pick<AcademyAdminRecord, "core_user_id" | "role" | "created_at" | "updated_at">>(
    `/api/admin/admins/${encodeURIComponent(coreUserId)}`,
    { method: "PATCH", body: JSON.stringify({ role }) },
  );
}

export function removeAdmin(coreUserId: string) {
  return api<{ removed: boolean }>(`/api/admin/admins/${encodeURIComponent(coreUserId)}`, {
    method: "DELETE",
    body: "{}",
  });
}

export function getAdminInvitePreview(token: string) {
  return api<AdminInvitePreview>(`/api/admin-invitations/${encodeURIComponent(token)}`);
}

export function acceptAdminInvite(token: string) {
  return api<{ accepted: boolean; role: AdminRole }>(
    `/api/admin-invitations/${encodeURIComponent(token)}/accept`,
    { method: "POST", body: "{}" },
  );
}
