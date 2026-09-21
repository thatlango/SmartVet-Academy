import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Award, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { liveCourses, type Course } from "@/lib/courses";
import {
  getCertificate,
  getCompletedModules,
  getCourseState,
  getProfileName,
  hasPassedQuiz,
  type CertificateRecord,
  type CourseState,
} from "@/lib/learning";

type Summary = {
  course: Course;
  state: CourseState | null;
  done: number[];
  passed: boolean;
  cert: CertificateRecord | null;
};

export default function Dashboard(){
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [loading,setLoading]=useState(true);
  const [name,setName]=useState("");
  const [summaries,setSummaries]=useState<Summary[]>([]);

  useEffect(()=>{if(!authLoading&&!user)nav("/auth",{replace:true});},[authLoading,user,nav]);

  useEffect(()=>{
    if(!user)return;
    (async()=>{
      try{
        const n=await getProfileName(user.id);
        setName(n);
        const data=await Promise.all(liveCourses.map(async course=>{
          const [state,done,passed,cert]=await Promise.all([
            getCourseState(course.id),
            getCompletedModules(course.id),
            hasPassedQuiz(course.id),
            getCertificate(course.id),
          ]);
          return {course,state,done,passed,cert};
        }));
        setSummaries(data);
      } finally {
        setLoading(false);
      }
    })();
  },[user]);

  if(authLoading||loading)return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="size-7 animate-spin text-primary"/></div>;
  if(!user)return null;

  return <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <p className="text-sm font-bold uppercase tracking-[.14em] text-primary">My learning</p>
    <h1 className="mt-2 text-4xl font-semibold">Welcome{name ? ", " + name.split(" ")[0] : ""}.</h1>
    <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">Your Broiler, Layer and Croiler progress is tracked separately. Complete any pathway in order and earn its own SmartVet Africa certificate.</p>

    <div className="mt-8 space-y-8">
      {summaries.map(({course,state,done,passed,cert})=>{
        const progress=state?.progress_percent??Math.floor(done.length/course.modules.length*100);
        const complete=done.length===course.modules.length;
        const next=Math.min(done.length+1,course.modules.length);
        const action=cert||passed
          ? {label:"Open certificate",to:`/course/${course.id}/certificate`,icon:<Award className="size-4"/>}
          : complete
            ? {label:"Take final assessment",to:`/course/${course.id}/quiz`,icon:<ArrowRight className="size-4"/>}
            : {label:done.length?"Continue learning":"Start pathway",to:`/course/${course.id}/module/${next}`,icon:<ArrowRight className="size-4"/>};

        return <section key={course.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[.12em] text-primary">{course.level} pathway</p>
              <h2 className="mt-2 text-2xl font-semibold">{course.title}</h2>
              <p className="mt-2 leading-7 text-muted-foreground">{course.tagline}</p>
              <p className="mt-2 text-sm text-muted-foreground">{done.length} of {course.modules.length} modules complete</p>
            </div>
            <strong className="text-3xl text-primary">{progress}%</strong>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{width:`${progress}%`}}/></div>
          <div className="mt-6">
            <Link to={action.to} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">{action.icon}{action.label}</Link>
          </div>

          <ol className="mt-7 grid gap-3 md:grid-cols-2">
            {course.modules.map(m=>{
              const completed=done.includes(m.id);
              const unlocked=completed||m.id===next||complete;
              return <li key={m.id} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${completed?"bg-primary text-primary-foreground":"bg-muted"}`}>{completed?<CheckCircle2 className="size-4"/>:m.id}</span>
                <div className="min-w-0 flex-1"><p className="text-xs text-muted-foreground">{m.stepLabel}</p><p className="truncate text-sm font-semibold">{m.title}</p></div>
                {unlocked?<Link className="text-xs font-semibold text-primary" to={`/course/${course.id}/module/${m.id}`}>{completed?"Review":"Open"}</Link>:<span className="text-xs text-muted-foreground">Locked</span>}
              </li>;
            })}
          </ol>
        </section>;
      })}
    </div>
  </div>;
}
