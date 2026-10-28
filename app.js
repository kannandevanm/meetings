(function(){
"use strict";
var $=function(s){return document.querySelector(s)};
var esc=function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
var fmt=function(m){m=Math.round(m);var h=Math.floor(m/60),mm=m%60,ap=h>=12?"PM":"AM";h=h%12||12;return h+":"+String(mm).padStart(2,"0")+" "+ap};
var fdist=function(d){return d<1000?Math.round(d)+" m":(d/1000).toFixed(1)+" km"};
var fdur=function(m){var h=Math.floor(m/60),r=m%60;return (h?h+" h ":"")+r+" min"};
var PURPOSES=["Product demo","Onboarding","Escalation","Renewal","Follow-up"];
var CI=[{k:"odo",l:"Odometer Reading (km)",t:"num"},{k:"purpose",l:"Visit Purpose",t:"sel"},{k:"note",l:"Check-In Note",t:"txt"}];
var CO=[{k:"obj",l:"Objective Met",t:"seg"},{k:"odo",l:"Odometer Reading (km)",t:"num"},{k:"note",l:"Check-Out Note",t:"txt"}];

/* mode: tl = time + location, l = location only, t = time only */
var MODS={
 leads:{name:"Leads",one:"Lead",mode:"l",tab:"leads"},
 contacts:{name:"Contacts",one:"Contact",mode:"l",tab:"contacts"},
 deals:{name:"Deals",one:"Deal",mode:"tl",tab:"more"},
 meetings:{name:"Meetings",one:"Meeting",mode:"tl",tab:"more"},
 visits:{name:"Customer Visits",one:"Customer Visit",mode:"tl",tab:"more",custom:true},
 collect:{name:"Collection Visits",one:"Collection Visit",mode:"l",tab:"more",custom:true},
 train:{name:"Training Sessions",one:"Training Session",mode:"t",tab:"more",custom:true}
};
var MODE_L={tl:"Time + location",l:"Location only",t:"Time only"};
var hasTime=function(m){return MODS[m].mode!=="l"};
var hasLoc=function(m){return MODS[m].mode!=="t"};

function seed(){var R=[];
 function add(o){R.push(Object.assign({addrOk:true,dist:3000,ci:null,co:null},o))}
 add({id:"l1",m:"leads",title:"Olivia Sanders",comp:"NexaTech Corp",email:"olivia.sanders@nexatech.com",src:"X (Twitter)",phone:"+91 98765 43210",addr:"14 Cathedral Rd, Gopalapuram, Chennai",dist:240});
 add({id:"l2",m:"leads",title:"Christopher Maclead (Sample)",comp:"Rangoni Of Florence",email:"christopher-maclead@noemail.invalid",src:"Cold Call",phone:"+91 98400 11223",addr:"22 Anna Nagar 2nd Ave, Chennai"});
 add({id:"l3",m:"leads",title:"Carissa Kidman (Sample)",comp:"Oh My Goodknits Inc",email:"carissa-kidman@noemail.invalid",src:"Advertisement",phone:"+91 98410 55667",addr:"9 Velachery Main Rd, Chennai",dist:60,ci:{t:790,d:60,odo:"",purpose:"Follow-up",note:""}});
 add({id:"l4",m:"leads",title:"James Merced (Sample)",comp:"Kwik Kopy Printing",email:"james-merced@noemail.invalid",src:"Web Download",phone:"+91 98420 90011",addr:"31 Mount Rd, Guindy, Chennai",ci:{t:700,d:90,odo:"",purpose:"Follow-up",note:""},co2:null,coRec:{t:730,d:75,obj:"Yes",odo:"",note:"Shared the brochure."}});
 add({id:"l5",m:"leads",title:"Tresa Sweely (Sample)",comp:"Morlong Associates",email:"tresa-sweely@noemail.invalid",src:"Partner",phone:"+91 98430 22110",addr:"5 ECR Rd, Thiruvanmiyur, Chennai"});
 add({id:"c1",m:"contacts",title:"Chris evans Jr",comp:"Greenlight Solutions",email:"chris.evans@greenlight.example",phone:"+91 98765 11122",addr:"7 Poonamallee High Rd, Chennai",dist:310});
 add({id:"c2",m:"contacts",title:"Sage Wieser (Sample)",comp:"Truhlar And Truhlar (Sample)",email:"sage-wieser@noemail.invalid",phone:"+91 98450 33445",addr:"18 Nungambakkam High Rd, Chennai"});
 add({id:"c3",m:"contacts",title:"Rajan Kumar",comp:"Acme Industries",email:"rajan.kumar@acme.example",phone:"+91 98460 77889",addr:"12 Industrial Area, Ambattur, Chennai"});
 add({id:"d1",m:"deals",title:"Benton",amt:"$ 250,000.00",stage:"Qualification",close:"Jun 3, 2025",owner:"Ethan Caldwell",acct:"Benton Group",start:870,end:930,addr:"88 OMR, Sholinganallur, Chennai",dist:240});
 add({id:"d2",m:"deals",title:"VJ HAZARE TROPHY JUICE",amt:"-",stage:"Qualification",close:"Dec 31, 2025",owner:"Ethan Caldwell",acct:"VJ Hazare Juice",start:1000,end:1060,addr:"3 Mount Poonamallee Rd, Porur, Chennai"});
 add({id:"d3",m:"deals",title:"WorkflowPro Deployment – CloudSync Analytics",amt:"$ 42,000.00",stage:"Qualification",close:"Jun 19, 2025",owner:"Ethan Caldwell",acct:"CloudSync Analytics",start:780,end:840,addr:"41 Taramani Rd, Chennai",dist:70,ci:{t:778,d:70,odo:"",purpose:"Follow-up",note:""}});
 add({id:"d4",m:"deals",title:"King",amt:"$ 60,000.00",stage:"Qualification",close:"Jun 5, 2025",owner:"Ethan Caldwell",acct:"King Industries",start:600,end:660,addr:"2 Race Course Rd, Guindy, Chennai",ci:{t:598,d:60,odo:"",purpose:"Follow-up",note:""},coRec:{t:665,d:55,obj:"Yes",odo:"",note:"Terms agreed."}});
 add({id:"m1",m:"meetings",title:"Heli",owner:"Ethan Caldwell",acct:"Greenlight Solutions",start:840,end:870,addr:"Vallancherry, Chengalpattu, Tamil Nadu",dist:240});
 add({id:"m2",m:"meetings",title:"Demo Call Review",owner:"Ethan Caldwell",acct:"Initech Systems",start:660,end:690,addr:"45 ECR Rd, Thiruvanmiyur, Chennai"});
 add({id:"m3",m:"meetings",title:"Weekly Sync",owner:"Ethan Caldwell",acct:"Globex Corp",start:1020,end:1050,addr:"89 Mount Rd, Guindy, Chennai"});
 add({id:"v1",m:"visits",title:"Acme Industries — Quarterly Review",owner:"Vignesh R",acct:"Acme Industries",start:855,end:915,addr:"12 Industrial Area, Ambattur, Chennai",dist:180});
 add({id:"v2",m:"visits",title:"Initech Systems — Product Demo",owner:"Vignesh R",acct:"Initech Systems",start:600,end:660,addr:"45 ECR Rd, Thiruvanmiyur, Chennai"});
 add({id:"v3",m:"visits",title:"Soylent Foods — Onboarding",owner:"Vignesh R",acct:"Soylent Foods",start:780,end:870,addr:"23 Anna Salai, Teynampet, Chennai",dist:60,ci:{t:778,d:60,odo:"142",purpose:"Onboarding",note:""}});
 add({id:"v4",m:"visits",title:"Globex Corp — Escalation Visit",owner:"Vignesh R",acct:"Globex Corp",start:990,end:1050,addr:"89 Mount Rd, Guindy, Chennai"});
 add({id:"k1",m:"collect",title:"Documents — Umbrella Retail",owner:"Vignesh R",acct:"Umbrella Retail",addr:"67 Tambaram Main Rd, Chennai",dist:120});
 add({id:"k2",m:"collect",title:"Dues — Soylent Foods",owner:"Vignesh R",acct:"Soylent Foods",addr:"23 Anna Salai, Teynampet, Chennai",dist:60,ci:{t:800,d:60,odo:"",purpose:"Follow-up",note:""}});
 add({id:"t1",m:"train",title:"Advanced Selling — Cohort 12",owner:"Vignesh R",acct:"Acme Industries",start:840,end:930,addr:"Training Hall, Ambattur, Chennai",dist:90});
 R.forEach(function(r){if(r.coRec){r.co=r.coRec;delete r.coRec}delete r.co2;});
 return R}
function cfg0(){return {radius:500,early:60,after:60,allowEmpty:false,popups:true,autoIn:false,autoOut:false,
  ci:{odo:{on:true,req:false},purpose:{on:true,req:true},note:{on:true,req:false}},
  co:{obj:{on:true,req:true},odo:{on:true,req:false},note:{on:true,req:false}}};}
function ui0(){return {mapFull:false,warn:null,snzMenu:false,view:"list",mod:"leads",rec:null,rtab:"overview",sheet:null,sheetRec:null,swipe:null,showActual:false,autoBanner:null,toast:null,lock:null,dialog:null,menu:false,settings:false,form:{},ferr:{},err:null}}
var S={now:810,sel:"m1",net:true,perm:"granted",earlyStyle:"grey",cfg:cfg0(),recs:seed(),log:[],snoozes:[],ui:ui0()};

var byId=function(id){return S.recs.filter(function(v){return v.id===id})[0]};
var cur=function(){return byId(S.sel)};
function status(r){
  if(r.co) return "out";
  if(r.ci) return hasTime(r.m)&&S.now>r.end+S.cfg.after?"missout":"in";
  if(!hasTime(r.m)) return "elig";
  if(S.now>r.end) return "missin";
  if(S.now>=r.start-S.cfg.early) return "elig";
  return "none";
}
function hint(r){
  var s=status(r),t=hasTime(r.m);
  if(s==="none") return {t:"Check-in opens at "+fmt(r.start-S.cfg.early),c:"mut"};
  if(s==="elig") return t?{t:"Check-in open until "+fmt(r.end),c:"mut"}:null;
  if(s==="missin") return {t:"Missed check-in · window closed at "+fmt(r.end),c:"bad"};
  if(s==="missout") return {t:"Missed check-out · window closed at "+fmt(r.end+S.cfg.after),c:"bad"};
  if(s==="in") return t?{t:"Check out by "+fmt(r.end+S.cfg.after),c:"mut"}:null;
  return null;
}
function canRevert(r){return status(r)==="out"&&(!hasTime(r.m)||S.now<=r.end+S.cfg.after)}
function within(r){return hasLoc(r.m)&&r.addrOk&&r.dist<=S.cfg.radius}
/* Check-out is validated too: it opens the same early offset before the check-out field's time (End Time) as check-in does before Start Time */
/* Two approaches for an action that is not open yet, kept side by side for team review: A) greyed button, message on tap; B) enabled button, warning dialog on tap */
function offCls(){return S.earlyStyle==="enabled"?"":" off"}
function coOpensAt(r){return r.end-S.cfg.early}
function coOpen(r){return !hasTime(r.m)||S.now>=coOpensAt(r)}
function log(msg,kind){S.log.unshift({t:fmt(S.now),m:msg,k:kind||"info"});S.log=S.log.slice(0,9)}
var plural=function(n,w){return n+" "+w+(n===1?"":"s")};
/* Comparative readings (PRD 3.7): "On time" only at exactly zero minutes; whole metres below 1000, one decimal above */
function cmpTime(t,ref){
  var d=Math.round(t-ref);if(d===0)return "On time";
  var a=Math.abs(d),h=Math.floor(a/60),m=a%60,s=[];
  if(h)s.push(plural(h,"hour"));if(m)s.push(plural(m,"minute"));
  return s.join(" ")+(d<0?" before":" after");
}
function cmpDist(d){d=Math.round(d);return d<1000?plural(d,"meter")+" away":(d/1000).toFixed(1)+" km away"}
function durP(m){m=Math.max(0,Math.round(m));var h=Math.floor(m/60),r=m%60,s=[];if(h)s.push(h+(h===1?" Hour":" Hours"));if(r||!h)s.push(r+(r===1?" Minute":" Minutes"));return s.join(" ")}
var LABEL={out:"Checked Out",in:"Checked In",missout:"Missed Check-Out",missin:"Missed Check-In",elig:"Not Checked In",none:"Not Checked In"};
var PCLS={out:"p-out",in:"p-in",missout:"p-bad",missin:"p-bad",elig:"p-none",none:"p-none"};
function reqNames(k){return (k==="ci"?CI:CO).filter(function(f){var c=S.cfg[k][f.k];return c.on&&c.req}).map(function(f){return f.l})}

/* ---------- icons ---------- */
var P={
 mail:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.500 7.500l8.500 6 8.500-6"/>',
 pin:'<path d="M12 20.500s6.500-5.500 6.500-10.800a6.500 6.500 0 0 0-13 0C5.500 15 12 20.500 12 20.500z"/><circle cx="12" cy="9.700" r="2.300"/><path d="M8 22.500h8" opacity=".0"/>',
 phone:'<path d="M5.500 4h3.300l1.800 4.500-2.200 1.400a11 11 0 0 0 5.100 5.100l1.400-2.200L19.400 14.600v3.300a2 2 0 0 1-2.200 2A15.500 15.500 0 0 1 3.500 6.200 2 2 0 0 1 5.500 4z"/>',
 convert:'<circle cx="12" cy="9" r="3"/><path d="M6 19c.5-3 3-4.800 6-4.800s5.500 1.800 6 4.800"/><path d="M4 8.500a8.500 8.500 0 0 1 14.500-3M20 15.500a8.500 8.500 0 0 1-14.500 3"/>',
 map:'<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>',
 clone:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"/>',
 bld:'<rect x="5" y="3" width="10" height="18" rx="1"/><path d="M15 9h4v12h-4M8.500 7h3M8.500 11h3M8.500 15h3"/>',
 cam:'<path d="M4 8h3l1.500-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.500"/>',
 search:'<circle cx="11" cy="11" r="6.500"/><path d="M16 16l4.500 4.500"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 sort:'<path d="M4 7h16M7 12h10M10 17h4"/>',
 dots:'<circle cx="12" cy="12" r="9"/><circle cx="8" cy="12" r=".9" fill="currentColor"/><circle cx="12" cy="12" r=".9" fill="currentColor"/><circle cx="16" cy="12" r=".9" fill="currentColor"/>',
 pen:'<path d="M4 20l1-4L16.500 4.500a2 2 0 0 1 3 3L8 19l-4 1z"/>',
 cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
 calok:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4M9 15l2 2 4-4"/>',
 money:'<rect x="3" y="7" width="15" height="10" rx="2"/><circle cx="10.500" cy="12" r="2"/><path d="M21 9v8H8"/>',
 chev:'<path d="M6 9l6 6 6-6"/>', chevr:'<path d="M9 6l6 6-6 6"/>',
 home:'<path d="M4 11l8-7 8 7v9H4zM10 20v-6h4v6"/>',
 target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.500"/><path d="M20 4l-6 6"/>',
 card:'<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="2.500"/><path d="M8 16c.7-2 2.300-2.800 4-2.800s3.300.8 4 2.800"/>',
 bellx:'<path d="M6 17h12l-1.500-2v-4a4.500 4.500 0 0 0-9 0v4L6 17zM10 20h4M4 4l16 16"/>',
 note:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h5"/>',
 clip:'<path d="M20 11l-8 8a5 5 0 0 1-7-7l8-8a3.500 3.500 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7-7"/>',
 person:'<circle cx="12" cy="8" r="3.500"/><path d="M5 20c.8-3.500 3.500-5.500 7-5.500s6.200 2 7 5.500"/>',
 src:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.500"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
 stage:'<circle cx="12" cy="12" r="9"/><path d="M12 12V4.500a7.500 7.500 0 0 1 6.400 3.600z" fill="currentColor"/>',
 flow:'<rect x="3" y="4" width="6" height="5" rx="1.200"/><rect x="14" y="10" width="7" height="5" rx="1.200"/><rect x="14" y="17" width="7" height="4" rx="1.200"/><path d="M6 9v9h8M6 12.500h8"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
 warn:'<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18v.5"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 off:'<path d="M12 22s7-6.200 7-12a7 7 0 0 0-11.500-5.400M5 10c0 3 1.800 6 4 8.400"/><path d="M3 3l18 18"/>',
 up:'<path d="M7 11v9H4v-9h3zM7 11l4-7c2 0 3 1 2.500 3L13 10h6a2 2 0 0 1 2 2.300l-1 6A2 2 0 0 1 18 20H7"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
 flash:'<path d="M8 3h8l-1 6 2 2v10H7V11l2-2-1-6z"/>'
};
function ico(n,s,fill){s=s||20;return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="'+(fill||"none")+'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+P[n]+'</svg>'}

/* ---------- map ---------- */
function mapSVG(dist,R){
  var cx=170,cy=78,r=42,p=dist<=R?dist/R*r:r+Math.min((dist-R)/R*26,70);
  var ux=cx-Math.cos(.4)*p,uy=cy+Math.sin(.4)*p;
  return '<svg viewBox="0 0 340 156" role="img" aria-label="Map showing your position relative to the address">'+
   '<rect class="m-bg" width="340" height="156"/><path class="m-road" stroke-width="10" d="M0 40L340 62M0 118L340 100M90 0L120 156M236 0L214 156"/>'+
   '<path class="m-road2" stroke-width="4" d="M0 80L340 82M170 0L172 156M0 12L340 20"/>'+
   '<circle class="m-rad" cx="'+cx+'" cy="'+cy+'" r="'+r+'"/>'+
   '<path d="M'+cx+' '+(cy+10)+'c0 0-9-8-9-15a9 9 0 1 1 18 0c0 7-9 15-9 15z" fill="var(--bad)"/><circle cx="'+cx+'" cy="'+(cy-5)+'" r="3.200" fill="#fff"/>'+
   '<circle cx="'+ux.toFixed(1)+'" cy="'+uy.toFixed(1)+'" r="7" fill="var(--accent)" stroke="#fff" stroke-width="3"/>'+
   '<text class="m-lbl" x="'+(ux+11).toFixed(1)+'" y="'+(uy+4).toFixed(1)+'">You</text>'+
   '<text class="m-lbl" x="'+(cx+r+6)+'" y="'+(cy-r+6)+'" style="fill:var(--accent)">'+fdist(R)+' radius</text></svg>';
}

/* Full-screen map opened from the check-in / check-out sheet: tall version of the same map, with the distance and the radius */
function bigMapSVG(dist,R){
  var W=340,Hh=560,cx=170,cy=250,r=100,p=dist<=R?dist/R*r:r+Math.min((dist-R)/R*60,150);
  var ux=cx-Math.cos(.4)*p,uy=cy+Math.sin(.4)*p;
  return '<svg viewBox="0 0 '+W+' '+Hh+'" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Full-screen map showing your position relative to the address">'+
   '<rect class="m-bg" width="'+W+'" height="'+Hh+'"/><path class="m-road" stroke-width="14" d="M0 120L340 170M0 380L340 330M90 0L130 560M250 0L210 560"/>'+
   '<path class="m-road2" stroke-width="6" d="M0 250L340 256M170 0L174 560M0 40L340 60M0 480L340 500"/>'+
   '<circle class="m-rad" cx="'+cx+'" cy="'+cy+'" r="'+r+'"/>'+
   '<path d="M'+cx+' '+(cy+16)+'c0 0-14-12-14-23a14 14 0 1 1 28 0c0 11-14 23-14 23z" fill="var(--bad)"/><circle cx="'+cx+'" cy="'+(cy-7)+'" r="5" fill="#fff"/>'+
   '<circle cx="'+ux.toFixed(1)+'" cy="'+uy.toFixed(1)+'" r="10" fill="var(--accent)" stroke="#fff" stroke-width="4"/>'+
   '<text class="m-lbl" x="'+(ux+15).toFixed(1)+'" y="'+(uy+5).toFixed(1)+'" style="font-size:14px">You</text>'+
   '<text class="m-lbl" x="'+(cx+r+8)+'" y="'+(cy-r+10)+'" style="fill:var(--accent);font-size:13px">'+fdist(R)+' radius</text></svg>';
}
function mapFullHTML(){
  if(!S.ui.mapFull)return "";
  var r=byId(S.ui.sheetRec||S.ui.rec),R=S.cfg.radius,inR=within(r),kind=S.ui.sheet==="out"?"Check-out":"Check-in";
  return '<div class="mfs" role="dialog" aria-label="Map"><div class="mh"><button data-act="map-close">Close</button><b>'+kind+' map</b><span style="min-width:60px"></span></div>'+
   '<div class="mb">'+bigMapSVG(r.dist,R)+'</div><div class="mf"><div class="dist '+(inR?"in":"far")+'">'+(inR?"Within radius":"Outside radius")+' · '+fdist(r.dist)+' from address (limit '+fdist(R)+')</div><small>'+esc(r.addr)+'</small></div></div>';
}

/* ---------- status bar ---------- */
function statusBar(dark){
  var t=fmt(S.now).replace(/ [AP]M/,"");
  var wifi=S.net?'<svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><path d="M8.500 2.300c2.200 0 4.200.9 5.700 2.300l1-1.100A9.600 9.600 0 0 0 8.500.8C6 .8 3.800 1.800 2.200 3.500l1 1.100A8 8 0 0 1 8.500 2.300zm0 3.300c1.300 0 2.500.5 3.400 1.300l1-1.100a6.500 6.500 0 0 0-8.800 0l1 1.100c.9-.8 2.100-1.300 3.400-1.300zm0 3.200c.6 0 1.100.2 1.500.6L8.500 11 7 9.400c.4-.4.900-.6 1.500-.6z"/></svg>':'<svg width="17" height="12" viewBox="0 0 17 12" fill="none" stroke="currentColor" stroke-width="1.600" stroke-linecap="round"><path d="M2 2l13 9"/><path d="M4 7a6 6 0 0 1 3-1.500M11 6a6 6 0 0 1 2 1.200"/></svg>';
  return '<div class="sbar'+(dark?" dk":"")+'"><i class="isl"></i><span class="l">'+t+ico("bellx",13)+'</span><span class="ic">'+
   '<svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="6" rx="1"/><rect x="10" y="2.500" width="3" height="8.500" rx="1"/><rect x="15" y="0" width="3" height="11" rx="1"/></svg>'+wifi+
   '<svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x=".5" y=".5" width="22" height="11" rx="3.500" stroke="currentColor" opacity=".5"/><rect x="2" y="2" width="9" height="8" rx="2" fill="currentColor"/><rect x="24" y="4" width="1.500" height="4" rx=".7" fill="currentColor" opacity=".5"/></svg></span></div>';
}
var COLORS=["#7B61FF","#E8833A","#2BAE8E","#D9577B","#4C8DF6","#8A6D3B"];
function initials(n){return n.replace(/\(.*?\)/g,"").trim().split(/\s+/).slice(0,2).map(function(w){return w[0]}).join("").toUpperCase()}
function avatar(r,i){return '<div class="av" style="background:'+COLORS[i%COLORS.length]+'">'+esc(initials(r.title))+'</div>'}

/* ---------- list screens ---------- */
function rowHTML(r,i){
  var M=MODS[r.m],left,lines,right="";
  if(r.m==="leads"||r.m==="contacts"){
    left=avatar(r,i);
    lines=[["bld",r.comp],["mail",r.email]].concat(r.src?[["src",r.src]]:[]);
    right='<span class="cb">'+ico("phone",20)+'</span>';
  }else if(r.m==="deals"){
    left='<span class="stg">'+ico("stage",26)+'</span>';
    lines=[["flow",r.stage],["money",r.amt],["cal",r.close+"  ·  "+r.owner]];
    right='<span class="cb">'+ico("flow",20)+'</span>';
  }else{
    left='<span class="stg">'+ico("cal",24)+'</span>';
    lines=[];
    if(hasTime(r.m))lines.push(["clock",fmt(r.start)+" – "+fmt(r.end)]);
    lines.push(["person",r.owner]);lines.push(["pin",r.addr]);
  }
  /* the Check-In/Out Status field value is shown wherever the field is shown, including list rows */
  lines.push(["calok","Check-In/Out Status: "+LABEL[status(r)]]);
  var main='<button class="rw" data-act="open" data-id="'+r.id+'">'+left+'<span class="body"><div class="t">'+esc(r.title)+'</div>'+
    lines.map(function(l){return '<div class="ln">'+ico(l[0],15)+'<span>'+esc(l[1])+'</span></div>'}).join("")+'</span>'+right+'</button>';
  /* swipe a row left to reveal Check in / Check out (greyed with the opening time before the window opens) */
  var s=status(r),act="";
  if(s==="elig")act='<button class="swb" data-act="row-ci" data-id="'+r.id+'">'+ico("pin",22)+'<span>Check in</span></button>';
  else if(s==="in"&&coOpen(r))act='<button class="swb" data-act="row-co" data-id="'+r.id+'">'+ico("pin",22)+'<span>Check out</span></button>';
  else if(s==="in")act='<button class="swb'+offCls()+'" data-act="early-out" data-id="'+r.id+'">'+ico("pin",22)+'<span>Check out</span><small>Opens '+fmt(coOpensAt(r))+'</small></button>';
  else if(s==="none")act='<button class="swb'+offCls()+'" data-act="early" data-id="'+r.id+'">'+ico("pin",22)+'<span>Check in</span><small>Opens '+fmt(r.start-S.cfg.early)+'</small></button>';
  if(!act)return main;
  return '<div class="swr'+(S.ui.swipe===r.id?" open":"")+'" data-sw="'+r.id+'"><div class="swa">'+act+'</div>'+main+'</div>';
}
function listScreen(){
  var mk=S.ui.mod,M=MODS[mk],rs=S.recs.filter(function(r){return r.m===mk});
  var back=M.tab==="more"?'<button class="back" data-act="tab" data-k="more">'+ico("back",20)+'<span>More</span></button>':"";
  return '<div class="ltop"><div class="bar">'+back+ico("dots",26)+ico("search",24)+ico("plus",26)+'</div><h1>'+M.name+'</h1>'+
   '<div class="dd">All '+M.name+' '+ico("chev",18,"none")+'</div><div class="pills"><span class="pl">'+ico("sort",18)+'<span>Sort by</span></span><span class="pl"><span>Total '+M.name+'</span></span></div></div>'+
   '<div class="scroll" data-scroll="main"><div class="rows">'+rs.map(rowHTML).join("")+'</div></div>';
}
function moreScreen(){
  var mr=function(k){var M=MODS[k];return '<button class="mr" data-act="mod" data-k="'+k+'"><span style="color:var(--accent)">'+ico(k==="deals"?"stage":k==="meetings"?"cal":k==="train"?"person":k==="collect"?"money":"pin",24)+'</span><span>'+M.name+'<small>'+MODE_L[M.mode]+' check-in</small></span><span class="chev">'+ico("chevr",18)+'</span></button>'}.bind(null);
  return '<div class="ltop"><div class="bar"></div><h1>More</h1></div><div class="scroll" data-scroll="main"><div class="mh">Modules</div>'+["deals","meetings"].map(mr).join("")+'<div class="mh">Custom modules</div>'+["visits","collect","train"].map(mr).join("")+'</div>';
}
function placeholder(t){return '<div class="ltop"><div class="bar"></div><h1>'+t+'</h1></div><div class="scroll"><div class="ph">'+t+' isn\'t part of this prototype. Open Leads, Contacts or More.</div></div>'}
function tabBar(){
  var M=S.ui.view==="list"?MODS[S.ui.mod].tab:S.ui.view==="more"?"more":S.ui.view==="home"?"home":S.ui.view==="accts"?"accts":"";
  var t=function(k,ic,l){return '<button class="tb" data-act="tab" data-k="'+k+'"'+(M===k?' aria-current="page"':"")+'>'+ico(ic,26)+'<span>'+l+'</span></button>'};
  return '<div class="tabbar">'+t("home","home","Home")+t("leads","target","Leads")+t("contacts","card","Contacts")+t("accts","bld","Accounts")+t("more","dots","More")+'</div>';
}

/* ---------- record screen ---------- */
function infoRows(r){
  var a=[];
  if(r.m==="leads")a=[["Lead Name",r.title],["Company",r.comp],["Email",r.email],["Phone",r.phone],["Lead Source",r.src],["Address",r.addrOk?r.addr:"—"]];
  if(r.m==="contacts")a=[["Contact Name",r.title],["Account Name",r.comp],["Email",r.email],["Phone",r.phone],["Address",r.addrOk?r.addr:"—"]];
  if(r.m==="deals")a=[["Deal Name",r.title],["Amount",r.amt],["Stage",r.stage],["Closing Date",r.close],["Account Name",r.acct],["Visit Time",fmt(r.start)+" – "+fmt(r.end)],["Address",r.addrOk?r.addr:"—"]];
  if(r.m==="meetings")a=[["Title",r.title],["Host",r.owner],["From",fmt(r.start)],["To",fmt(r.end)],["Related To",r.acct],["Location",r.addrOk?r.addr:"—"]];
  if(r.m==="visits")a=[["Visit Name",r.title],["Field Rep",r.owner],["Scheduled Start",fmt(r.start)],["Scheduled End",fmt(r.end)],["Account Name",r.acct],["Customer Address",r.addrOk?r.addr:"—"]];
  if(r.m==="collect")a=[["Collection Name",r.title],["Field Rep",r.owner],["Account Name",r.acct],["Customer Address",r.addrOk?r.addr:"—"]];
  if(r.m==="train")a=[["Session Name",r.title],["Trainer",r.owner],["Starts At",fmt(r.start)],["Ends At",fmt(r.end)],["Account Name",r.acct],["Venue",r.addrOk?r.addr:"—"]];
  return a;
}
function rowsHTML(a){return a.map(function(x){var d=x[1]==="—";return '<div class="row"><span class="k">'+esc(x[0])+'</span><span class="v'+(d?" dim":"")+(x[2]?" tap":"")+'"'+(x[2]?' data-act="shows" role="button" tabindex="0" title="Tap to switch between comparative and actual"':"")+'>'+esc(x[1])+'</span></div>'}).join("")}
/* Times and locations show the comparative reading and the actual value together (no toggle) */
function tRow(r,l,x,ref){if(!x)return [l,"—"];return hasTime(r.m)?[l,cmpTime(x.t,ref)+" ("+fmt(x.t)+")"]:[l,fmt(x.t)]}
function lRow(r,l,x){
  if(!x)return [l,"—"];
  if(!hasLoc(r.m))return [l,"Location captured"];
  if(x.d==null)return [l,"Address not available"];
  return [l,cmpDist(x.d)+" ("+r.addr+")"];
}
function ciRows(r){
  var c=r.ci,o=r.co,a=[["Check-In/Out Status",LABEL[status(r)]]];
  a.push(tRow(r,"Check-In Time",c,r.start),lRow(r,"Check-In Location",c));
  CI.forEach(function(f){if(S.cfg.ci[f.k].on)a.push([f.l,c?(c[f.k]||"—"):"—"])});
  a.push(tRow(r,"Check-Out Time",o,r.end),lRow(r,"Check-Out Location",o));
  CO.forEach(function(f){if(S.cfg.co[f.k].on)a.push([f.l,o?(o[f.k]||"—"):"—"])});
  a.push(["Time on Site",o&&c?durP(o.t-c.t):"—"]);
  return a;
}
function headHTML(r){
  var M=MODS[r.m],h="";
  if(r.m==="leads"||r.m==="contacts")h='<div class="id"><div class="tile">'+ico("cam",30)+'</div><div><div class="nm">'+esc(r.title)+'</div><div class="co">'+ico("bld",16)+'<span>'+esc(r.comp)+'</span></div></div></div>';
  else if(r.m==="deals")h='<div style="padding:2px 0 0"><div class="nm">'+esc(r.title)+'</div><div class="co">'+ico("money",18)+'<span>'+esc(r.amt)+'</span></div></div><div class="stage"><div class="sel"><span>'+esc(r.stage)+'</span>'+ico("chev",18)+'</div><div class="tb2" style="color:var(--ok)">'+ico("up",24,"currentColor")+'</div><div class="tb2" style="color:var(--bad);width:76px"><span style="display:flex;gap:6px;align-items:center"><span style="transform:rotate(180deg)">'+ico("up",24,"currentColor")+'</span>'+ico("chev",16)+'</span></div></div>';
  else h='<div style="padding:2px 0 12px"><div class="nm">'+esc(r.title)+'</div><div class="co">'+ico("person",16)+'<span>'+esc(r.owner)+'</span></div></div>';
  if(hasTime(r.m)&&r.m!=="deals")h+='<div class="sched"><span>Today<b>'+fmt(r.start)+' to '+fmt(r.end)+'</b></span>'+'<span style="color:var(--accent)">'+ico("cal",24)+'</span></div>';
  if(r.m==="deals"&&hasTime(r.m))h+='<div class="sched"><span>Visit today<b>'+fmt(r.start)+' to '+fmt(r.end)+'</b></span><span style="color:var(--accent)">'+ico("cal",24)+'</span></div>';
  /* Meetings: one green line showing the latest event only (Checked-in, replaced by Checked-out). Other modules show the status in the Details tab. */
  if(r.m==="meetings"){
    if(r.co)h+='<div class="bn ok">'+ico("calok",22)+'<span>Checked-out Today '+fmt(r.co.t)+'</span></div>';
    else if(r.ci)h+='<div class="bn ok">'+ico("calok",22)+'<span>Checked-in Today '+fmt(r.ci.t)+'</span></div>';
  }
  /* Before the window opens there is no line: the greyed button explains itself when tapped. Red lines are for Meetings only. */
  var s=status(r),hh=hint(r);
  if(hh&&s!=="none"&&hh.c!=="bad")h+='<div class="bn '+hh.c+'">'+ico(hh.c==="bad"?"warn":"clock",hh.c==="bad"?18:16)+'<span>'+hh.t+'</span></div>';
  return h;
}
function actsHTML(r){
  var s=status(r);
  var base=({leads:["Email","CI","Call","Convert"],contacts:["Email","CI","Call","Maps"],deals:["Email","CI","Call","Maps"]})[r.m]||["CI","Maps","Call","Clone"];
  var IC={Email:"mail",Call:"phone",Convert:"convert",Maps:"map",Clone:"clone"};
  return '<div class="acts">'+base.map(function(a){
    if(a==="CI"){
      if(s==="elig")return '<button class="act" data-act="ci-open">'+ico("pin",28)+'<span>Check in</span></button>';
      if(s==="in"&&coOpen(r))return '<button class="act" data-act="co-open">'+ico("pin",28)+'<span>Check out</span></button>';
      if(s==="in")return '<button class="act'+offCls()+'" data-act="early-out" data-id="'+r.id+'">'+ico("pin",28)+'<span>Check out</span></button>';
      if(s==="out")return '<button class="act" disabled>'+ico("pin",28)+'<span>Check in</span></button>';
      if(s==="none")return '<button class="act'+offCls()+'" data-act="early" data-id="'+r.id+'">'+ico("pin",28)+'<span>Check in</span></button>';
      return "";
    }
    return '<button class="act" data-act="stub">'+ico(IC[a],28)+'<span>'+a+'</span></button>';
  }).join("")+'</div>';
}
/* Related lists on a parent record (Contacts): visits and meetings for the same account, each with its own check-in action */
function relLists(r){
  if(r.m!=="contacts")return "";
  var out="";
  [["meetings","Meetings"],["visits","Customer Visits"]].forEach(function(p){
    var rs=S.recs.filter(function(x){return x.m===p[0]&&x.acct===r.comp});
    if(!rs.length)return;
    out+='<div class="cd"><h3>'+ico("cal",22)+'<span>'+p[1]+'</span></h3>'+rs.map(function(x){
      var s=status(x),b="";
      if(s==="elig")b='<button class="rlb" data-act="rel-ci" data-id="'+x.id+'">Check in</button>';
      else if(s==="in"&&coOpen(x))b='<button class="rlb" data-act="rel-co" data-id="'+x.id+'">Check out</button>';
      else if(s==="in")b='<button class="rlb'+offCls()+'" data-act="early-out" data-id="'+x.id+'">Check out</button>';
      else if(s==="none")b='<button class="rlb'+offCls()+'" data-act="early" data-id="'+x.id+'">Check in</button>';
      return '<div class="rl"><button class="rlm" data-act="open" data-id="'+x.id+'"><b>'+esc(x.title)+'</b><span>'+fmt(x.start)+' – '+fmt(x.end)+'</span></button><span class="pill '+PCLS[s]+'">'+LABEL[s]+'</span>'+b+'</div>';
    }).join("")+'</div>';
  });
  return out;
}
function recScreen(){
  var r=byId(S.ui.rec),M=MODS[r.m],t=S.ui.rtab,body="";
  if(t==="overview"){var a=infoRows(r).slice(0,4);body='<div class="cd"><h3>'+M.one+' Information</h3>'+rowsHTML(a)+'</div>'}
  if(t==="details"){body='<div class="cd"><h3>'+M.one+' Information</h3>'+rowsHTML(infoRows(r))+'</div><div class="cd"><h3>Check-In / Check-Out Information</h3>'+((hasTime(r.m)||hasLoc(r.m))?'<div class="cap2">Tap a time or location to switch between comparative and actual.</div>':"")+rowsHTML(ciRows(r))+'</div>'}
  if(t==="related"){
    body='<div class="cd"><h3>'+ico("note",22)+'<span>Notes</span><span class="sp"></span><span class="ac">'+ico("plus",22)+ico("phone",22)+'</span></h3>'+
     '<div class="nt"><div class="av" style="background:#4C8DF6">EC</div><div><div class="tt">Schedule a Demo of all the cloud related products</div><div class="mm">Jun 2, 2025 05:00 PM by Ethan Cald…</div></div></div>'+
     '<div class="nt"><div class="av" style="background:#2BAE8E">EC</div><div><div class="tt">Intro Call Summary - Discussed IT infrastructure needs</div><div class="mm">Edited: Jun 2, 2025 04:34 PM by Eth…</div></div></div></div>'+
     '<div class="cd"><h3>'+ico("clip",22)+'<span>Attachments</span><span class="sp"></span><span class="ac">'+ico("plus",22)+'</span></h3>'+
     '<div class="file"><span class="fi" style="background:#5B5BD6">PNG</span><div><div>1000000526.png</div><div class="mm" style="color:var(--muted);font-size:13px">Ethan Caldwell</div></div></div>'+
     '<div class="file"><span class="fi" style="background:#34A853">XLS</span><div><div>BetaBiz_SaaSOverview.xlsx</div><div class="mm" style="color:var(--muted);font-size:13px">Ethan Caldwell</div></div></div></div>'+relLists(r);
  }
  var tabs=["overview","details","related"].map(function(k){return '<button class="tab" role="tab" data-act="rtab" data-k="'+k+'" aria-selected="'+(t===k)+'">'+k[0].toUpperCase()+k.slice(1)+'</button>'}).join("");
  return '<div class="nav"><button class="back" data-act="back">'+ico("back",22)+'<span>'+M.name+'</span></button><span class="sp"></span><button class="ibtn" data-act="stub" aria-label="Edit">'+ico("pen",24)+'</button><button class="ibtn" data-act="menu" aria-label="More actions">'+ico("dots",26)+'</button></div>'+
   '<div class="scroll" data-scroll="main"><div class="head">'+headHTML(r)+'</div>'+actsHTML(r)+'<div class="tabs" role="tablist">'+tabs+'</div><div class="body-p">'+body+'</div></div>'+
   (t==="related"?'<button class="jump" data-act="stub">Jump To</button>':"");
}

/* ---------- sheet ---------- */
function fieldHTML(kind,f){
  var conf=S.cfg[kind][f.k];if(!conf.on)return "";
  var val=S.ui.form[f.k]||"",er=S.ui.ferr[f.k],id="f-"+f.k;
  var lab=esc(f.l)+(conf.req?' <span class="req" aria-hidden="true">*</span>':"");
  var inp="";
  if(f.t==="num")inp='<input id="'+id+'" data-f="'+f.k+'" type="number" inputmode="decimal" min="0" value="'+esc(val)+'" placeholder="0">';
  if(f.t==="txt")inp='<textarea id="'+id+'" data-f="'+f.k+'" placeholder="Add a note">'+esc(val)+'</textarea>';
  if(f.t==="sel")inp='<select id="'+id+'" data-f="'+f.k+'"><option value="">Select</option>'+PURPOSES.map(function(o){return '<option'+(o===val?" selected":"")+'>'+o+'</option>'}).join("")+'</select>';
  if(f.t==="seg")return '<div class="fld'+(er?" err":"")+'"><span class="lb">'+lab+'</span><div class="seg" role="group" aria-label="'+esc(f.l)+'">'+["Yes","No"].map(function(o){return '<button data-act="seg" data-k="'+f.k+'" data-v="'+o+'" aria-pressed="'+(val===o)+'">'+o+'</button>'}).join("")+'</div>'+(er?'<div class="em">'+er+'</div>':"")+'</div>';
  return '<div class="fld'+(er?" err":"")+'"><label for="'+id+'">'+lab+'</label>'+inp+(er?'<div class="em">'+er+'</div>':"")+'</div>';
}
function sheetHTML(){
  var kind=S.ui.sheet,r=byId(S.ui.sheetRec||S.ui.rec),isIn=kind==="in",R=S.cfg.radius,M=MODS[r.m];
  var title=isIn?"Check In":"Check Out",low=title.toLowerCase();
  var head='<div class="gr"></div><div class="sheet-h"><h2>'+title+'<span class="vn">'+esc(r.title)+' · '+M.one+'</span></h2><button class="ibtn" data-act="sheet-close" aria-label="Close">'+ico("x",22)+'</button></div>';
  if(S.perm!=="granted"){
    var msg=S.perm==="gps"?"Location Services are turned off on this phone. Turn them on to "+low+".":"CRM doesn't have permission to use your location. Allow it to "+low+".";
    return '<div class="scrim" data-act="noop"><div class="sheet">'+head+'<div class="sheet-b"><div class="block"><div class="ico">'+ico("off",26)+'</div><h3>Location is off</h3><p>'+msg+'</p><button class="btn" data-act="settings-open">Open Settings</button></div></div></div></div>';
  }
  var body="";
  if(!S.net)body+='<div class="banner warn">'+ico("warn",16)+'<div><b>You\'re offline</b>'+title+' needs an internet connection.</div></div>';
  if(!hasLoc(r.m)){
    body+='<div class="dist inf">'+ico("pin",16)+' Your location will be recorded. No distance limit applies to '+M.name+'.</div>';
  }else if(r.addrOk){
    var inR=r.dist<=R;
    body+='<div class="map mapw">'+mapSVG(r.dist,R)+'<button class="mapx" data-act="map-full" aria-label="View map in full screen">'+ico("expand",18)+'</button></div><div class="dist '+(inR?"in":"far")+'">'+(inR?"Within radius":"Outside radius")+' · '+fdist(r.dist)+' from address (limit '+fdist(R)+')</div>';
  }else{
    body+='<div class="map"><div class="m-none"><div><b>No address on this record</b><br>Your distance can\'t be checked.</div></div></div>';
    body+=S.cfg.allowEmpty?'<div class="dist na">'+ico("warn",16)+' Allowed by your admin. Location is recorded without a distance.</div>':
      '<div class="banner bad">'+ico("warn",16)+'<div><b>Can\'t '+low+' without an address</b>Add an address to this record, or ask your admin to allow it.</div></div>';
  }
  if(S.ui.err)body+='<div class="banner bad" role="alert">'+ico("warn",16)+'<div><b>'+esc(S.ui.err.h)+'</b>'+esc(S.ui.err.b)+'</div></div>';
  body+='<div class="tline"><span>'+(isIn?"Check-in time":"Check-out time")+'</span><b>'+fmt(S.now)+'</b></div>';
  body+=(isIn?CI:CO).map(function(f){return fieldHTML(isIn?"ci":"co",f)}).join("");
  var blocked=hasLoc(r.m)&&!r.addrOk&&!S.cfg.allowEmpty;
  return '<div class="scrim" data-act="noop"><div class="sheet">'+head+'<div class="sheet-b" data-scroll="sheet">'+body+'</div><div class="sheet-f"><button class="btn" data-act="submit"'+(blocked?" disabled":"")+'>Confirm '+title+'</button></div></div></div>';
}
function dialogHTML(){
  if(!S.ui.dialog)return "";
  return '<div class="scrim mid"><div class="dlg" role="alertdialog" aria-label="Revert check-out"><h3>Revert check-out?</h3><p>This clears the check-out details and returns the record to Checked In.</p><div class="btn-row"><button class="btn sec2" data-act="rev-cancel">Cancel</button><button class="btn danger" data-act="rev-go">Revert</button></div></div></div>';
}
function warnHTML(){
  var w=S.ui.warn;if(!w)return "";
  return '<div class="scrim mid"><div class="dlg" role="alertdialog" aria-label="'+esc(w.t)+'"><div class="wico">'+ico("warn",24)+'</div><h3>'+esc(w.t)+'</h3><p>'+esc(w.m)+'</p><button class="btn" data-act="warn-ok">OK</button></div></div>';
}
function menuHTML(){
  if(!S.ui.menu)return "";
  var r=byId(S.ui.rec),ok=canRevert(r);
  var cap=ok?"Actions":(status(r)==="out"?"Revert Check-Out isn't available: the check-out window has closed.":"Revert Check-Out appears here after a check-out.");
  return '<div class="scrim" data-act="menu-close"><div class="asheet"><div class="g"><div class="cap">'+cap+'</div>'+(ok?'<button class="dg" data-act="rev-open">Revert Check-Out</button>':"")+'</div><div class="g"><button data-act="menu-close" style="font-weight:650">Cancel</button></div></div></div>';
}
function settingsHTML(){
  if(!S.ui.settings)return "";
  var svc=S.perm!=="gps",allow=S.perm==="granted";
  return '<div class="settings"><div class="sbar"></div><div class="nav"><button class="back" data-act="settings-close">'+ico("back",22)+'<span>Back</span></button></div>'+
   '<div class="grp"><div class="r"><span>Location Services</span><button class="sw" role="switch" aria-label="Location Services" aria-checked="'+svc+'" data-set="svc"></button></div></div>'+
   '<div class="cap">CRM</div><div class="grp"><button class="r" data-set="never"><span>Never</span><span>'+(S.perm==="denied"?"✓":"")+'</span></button><button class="r" data-set="while"><span>While Using the App</span><span>'+(allow?"✓":"")+'</span></button></div>'+
   '<p class="cap">Location access lets CRM confirm you\'re at the visit before check-in and check-out.</p><div style="margin:18px 14px"><button class="btn" data-act="settings-close">Back to CRM</button></div></div>';
}
function snoozeOptions(L){
  var r=byId(L.id),close=r.end+S.cfg.after,o=[];
  [5,10,15].forEach(function(m){o.push({l:m+" minutes",at:S.now+m})});
  if(L.type==="open"&&S.now<r.start)o.push({l:"At start time ("+fmt(r.start)+")",at:r.start});
  if(L.type==="outrem")o.push({l:"At window end ("+fmt(close)+")",at:close});
  var f=o.filter(function(x){return x.at<=close});
  return f.length?f:[o[0]];
}
function lockHTML(){
  var L=S.ui.lock;if(!L)return "";
  var r=byId(L.id),M=MODS[r.m],t,b;
  var acts="";
  if(L.type==="open"){t="Check-in is open · "+r.title;b=M.one+" starts at "+fmt(r.start)+". Check in before "+fmt(r.end)+"."}
  else if(L.type==="arrive"){t="You've arrived · "+r.title;b="You're within "+fdist(S.cfg.radius)+" of the "+M.one.toLowerCase()+" address. Open the record to check in."}
  else if(L.type==="outrem"){t="Check out soon · "+r.title;b="The window closes in 15 minutes. Check out before "+fmt(r.end+S.cfg.after)+"."}
  else if(L.type==="autoin"){t="Checked in automatically";b=r.title+" · "+fmt((r.ci||{t:S.now}).t)+" · "+(r.addrOk?r.addr:"location recorded")}
  else{t="Checked out automatically";b=r.title+" · "+fmt((r.co||{t:S.now}).t)+" · "+(r.addrOk?r.addr:"location recorded")}
  if(L.type==="open")acts='<div class="pact"><button data-act="lock-ci">Check in</button><button class="sec" data-act="lock-snz">Remind me</button><button class="sec" data-act="lock-off">Dismiss</button></div>';
  if(L.type==="arrive")acts='<div class="pact"><button data-act="lock-ci">Check in</button><button class="sec" data-act="lock-off">Dismiss</button></div>';
  if(L.type==="outrem")acts='<div class="pact"><button data-act="lock-co">Check out</button><button class="sec" data-act="lock-snz">Remind me</button><button class="sec" data-act="lock-off">Dismiss</button></div>';
  /* Remind Me menu, as on web (PRD 7.4): 5, 10, 15 minutes, plus At start time / At window end; options past the window end are dropped */
  if(S.ui.snzMenu&&(L.type==="open"||L.type==="outrem"))acts='<div class="pact col">'+snoozeOptions(L).map(function(o){return '<button class="sec" data-act="snz" data-at="'+o.at+'">'+esc(o.l)+'</button>'}).join("")+'<button class="sec" data-act="snz-back">Back</button></div>';
  var dt=new Date().toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long"});
  return '<div class="lock">'+statusBar(true)+'<div class="lk">'+ico("lock",20)+'</div><div class="dt">'+esc(dt)+'</div><div class="tm">'+fmt(S.now).replace(/ [AP]M/,"")+'</div>'+
   '<div class="stack"><div class="stk-h"><span>Notification Center</span></div><button class="pn" data-act="lock-go" aria-label="Open the record from the notification"><span class="ai">CRM</span><span class="pb"><span class="ph2"><span>CRM</span><span>now</span></span><div class="pt">'+esc(t)+'</div><div class="pm">'+esc(b)+'</div></span></button>'+acts+'</div>'+
   '<div class="tools"><i>'+ico("flash",22)+'</i><i>'+ico("cam",22)+'</i></div><div class="hint2">Tap the notification, or the bar to unlock</div><button class="hm" data-act="lock-off" aria-label="Unlock"><i></i></button></div>';
}

/* In-app banner after an automatic capture (PRD 2.5): names the record, the time and the place */
function bannerHTML(){
  var b=S.ui.autoBanner;if(!b)return "";
  var r=byId(b.id),c=b.type==="autoin"?r.ci:r.co;if(!c)return "";
  return '<div class="abn" role="status"><div class="abt"><b>'+(b.type==="autoin"?"Checked in automatically":"Checked out automatically")+'</b><span>'+esc(r.title)+' · '+fmt(c.t)+' · '+esc(r.addrOk?r.addr:"location recorded")+'</span></div><button data-act="ab-view">View</button><button class="x" data-act="ab-x" aria-label="Dismiss">'+ico("x",18)+'</button></div>';
}
function renderPhone(){
  var sc=$("#screen"),keep={};
  sc.querySelectorAll("[data-scroll]").forEach(function(e){keep[e.dataset.scroll]=e.scrollTop});
  var u=S.ui,main,tabbar="";
  if(u.view==="rec")main=recScreen();
  else if(u.view==="more"){main=moreScreen();tabbar=tabBar()}
  else if(u.view==="home"){main=placeholder("Home");tabbar=tabBar()}
  else if(u.view==="accts"){main=placeholder("Accounts");tabbar=tabBar()}
  else{main=listScreen();tabbar=tabBar()}
  sc.innerHTML=statusBar(false)+main+tabbar+'<div class="home"><i></i></div>'+(u.sheet?sheetHTML():"")+menuHTML()+dialogHTML()+warnHTML()+mapFullHTML()+settingsHTML()+bannerHTML()+(u.toast?'<div class="toast'+(u.toastW?' tw':'')+'" role="status">'+(u.toastW?'<span class="twi">'+ico("warn",18)+'</span>':'')+'<span>'+esc(u.toast)+'</span></div>':"")+lockHTML();
  sc.querySelectorAll("[data-scroll]").forEach(function(e){if(keep[e.dataset.scroll]!=null)e.scrollTop=keep[e.dataset.scroll]});
}

/* ---------- panel ---------- */
var PRESETS=[
 ["happy","Happy path","Meeting, within radius"],["early","Window not open: A","Greyed button, message on tap"],["early2","Window not open: B","Enabled button, snackbar warning on tap"],["coearly","Check-out not open","Uses the selected style"],["far","Outside radius","1.5 km away"],
 ["missin","Missed check-in","After 2:30 PM"],["perm","Location denied","Open Settings flow"],["gps","Location services off","GPS disabled"],
 ["offline","Offline","No network"],["noaddr","No address, blocked","Admin disallows"],["noaddr2","No address, allowed","Admin allows"],
 ["checkout","Ready to check out","Checked in, in window"],["missout","Missed check-out","Window passed"],["revert","Revert check-out","Inside window"],
 ["revert2","Revert window closed","Outside window"],["lonly","Location-only: Lead","No time window"],["lrev","Revert, location-only","Lead, no limit"],
 ["tonly","Time-only: Training","Location captured"],["deal","Time + location: Deal","Deals module"],["push-open","Push: window opens","Lock screen"],["push-arrive","Push: arrival","Lock screen"],
 ["push-out","Push: check-out reminder","15 min before close"],["auto-in","Auto check-in","Enter the area"],["auto-out","Auto check-out: leave","Exit the area"],["auto-out2","Auto check-out: window closes","Time-based"]
];
function recOptions(){
  var out="";Object.keys(MODS).forEach(function(k){out+='<optgroup label="'+MODS[k].name+'">'+S.recs.filter(function(r){return r.m===k}).map(function(r){return '<option value="'+r.id+'">'+esc(r.title)+'</option>'}).join("")+'</optgroup>'});
  return out;
}
function buildPanel(){
  $("#presets").innerHTML=PRESETS.map(function(p){return '<button class="pbtn" data-pre="'+p[0]+'">'+p[1]+'<small>'+p[2]+'</small></button>'}).join("");
  $("#selRec").innerHTML=recOptions();
  $("#tq").innerHTML=[["Before window",700],["Window open",810],["During",850],["Missed check-in",880],["Missed check-out",940],["Evening",1100]].map(function(x){return '<button data-tm="'+x[1]+'">'+x[0]+'</button>'}).join("");
  $("#dq").innerHTML=[["At site",30],["400 m",400],["800 m",800],["2 km",2000]].map(function(x){return '<button data-dq="'+x[1]+'">'+x[0]+'</button>'}).join("");
  var rows=function(k,arr,lbl){return arr.map(function(f){return '<tr><td>'+lbl+': '+f.l+'</td><td><input type="checkbox" data-fc="'+k+'.'+f.k+'.on" aria-label="Show '+f.l+'"></td><td><input type="checkbox" data-fc="'+k+'.'+f.k+'.req" aria-label="Require '+f.l+'"></td></tr>'}).join("")};
  $("#ftab").innerHTML='<thead><tr><th>Sheet fields</th><th>Show</th><th>Required</th></tr></thead><tbody>'+rows("ci",CI,"Check-in")+rows("co",CO,"Check-out")+'</tbody>';
  $("#mtab").innerHTML='<thead><tr><th>Module</th><th style="width:auto">Check-in mode</th></tr></thead><tbody>'+Object.keys(MODS).map(function(k){return '<tr><td>'+MODS[k].name+(MODS[k].custom?" (custom)":"")+'</td><td style="text-align:right">'+MODE_L[MODS[k].mode]+'</td></tr>'}).join("")+'</tbody>';
}
function syncPanel(){
  var v=cur();
  $("#selRec").value=S.sel;$("#modeTag").textContent=MODE_L[MODS[v.m].mode];
  $("#tm").value=S.now;$("#tmv").textContent=fmt(S.now);
  $("#dist").value=Math.min(v.dist,3000);$("#distv").textContent=fdist(v.dist);
  $("#perm").value=S.perm;$("#addr").value=v.addrOk?"1":"0";$("#ebs").value=S.earlyStyle;
  $("#net").setAttribute("aria-checked",S.net);$("#netl").textContent="Network: "+(S.net?"online":"offline");
  var r=S.cfg.radius,std=[100,500,1000].indexOf(r)>-1;
  $("#radius").value=std?String(r):"custom";$("#radc").hidden=std;$("#radc").value=r;
  $("#early").value=String(S.cfg.early);$("#after").value=String(S.cfg.after);
  $("#allowE").setAttribute("aria-checked",S.cfg.allowEmpty);$("#pops").setAttribute("aria-checked",S.cfg.popups);
  /* PRD 2.5: automatic capture is unavailable while its half has a required field; a stored setting that no longer holds is cleared */
  var rci=reqNames("ci"),rco=reqNames("co");
  if(rci.length)S.cfg.autoIn=false;if(rco.length)S.cfg.autoOut=false;
  $("#autoIn").setAttribute("aria-checked",S.cfg.autoIn);$("#autoIn").disabled=rci.length>0;
  $("#autoOut").setAttribute("aria-checked",S.cfg.autoOut);$("#autoOut").disabled=rco.length>0;
  var q=function(a){return a.map(function(n){return '"'+n+'"'}).join(", ")};
  $("#aiN").textContent=rci.length?"Unavailable while "+q(rci)+" is required in the check-in fields.":"The app checks the user in when they enter the permitted area, without opening the record.";
  $("#aoN").textContent=rco.length?"Unavailable while "+q(rco)+" is required in the check-out fields.":"The app checks the user out when they leave the area or the window closes.";
  document.querySelectorAll("[data-fc]").forEach(function(c){var p=c.dataset.fc.split(".");c.checked=S.cfg[p[0]][p[1]][p[2]]});
  $("#log").innerHTML=S.log.length?S.log.map(function(l){return '<li class="'+l.k+'"><time>'+l.t+'</time><span>'+esc(l.m)+'</span></li>'}).join(""):'<li><time></time><span style="color:var(--muted)">Actions and blocked attempts appear here.</span></li>';
}

/* ---------- push triggers ---------- */
function snap(){var o={now:S.now,perm:S.perm,st:{},inr:{}};S.recs.forEach(function(r){o.st[r.id]=status(r);o.inr[r.id]=within(r)});return o}
/* Automatic capture (mobile, PRD 2.5). Needs a network in phase 1. Check-in: entering the area; check-out: leaving it or the window closing. */
function autoApply(a){
  if(!S.net)return null;
  var hit=null;
  S.recs.forEach(function(r){
    if(hit)return;
    var id=r.id,s=status(r),inr=within(r),close=r.end+S.cfg.after;
    if(S.cfg.autoIn&&!reqNames("ci").length&&S.perm==="granted"&&hasLoc(r.m)&&s==="elig"&&inr&&!(a.st[id]==="elig"&&a.inr[id])){
      r.ci={t:S.now,d:r.dist,odo:"",purpose:"",note:"",auto:true};
      log("Checked in automatically: "+r.title+", "+fdist(r.dist)+" from address","ok");hit={type:"autoin",id:id};return;
    }
    if(S.cfg.autoOut&&!reqNames("co").length&&r.ci&&!r.co&&a.st[id]==="in"){
      var left=S.perm==="granted"&&hasLoc(r.m)&&a.inr[id]&&!inr;
      var closed=hasTime(r.m)&&a.now<=close&&S.now>close;
      if(left||closed){
        r.co={t:closed&&!left?close:S.now,d:hasLoc(r.m)&&r.addrOk?r.dist:null,obj:"",odo:"",note:"",auto:true};
        log("Checked out automatically: "+r.title+(left?", left the area":", window closed"),"ok");hit={type:"autoout",id:id};
      }
    }
  });
  return hit;
}
function fire(a,b){
  if(!S.cfg.popups)return null;
  var order=[cur()].concat(S.recs.filter(function(r){return r.id!==S.sel}));
  for(var i=0;i<order.length;i++){var r=order[i],id=r.id,close=r.end+S.cfg.after;
    if(hasTime(r.m)&&b.st[id]==="in"&&a.now<close-15&&b.now>=close-15&&b.now<close)return {type:"outrem",id:id};
    if(hasTime(r.m)&&a.st[id]==="none"&&b.st[id]==="elig")return {type:"open",id:id};
    if(b.perm==="granted"&&b.st[id]==="elig"&&!a.inr[id]&&b.inr[id])return {type:"arrive",id:id};
  }
  return null;
}
function renderAll(){renderPhone();syncPanel()}
/* A snoozed reminder fires again at its time, if it is still relevant */
function dueSnooze(){
  var hit=null,keep=[];
  S.snoozes.forEach(function(s){
    if(S.now<s.at){keep.push(s);return}
    var r=byId(s.id),st=status(r);
    if(!hit&&((s.type==="open"&&st==="elig")||(s.type==="outrem"&&st==="in"&&S.now<=r.end+S.cfg.after)))hit={type:s.type,id:s.id};
  });
  S.snoozes=keep;return hit;
}
function change(fn){var a=snap();fn();var au=autoApply(a);var b=snap();var p=au||fire(a,b)||dueSnooze();
  if(p){S.ui.lock=p;S.ui.snzMenu=false;S.ui.sheet=null;S.ui.menu=false;S.ui.dialog=null;S.ui.autoBanner=null;
    log("Push received: "+({open:"check-in window opened",arrive:"arrived at location",outrem:"check-out reminder",autoin:"checked in automatically",autoout:"checked out automatically"}[p.type])+" ("+byId(p.id).title+")","info")}
  renderAll()}

/* ---------- actions ---------- */
function openRec(id){var r=byId(id);S.sel=id;S.ui.swipe=null;S.ui.rec=id;S.ui.view="rec";S.ui.mod=r.m;S.ui.rtab="overview";S.ui.sheet=null;S.ui.form={};S.ui.ferr={};S.ui.err=null;S.ui.menu=false}
function openSheet(kind,id){S.ui.sheet=kind;S.ui.sheetRec=id||S.ui.rec;S.ui.form={};S.ui.ferr={};S.ui.err=null;S.ui.swipe=null}
function toast(t,w){S.ui.toast=t;S.ui.toastW=!!w;clearTimeout(toast.t);toast.t=setTimeout(function(){S.ui.toast=null;renderPhone()},2800)}
function fail(h,b,lg){S.ui.err={h:h,b:b};log(lg||h,"err");renderAll();var sb=document.querySelector('[data-scroll="sheet"]');if(sb)sb.scrollTop=0}
function submit(){
  var kind=S.ui.sheet,isIn=kind==="in",r=byId(S.ui.sheetRec||S.ui.rec),R=S.cfg.radius,nm=isIn?"check in":"check out";
  S.ui.err=null;S.ui.ferr={};
  var st=status(r),hh=hint(r);
  if(isIn&&st!=="elig")return fail("Check-in isn't available",(hh?hh.t:"Not available")+".","Check-in blocked: "+(hh?hh.t:"not available"));
  if(!isIn&&st!=="in")return fail("Check-out isn't available",(hh?hh.t:"Not available")+".","Check-out blocked: "+(hh?hh.t:"not available"));
  if(!isIn&&!coOpen(r))return fail("Check-out isn't open yet","Check-out opens at "+fmt(coOpensAt(r))+".","Check-out blocked: opens at "+fmt(coOpensAt(r)));
  if(!S.net)return fail("No internet connection","Connect to the internet and try again.","Blocked: offline");
  if(hasLoc(r.m)){
    if(!r.addrOk&&!S.cfg.allowEmpty)return fail("This record has no address","Add an address, or ask your admin to allow "+nm+" without one.","Blocked: no address (admin disallows)");
    if(r.addrOk&&r.dist>R)return fail("You're outside the allowed area","You're "+fdist(r.dist)+" from the address. Move within "+fdist(R)+" to "+nm+".","Blocked: "+fdist(r.dist)+" away, limit "+fdist(R));
  }
  var defs=isIn?CI:CO,key=isIn?"ci":"co",bad=false;
  defs.forEach(function(f){var c=S.cfg[key][f.k];if(c.on&&c.req&&!String(S.ui.form[f.k]||"").trim()){S.ui.ferr[f.k]="Required";bad=true}});
  if(bad)return fail("Complete the required fields","Fields marked * are mandatory.","Blocked: required fields missing");
  var d=hasLoc(r.m)&&r.addrOk?r.dist:null,f=S.ui.form;
  if(isIn){r.ci={t:S.now,d:d,odo:f.odo||"",purpose:f.purpose||"",note:f.note||""};
    log("Checked in: "+r.title+(d==null?"":", "+fdist(d)+" from address"),"ok");toast("Checked in at "+fmt(S.now))}
  else{r.co={t:S.now,d:d,obj:f.obj||"",odo:f.odo||"",note:f.note||""};
    log("Checked out: "+r.title+" after "+fdur(S.now-r.ci.t),"ok");toast("Checked out at "+fmt(S.now))}
  S.ui.sheet=null;renderAll();
}

var suppress=false;
$("#screen").addEventListener("click",function(e){
  if(suppress){suppress=false;return}
  var st=e.target.closest("[data-set]");
  if(st){var k=st.dataset.set;
    if(k==="svc")S.perm=S.perm==="gps"?"granted":"gps";
    if(k==="never")S.perm="denied";
    if(k==="while")S.perm="granted";
    renderAll();return}
  var el=e.target.closest("[data-act]");if(!el)return;
  var a=el.dataset.act,u=S.ui;
  if(a==="noop"){if(e.target===el&&u.sheet){u.sheet=null;renderAll()}return}
  if(a==="menu-close"){if(e.target===el||el.tagName==="BUTTON"){u.menu=false;renderAll()}return}
  if(a==="tab"){var k=el.dataset.k;u.sheet=null;u.menu=false;
    if(k==="leads"||k==="contacts"){u.view="list";u.mod=k}else if(k==="more")u.view="more";else u.view=k}
  else if(a==="mod"){u.view="list";u.mod=el.dataset.k}
  else if(a==="open"){openRec(el.dataset.id)}
  else if(a==="back"){u.view="list";u.mod=byId(u.rec).m;u.rec=null;u.sheet=null}
  else if(a==="rtab"){u.rtab=el.dataset.k}
  else if(a==="ci-open"){openSheet("in")}
  else if(a==="co-open"){openSheet("out")}
  else if(a==="sheet-close"){u.sheet=null}
  else if(a==="seg"){u.form[el.dataset.k]=el.dataset.v;delete u.ferr[el.dataset.k]}
  else if(a==="settings-open"){u.settings=true}
  else if(a==="settings-close"){u.settings=false}
  else if(a==="submit"){submit();return}
  else if(a==="menu"){u.menu=true}
  else if(a==="rev-open"){u.menu=false;u.dialog=true}
  else if(a==="rev-cancel"){u.dialog=null}
  else if(a==="rev-go"){
    var r=byId(u.rec);u.dialog=null;
    if(!S.net){toast("No internet connection. Connect and try again.");log("Revert blocked: offline","err")}
    else if(!canRevert(r)){toast("Revert window has closed.");log("Revert blocked: window closed","err")}
    else{r.co=null;log("Reverted check-out: "+r.title+"; back to Checked In","ok");toast("Check-out reverted. Status: Checked In")}}
  else if(a==="lock-go"){var L=u.lock;u.lock=null;if(L.type.indexOf("auto")===0)u.autoBanner={type:L.type,id:L.id};openRec(L.id);log("Opened record from push notification","info")}
  else if(a==="lock-snz"){u.snzMenu=true}
  else if(a==="snz-back"){u.snzMenu=false}
  else if(a==="snz"){var L5=u.lock,at=+el.dataset.at;S.snoozes.push({id:L5.id,type:L5.type,at:at});u.lock=null;u.snzMenu=false;toast("We'll remind you at "+fmt(at));log("Reminder snoozed until "+fmt(at)+" ("+byId(L5.id).title+")","info")}
  else if(a==="lock-off"){u.snzMenu=false;var L2=u.lock;u.lock=null;if(L2&&L2.type.indexOf("auto")===0)u.autoBanner={type:L2.type,id:L2.id}}
  else if(a==="lock-ci"){var L3=u.lock;u.lock=null;openRec(L3.id);openSheet("in",L3.id);log("Check in started from the notification","info")}
  else if(a==="lock-co"){var L4=u.lock;u.lock=null;openRec(L4.id);openSheet("out",L4.id);log("Check out started from the notification","info")}
  else if(a==="row-ci"||a==="rel-ci"){openSheet("in",el.dataset.id)}
  else if(a==="row-co"||a==="rel-co"){openSheet("out",el.dataset.id)}
  else if(a==="shows"){u.showActual=!u.showActual}
  else if(a==="early-out"){var eo=byId(el.dataset.id),msg2="Check-out opens at "+fmt(coOpensAt(eo));
    if(S.earlyStyle==="enabled")toast("Check-out isn't open yet. "+msg2,true);else toast(msg2);
    log("Check out tapped before it opens: opens at "+fmt(coOpensAt(eo)),"info")}
  else if(a==="early"){var er=byId(el.dataset.id),msg1="Check-in opens at "+fmt(er.start-S.cfg.early);
    if(S.earlyStyle==="enabled")toast("Check-in isn't open yet. "+msg1,true);else toast(msg1);
    log("Check in tapped before the window: opens at "+fmt(er.start-S.cfg.early),"info")}
  else if(a==="warn-ok"){u.warn=null}
  else if(a==="map-full"){u.mapFull=true;log("Opened the map in full screen","info")}
  else if(a==="map-close"){u.mapFull=false}
  else if(a==="ab-view"){var ab=u.autoBanner;u.autoBanner=null;openRec(ab.id)}
  else if(a==="ab-x"){u.autoBanner=null}
  else if(a==="stub"){toast("Not part of this prototype")}
  renderAll();
});
$("#screen").addEventListener("input",function(e){var k=e.target.dataset&&e.target.dataset.f;if(k){S.ui.form[k]=e.target.value;if(S.ui.ferr[k]){delete S.ui.ferr[k];var w=e.target.closest(".fld");if(w){w.classList.remove("err");var em=w.querySelector(".em");if(em)em.remove()}}}});

$("#selRec").addEventListener("change",function(e){openRec(e.target.value);renderAll()});
$("#tm").addEventListener("input",function(e){var n=+e.target.value;change(function(){S.now=n})});
$("#dist").addEventListener("input",function(e){var n=+e.target.value;change(function(){cur().dist=n})});
$("#tq").addEventListener("click",function(e){var b=e.target.closest("[data-tm]");if(b)change(function(){S.now=+b.dataset.tm})});
$("#dq").addEventListener("click",function(e){var b=e.target.closest("[data-dq]");if(b)change(function(){cur().dist=+b.dataset.dq})});
$("#ebs").addEventListener("change",function(e){S.earlyStyle=e.target.value;S.ui.warn=null;renderAll()});
$("#perm").addEventListener("change",function(e){var n=e.target.value;change(function(){S.perm=n})});
$("#addr").addEventListener("change",function(e){var n=e.target.value==="1";change(function(){cur().addrOk=n})});
$("#net").addEventListener("click",function(){change(function(){S.net=!S.net});log("Network "+(S.net?"online":"offline"),"info");syncPanel()});
$("#radius").addEventListener("change",function(e){var x=e.target.value;change(function(){S.cfg.radius=x==="custom"?750:+x})});
$("#radc").addEventListener("input",function(e){var n=+e.target.value;if(n>=50)change(function(){S.cfg.radius=n})});
$("#early").addEventListener("change",function(e){var n=+e.target.value;change(function(){S.cfg.early=n})});
$("#after").addEventListener("change",function(e){var n=+e.target.value;change(function(){S.cfg.after=n})});
$("#allowE").addEventListener("click",function(){change(function(){S.cfg.allowEmpty=!S.cfg.allowEmpty})});
$("#pops").addEventListener("click",function(){change(function(){S.cfg.popups=!S.cfg.popups;if(!S.cfg.popups)S.ui.lock=null})});
$("#autoIn").addEventListener("click",function(e){if(e.currentTarget.disabled)return;change(function(){S.cfg.autoIn=!S.cfg.autoIn})});
$("#autoOut").addEventListener("click",function(e){if(e.currentTarget.disabled)return;change(function(){S.cfg.autoOut=!S.cfg.autoOut})});
/* PRD 2.5: marking a field required while automatic capture is on asks first, naming the field and the option that will be turned off */
function fieldLabel(k,f){return (k==="ci"?CI:CO).filter(function(x){return x.k===f})[0].l}
function showConf(){
  var p=S.pendReq,box=$("#reqConf");
  if(!p){box.hidden=true;return}
  box.hidden=false;
  box.innerHTML='<span>Marking "'+esc(fieldLabel(p[0],p[1]))+'" required will turn off automatic check-'+(p[0]==="ci"?"in":"out")+'.</span><span class="rcb"><button id="rcCancel">Cancel</button><button id="rcOk" class="pri">Mark Required</button></span>';
}
$("#reqConf").addEventListener("click",function(e){
  var id=e.target.id,p=S.pendReq;if(!p)return;
  if(id==="rcCancel"){S.pendReq=null;showConf();renderAll()}
  if(id==="rcOk"){S.cfg[p[0]][p[1]].on=true;S.cfg[p[0]][p[1]].req=true;if(p[0]==="ci")S.cfg.autoIn=false;else S.cfg.autoOut=false;
    log("Marked \""+fieldLabel(p[0],p[1])+"\" required; automatic check-"+(p[0]==="ci"?"in":"out")+" turned off","info");S.pendReq=null;showConf();renderAll()}
});
$("#ftab").addEventListener("change",function(e){var c=e.target.dataset.fc;if(!c)return;var p=c.split(".");
  if(p[2]==="req"&&e.target.checked&&((p[0]==="ci"&&S.cfg.autoIn)||(p[0]==="co"&&S.cfg.autoOut))){e.target.checked=false;S.pendReq=p;showConf();return}
  S.cfg[p[0]][p[1]][p[2]]=e.target.checked;
  if(p[2]==="req"&&e.target.checked)S.cfg[p[0]][p[1]].on=true;if(p[2]==="on"&&!e.target.checked)S.cfg[p[0]][p[1]].req=false;renderAll()});

function reset(){S.snoozes=[];S.pendReq=null;showConf();S.recs=seed();S.cfg=cfg0();S.net=true;S.perm="granted";S.now=810;S.sel="m1";S.log=[];S.ui=ui0()}
function preset(n){
  reset();var m=cur();
  var seedIn=function(){m.ci={t:800,d:150,odo:"152",purpose:"Product demo",note:""}};
  var coSeed=function(){seedIn();m.co={t:862,d:120,obj:"Yes",odo:"158",note:"Completed."}};
  var target="m1",sheet=null,after=null;
  var X={
   happy:function(){sheet="in"},early:function(){S.now=700;S.earlyStyle="grey"},early2:function(){S.now=700;S.earlyStyle="enabled"},
   coearly:function(){m.ci={t:790,d:150,odo:"152",purpose:"Product demo",note:""};S.now=800;m.dist=150},far:function(){m.dist=1500;sheet="in"},missin:function(){S.now=880},
   perm:function(){S.perm="denied";sheet="in"},gps:function(){S.perm="gps";sheet="in"},offline:function(){S.net=false;sheet="in"},
   noaddr:function(){m.addrOk=false;sheet="in"},noaddr2:function(){m.addrOk=false;S.cfg.allowEmpty=true;sheet="in"},
   checkout:function(){seedIn();S.now=850;m.dist=150;sheet="out"},missout:function(){seedIn();S.now=940;m.dist=150},
   revert:function(){coSeed();S.now=900},revert2:function(){coSeed();S.now=940},
   lonly:function(){target="l1";S.now=1100;sheet="in"},
   lrev:function(){target="l4";S.now=1100},
   tonly:function(){target="t1";sheet="in"},
   deal:function(){target="d1";sheet="in"},
   "push-out":function(){seedIn();m.dist=150;S.now=905;after=function(){S.now=915}},
   "auto-in":function(){S.cfg.autoIn=true;S.cfg.ci.purpose.req=false;m.dist=900;after=function(){m.dist=240}},
   "auto-out":function(){S.cfg.autoOut=true;S.cfg.co.obj.req=false;seedIn();m.dist=150;after=function(){m.dist=900}},
   "auto-out2":function(){S.cfg.autoOut=true;S.cfg.co.obj.req=false;seedIn();m.dist=150;S.now=925;after=function(){S.now=935}},
   "push-open":function(){S.now=775;after=function(){S.now=780}},
   "push-arrive":function(){m.dist=900;after=function(){m.dist=240}}
  };
  X[n]();
  if(n==="lrev"){var l=byId("l4");l.co={t:730,d:75,obj:"Yes",odo:"",note:"Shared the brochure."}}
  log("Scenario: "+PRESETS.filter(function(p){return p[0]===n})[0][1],"info");
  openRec(target);
  if(n==="revert"||n==="revert2"||n==="lrev"){S.ui.rtab="details"}
  if(after){S.ui.rtab="overview";change(after)}
  else{if(sheet)openSheet(sheet);renderAll()}
}
$("#presets").addEventListener("click",function(e){var b=e.target.closest("[data-pre]");if(b)preset(b.dataset.pre)});

/* Swipe a list row left (touch or mouse) to reveal its check-in action */
(function(){
  var scr=$("#screen"),sx=0,sy=0,id=null,el=null,dx=0,drag=false,base=0;
  scr.addEventListener("pointerdown",function(e){
    var w=e.target.closest(".swr");if(!w||e.target.closest(".swa"))return;
    id=w.dataset.sw;el=w;sx=e.clientX;sy=e.clientY;dx=0;drag=false;base=w.classList.contains("open")?-96:0;
  });
  scr.addEventListener("pointermove",function(e){
    if(!el)return;var mx=e.clientX-sx,my=e.clientY-sy;
    if(!drag&&Math.abs(mx)>8&&Math.abs(mx)>Math.abs(my)){drag=true;el.classList.add("drag")}
    if(drag){dx=Math.max(-96,Math.min(0,base+mx));el.querySelector(".rw").style.transform="translateX("+dx+"px)"}
  });
  var end=function(){
    if(!el)return;
    if(drag){S.ui.swipe=dx<-44?id:null;suppress=true;setTimeout(function(){suppress=false},50);renderPhone()}
    el=null;drag=false;
  };
  scr.addEventListener("pointerup",end);scr.addEventListener("pointercancel",end);
})();

buildPanel();renderAll();
})();
