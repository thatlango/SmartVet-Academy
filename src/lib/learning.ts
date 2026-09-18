import { supabase } from "@/integrations/supabase/client";
export type CourseState={current_module_id:number;progress_percent:number;completed_at:string|null};
export type CertificateRecord={verification_code:string;issued_at:string;course_id:string};
export async function ensureProfile(userId:string,fullName:string){const name=fullName.trim();if(!name)return;const{error}=await supabase.from("profiles").upsert({user_id:userId,full_name:name},{onConflict:"user_id"});if(error)throw error;}
export async function getProfileName(userId:string){const{data,error}=await supabase.from("profiles").select("full_name").eq("user_id",userId).maybeSingle();if(error)throw error;return data?.full_name??"";}
export async function getCourseState(courseId:string):Promise<CourseState|null>{const{data,error}=await supabase.from("course_state").select("current_module_id,progress_percent,completed_at").eq("course_id",courseId).maybeSingle();if(error)throw error;return data;}
export async function getCompletedModules(courseId:string){const{data,error}=await supabase.from("learner_progress").select("module_id").eq("course_id",courseId).order("module_id");if(error)throw error;return(data??[]).map(r=>r.module_id);}
export async function completeModule(courseId:string,moduleId:number){const{data,error}=await supabase.rpc("complete_module",{_course_id:courseId,_module_id:moduleId});if(error)throw error;return data;}
export async function recordQuizAttempt(courseId:string,answers:number[]){const{data,error}=await supabase.rpc("record_quiz_attempt",{_course_id:courseId,_answers:answers});if(error)throw error;return data as {score:number;total:number;passed:boolean};}
export async function hasPassedQuiz(courseId:string){const{data,error}=await supabase.from("quiz_attempts").select("id").eq("course_id",courseId).eq("passed",true).limit(1);if(error)throw error;return(data??[]).length>0;}
export async function getCertificate(courseId:string):Promise<CertificateRecord|null>{const{data,error}=await supabase.from("certificates").select("verification_code,issued_at,course_id").eq("course_id",courseId).maybeSingle();if(error)throw error;return data;}
export async function issueCertificate(courseId:string):Promise<CertificateRecord>{const{data,error}=await supabase.rpc("issue_certificate",{_course_id:courseId});if(error)throw error;return data as unknown as CertificateRecord;}
export async function verifyCertificate(code:string){const{data,error}=await supabase.rpc("verify_certificate",{_code:code});if(error)throw error;const rows=(data??[]) as {full_name:string;course_id:string;issued_at:string}[];return rows[0]??null;}
export const formatDate=(iso:string)=>new Date(iso).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
