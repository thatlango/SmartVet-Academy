import { useEffect,useState } from "react";
import { Link,useNavigate,useParams } from "react-router-dom";
import { Award,Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getCourse } from "@/lib/courses";
import { getCompletedModules,recordQuizAttempt } from "@/lib/learning";

export default function QuizPage(){
  const {courseId=""}=useParams();
  const course=getCourse(courseId);
  const{user,loading:authLoading}=useAuth();
  const nav=useNavigate();
  const[done,setDone]=useState<number[]>([]);
  const[loading,setLoading]=useState(true);
  const[answers,setAnswers]=useState<Record<number,number>>({});
  const[result,setResult]=useState<{score:number;total:number;passed:boolean}|null>(null);
  const[busy,setBusy]=useState(false);

  useEffect(()=>{if(!authLoading&&!user)nav("/auth",{replace:true});},[authLoading,user,nav]);
  useEffect(()=>{
    if(user&&course)getCompletedModules(course.id).then(setDone).finally(()=>setLoading(false));
    else if(user&&!course)setLoading(false);
  },[user,course]);

  if(!course)return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-3xl font-semibold">Course not found</h1><Link to="/" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-primary-foreground">View courses</Link></div>;
  if(authLoading||loading)return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="size-7 animate-spin text-primary"/></div>;
  if(done.length<course.modules.length)return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-3xl font-semibold">Assessment locked</h1><p className="mt-3 text-muted-foreground">Complete all {course.modules.length} modules in this pathway first.</p><Link to="/dashboard" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-primary-foreground">Return to learning</Link></div>;

  async function submit(){
    setBusy(true);
    const ordered=course!.quiz.map((_,i)=>answers[i]);
    setResult(await recordQuizAttempt(course!.id,ordered));
    setBusy(false);
  }

  if(result)return <div className="mx-auto max-w-xl px-4 py-20 text-center"><Award className="mx-auto size-12 text-primary"/><h1 className="mt-4 text-4xl font-semibold">{result.passed?"You passed.":"Review and try again."}</h1><p className="mt-3 text-muted-foreground">Score: {result.score}/{result.total}. Pass mark: 75%.</p>{result.passed?<Link to={`/course/${course.id}/certificate`} className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-primary-foreground">Get my certificate</Link>:<button onClick={()=>{setResult(null);setAnswers({})}} className="mt-6 rounded-xl bg-primary px-5 py-3 text-primary-foreground">Retake assessment</button>}</div>;

  return <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6"><Link to="/dashboard" className="text-sm font-semibold text-muted-foreground hover:text-primary">← My learning</Link><p className="mt-8 text-sm font-bold uppercase tracking-[.14em] text-primary">Final assessment</p><h1 className="mt-2 text-4xl font-semibold">{course.title}</h1><p className="mt-3 text-muted-foreground">Answer all questions. Scoring is performed securely by the Academy backend and is specific to this pathway.</p><div className="mt-8 space-y-5">{course.quiz.map((q,qi)=><fieldset key={q.question} className="rounded-2xl border border-border bg-card p-5"><legend className="font-semibold">{qi+1}. {q.question}</legend><div className="mt-4 space-y-2">{q.options.map((o,oi)=><label key={o} className="flex gap-3 rounded-xl border border-border p-3"><input type="radio" name={`q-${qi}`} checked={answers[qi]===oi} onChange={()=>setAnswers(a=>({...a,[qi]:oi}))}/><span>{o}</span></label>)}</div></fieldset>)}</div><button disabled={busy||Object.keys(answers).length!==course.quiz.length} onClick={()=>void submit()} className="mt-7 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:opacity-50">{busy?"Submitting…":"Submit assessment"}</button></div>;
}
