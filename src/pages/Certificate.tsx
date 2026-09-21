import { useEffect,useState } from "react";
import { Link,useNavigate,useParams } from "react-router-dom";
import { Download,Loader2,ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getCourse } from "@/lib/courses";
import { buildCertificatePdf } from "@/lib/certificate-pdf";
import { formatDate,getCertificate,getCompletedModules,getProfileName,hasPassedQuiz,issueCertificate,type CertificateRecord } from "@/lib/learning";

export default function CertificatePage(){
  const {courseId=""}=useParams();
  const course=getCourse(courseId);
  const{user,loading:authLoading}=useAuth();
  const nav=useNavigate();
  const[loading,setLoading]=useState(true);
  const[name,setName]=useState("");
  const[cert,setCert]=useState<CertificateRecord|null>(null);
  const[eligible,setEligible]=useState(false);

  useEffect(()=>{if(!authLoading&&!user)nav("/auth",{replace:true});},[authLoading,user,nav]);
  useEffect(()=>{
    if(!user||!course){if(user&&!course)setLoading(false);return;}
    (async()=>{
      const[n,d,p,c]=await Promise.all([getProfileName(user.id),getCompletedModules(course.id),hasPassedQuiz(course.id),getCertificate(course.id)]);
      setName(n);
      const ok=d.length===course.modules.length&&p;
      setEligible(ok);
      setCert(c??(ok?await issueCertificate(course.id):null));
      setLoading(false);
    })();
  },[user,course]);

  if(!course)return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-3xl font-semibold">Course not found</h1><Link to="/" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-primary-foreground">View courses</Link></div>;
  if(authLoading||loading)return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="size-7 animate-spin text-primary"/></div>;
  if(!cert)return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-3xl font-semibold">Your certificate is not ready yet</h1><p className="mt-3 text-muted-foreground">{eligible?"Please retry shortly.":"Complete all modules and pass this pathway's final assessment first."}</p><Link to="/dashboard" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-primary-foreground">Return to learning</Link></div>;

  const date=formatDate(cert.issued_at);
  function download(){buildCertificatePdf({name,courseTitle:course!.title,hours:course!.hours,date,code:cert!.verification_code}).save(`smartvet-africa-${course!.id}-${cert!.verification_code}.pdf`)}

  return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6"><Link to="/dashboard" className="text-sm font-semibold text-muted-foreground hover:text-primary">← My learning</Link><p className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[.14em] text-primary"><ShieldCheck className="size-4"/>Certificate issued</p><h1 className="mt-2 text-4xl font-semibold">Your SmartVet Africa certificate</h1><div className="mt-8 rounded-3xl border-4 border-double border-primary/40 bg-card p-2 shadow-lg"><div className="texture-grain rounded-2xl border border-gold/40 px-6 py-12 text-center"><img src="/smartvet-logo.svg" className="mx-auto h-16" alt="SmartVet Africa"/><p className="mt-6 text-xs font-bold uppercase tracking-[.24em] text-primary">Certificate of Completion</p><p className="mt-7 text-sm text-muted-foreground">This certifies that</p><p className="mx-auto mt-2 max-w-2xl border-b border-gold/60 pb-3 font-display text-3xl font-semibold">{name}</p><p className="mt-5 text-sm text-muted-foreground">has successfully completed</p><h2 className="mt-2 text-2xl font-semibold text-primary">{course.title}</h2><p className="mt-2 text-sm text-muted-foreground">{course.hours} hours · {course.modules.length} modules</p><p className="mt-3 text-sm text-muted-foreground">Issued {date}</p><div className="mt-7 inline-flex rounded-lg bg-background px-4 py-2 font-mono text-sm">Verification: {cert.verification_code}</div></div></div><div className="mt-6 flex gap-3"><button onClick={download} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"><Download className="size-4"/>Download PDF</button><Link to="/verify" className="rounded-xl border border-border bg-card px-5 py-3 font-semibold">Verify certificate</Link></div></div>;
}
