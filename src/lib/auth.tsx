import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Value={user:User|null;session:Session|null;loading:boolean;signOut:()=>Promise<void>};
const Context=createContext<Value>({user:null,session:null,loading:true,signOut:async()=>{}});

export function AuthProvider({children}:{children:ReactNode}){
  const[session,setSession]=useState<Session|null>(null);
  const[loading,setLoading]=useState(true);
  useEffect(()=>{
    let active=true;
    supabase.auth.getSession().then(({data})=>{if(active){setSession(data.session);setLoading(false);}});
    const{subscriptions}= {subscriptions:null};
    const{data}=supabase.auth.onAuthStateChange((_event,next)=>{if(active){setSession(next);setLoading(false);}});
    return()=>{active=false;data.subscription.unsubscribe();void subscriptions;};
  },[]);
  const value=useMemo<Value>(()=>({session,user:session?.user??null,loading,signOut:async()=>{const{error}=await supabase.auth.signOut();if(error)throw error;}}),[session,loading]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useAuth=()=>useContext(Context);
