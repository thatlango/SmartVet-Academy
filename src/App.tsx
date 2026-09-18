import { Link, Navigate, Route, Routes } from "react-router-dom";
import { LogOut } from "lucide-react";
import { SmartVetLogo } from "@/components/SmartVetLogo";
import { useAuth } from "@/lib/auth";
import Home from "@/pages/Home";
import AuthPage from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import ModulePage from "@/pages/Module";
import QuizPage from "@/pages/Quiz";
import CertificatePage from "@/pages/Certificate";
import VerifyPage from "@/pages/Verify";

function Layout(){
 const{user,loading,signOut}=useAuth();
 return <div className="flex min-h-screen flex-col"><header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
  <Link to="/"><SmartVetLogo className="h-12 w-auto sm:h-14"/></Link>
  <nav className="flex items-center gap-3 text-sm font-semibold">
   <Link className="hidden text-muted-foreground hover:text-foreground sm:inline" to="/">Courses</Link>
   <Link className="hidden text-muted-foreground hover:text-foreground sm:inline" to="/verify">Verify certificate</Link>
   {!loading&&user?<><Link className="rounded-lg border border-border bg-card px-3 py-2" to="/dashboard">My learning</Link><button onClick={()=>void signOut()} className="rounded-lg p-2 text-muted-foreground"><LogOut className="size-4"/></button></>:!loading?<Link className="rounded-lg bg-primary px-4 py-2 text-primary-foreground" to="/auth">Sign in</Link>:<span className="h-9 w-20 animate-pulse rounded-lg bg-muted"/>}
  </nav>
 </div></header><main className="flex-1"><Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/auth" element={<AuthPage/>}/>
  <Route path="/dashboard" element={<Dashboard/>}/>
  <Route path="/course/:courseId/module/:moduleId" element={<ModulePage/>}/>
  <Route path="/quiz" element={<QuizPage/>}/>
  <Route path="/certificate" element={<CertificatePage/>}/>
  <Route path="/verify" element={<VerifyPage/>}/>
  <Route path="*" element={<Navigate to="/" replace/>}/>
 </Routes></main><footer className="border-t border-border bg-card"><div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6"><p>© 2026 SmartVet Africa Academy · Smart Vet Africa</p><Link className="font-medium text-primary" to="/verify">Verify a certificate</Link></div></footer></div>;
}
export default function App(){return <Layout/>;}
