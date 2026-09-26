import { api } from "@/lib/api";

export type CourseState = {
  current_module_id: number;
  progress_percent: number;
  completed_at: string | null;
};

export type CertificateRecord = {
  verification_code: string;
  issued_at: string;
  course_id: string;
};

export type LearningActivityRecord = {
  course_id: string;
  module_id: number;
  completed_at: string;
};

export type DashboardCourseSnapshot = {
  done: number[];
  passed: boolean;
  cert: CertificateRecord | null;
};

export type DashboardSnapshot = {
  full_name: string;
  courses: Record<string, DashboardCourseSnapshot>;
  activity: LearningActivityRecord[];
  generated_at: string;
};

export async function getProfileName(_userId?: string): Promise<string> {
  const profile = await api<{ full_name: string }>("/api/profile");
  return profile.full_name;
}

export async function getCourseState(courseId: string): Promise<CourseState | null> {
  return api<CourseState | null>(`/api/courses/${encodeURIComponent(courseId)}/state`);
}

export async function getCompletedModules(courseId: string): Promise<number[]> {
  return api<number[]>(`/api/courses/${encodeURIComponent(courseId)}/progress`);
}

export async function getLearningActivity(): Promise<LearningActivityRecord[]> {
  return api<LearningActivityRecord[]>("/api/learning/activity");
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  return api<DashboardSnapshot>("/api/learning/dashboard");
}

export type ModuleCheck = {
  module_id: number;
  question: string;
  options: string[];
};

export async function getModuleCheck(courseId: string, moduleId: number): Promise<ModuleCheck> {
  return api<ModuleCheck>(
    `/api/courses/${encodeURIComponent(courseId)}/modules/${moduleId}/check`,
  );
}

export async function submitModuleCheck(courseId: string, moduleId: number, answer: number) {
  return api<{ correct: boolean; module_id: number; progress_percent: number | null; explanation?: string }>(
    `/api/courses/${encodeURIComponent(courseId)}/modules/${moduleId}/complete`,
    { method: "POST", body: JSON.stringify({ answer }) },
  );
}

export type AssessmentQuestion = {
  id: string;
  position: number;
  question: string;
  options: string[];
};

export async function getAssessment(courseId: string): Promise<AssessmentQuestion[]> {
  return api<AssessmentQuestion[]>(`/api/courses/${encodeURIComponent(courseId)}/assessment`);
}

export async function recordQuizAttempt(courseId: string, questions: AssessmentQuestion[], answers: number[]) {
  return api<{ score: number; total: number; passed: boolean }>(
    `/api/courses/${encodeURIComponent(courseId)}/quiz`,
    {
      method: "POST",
      body: JSON.stringify({
        questionIds: questions.map((question) => question.id),
        answers,
      }),
    },
  );
}

export async function hasPassedQuiz(courseId: string): Promise<boolean> {
  const result = await api<{ passed: boolean }>(`/api/courses/${encodeURIComponent(courseId)}/quiz/passed`);
  return result.passed;
}

export async function getCertificate(courseId: string): Promise<CertificateRecord | null> {
  return api<CertificateRecord | null>(`/api/courses/${encodeURIComponent(courseId)}/certificate`);
}

export async function issueCertificate(courseId: string): Promise<CertificateRecord> {
  return api<CertificateRecord>(
    `/api/courses/${encodeURIComponent(courseId)}/certificate`,
    { method: "POST", body: "{}" },
  );
}

export async function verifyCertificate(code: string) {
  return api<{ full_name: string; course_id: string; issued_at: string } | null>(
    `/api/certificates/verify/${encodeURIComponent(code.trim().toUpperCase())}`,
  );
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
