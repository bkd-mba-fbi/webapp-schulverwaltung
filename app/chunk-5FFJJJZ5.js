import{a as Gt}from"./chunk-Y4QYVF5K.js";import{a as _t}from"./chunk-TCEEBBQP.js";import{b as wt,c as Et,d as $t}from"./chunk-VNNH2VUZ.js";import{b as Pt}from"./chunk-KCOBA4SV.js";import{a as de}from"./chunk-GWJDWK72.js";import{C as Te,c as St,d as bt,e as vt,f as Ct,g as xt,r as yt,s as Tt,w as ye}from"./chunk-7TIAFCYF.js";import{$a as d,$b as tt,Ab as me,Bb as ge,Cb as W,Cd as Ce,D as $e,Dd as It,Eb as D,Fb as Qe,Gb as Se,H as Xe,Jc as v,K as Je,Kb as c,Kc as o,La as T,Lb as f,Lc as B,M as De,Mb as q,Nb as Ze,Nd as z,Oc as w,Od as U,P as C,Pc as S,Qa as G,Qb as et,Qc as be,Qd as xe,R as Me,Ra as Re,Rd as F,Sc as Fe,Sd as O,Va as _,Wc as u,X as R,Ya as ie,Yc as st,Za as ne,_ as x,_a as l,a as j,aa as P,ab as re,ad as oe,b as A,c as We,cc as it,cd as at,da as Z,eb as se,ec as H,ed as K,f as fe,fc as nt,g as V,gb as N,gc as rt,h as pe,ha as L,hb as I,hd as ot,ia as ee,ja as te,jd as Oe,kb as Ie,kd as ve,l as Pe,m as qe,n as m,nc as ae,nd as dt,o as ce,od as lt,qa as Ye,qb as ue,qd as pt,rb as p,s as he,sb as M,sd as ct,tb as b,vd as ut,w as Ke,wd as mt,x as ze,xd as gt,ya as a,yd as ft,za as $,zd as ht}from"./chunk-TTJNYD2F.js";var ai=(t,r)=>r.Key,oi=t=>({width:t});function di(t,r){if(t&1&&(l(0,"option",1),p(1),c(2,"translate"),d()),t&2){let e=I();G("ngValue",null),a(),b(" ",f(2,2,e.emptyLabel)," ")}}function li(t,r){if(t&1&&(l(0,"option",1),p(1),d()),t&2){let e=r.$implicit;G("ngValue",e),a(),b(" ",e.Value," ")}}var Dt=(()=>{class t{constructor(){this.options=[],this.allowEmpty=!0,this.emptyLabel="",this.value=null,this.disabled=!1,this.tabindex=0,this.width="auto",this.valueChange=new Ye,this.options$=new V([]),this.rawValue$=new V(null),this.value$=ce([this.rawValue$,this.options$]).pipe(m(([e,i])=>i&&i.find(n=>n.Key===e)||null))}ngOnChanges(e){e.value&&this.rawValue$.next(e.value.currentValue),e.options&&this.options$.next(e.options.currentValue)}static{this.\u0275fac=function(i){return new(i||t)}}static{this.\u0275cmp=P({type:t,selectors:[["bkd-select"]],inputs:{options:"options",allowEmpty:"allowEmpty",emptyLabel:"emptyLabel",value:"value",disabled:"disabled",tabindex:"tabindex",width:"width"},outputs:{valueChange:"valueChange"},standalone:!0,features:[L,D],decls:6,vars:9,consts:[[1,"form-select",3,"ngModelChange","tabindex","ngStyle","disabled","ngModel"],[3,"ngValue"]],template:function(i,n){i&1&&(l(0,"select",0),c(1,"async"),N("ngModelChange",function(y){return n.valueChange.emit(y&&y.Key)}),T(2,di,3,4,"option",1),ie(3,li,2,2,"option",1,ai),p(5,` >
`),d()),i&2&&(Ie("tabindex",n.tabindex),G("ngStyle",Se(7,oi,n.width))("disabled",n.disabled)("ngModel",f(1,5,n.value$)),a(2),_(n.allowEmpty?2:-1),a(),ne(n.options))},dependencies:[Ce,mt,gt,ut,ve,lt,H,it,O,F],changeDetection:0})}}return t})();var Mt=S({Id:o,Designation:v,StudentCount:o,Number:v});var je=S({Id:v,TestId:o,CourseRegistrationId:o,GradeId:u(o),GradeValue:u(o),GradeDesignation:u(v),Points:u(o),StudentId:o});var Rt=S({Id:o,CourseId:o,Date:oe,Designation:v,Weight:o,WeightPercent:o,IsPointGrading:B,MaxPoints:u(o),MaxPointsAdjusted:u(o),IsPublished:B,IsOwner:B,Owner:u(v),GradingScaleId:u(o),Results:u(w(je))});var Ft=S({Id:o}),Ot=be({HRef:u(v)}),pi=be({HasEvaluationStarted:B,EvaluationUntil:u(oe),HasReviewOfEvaluationStarted:B,HasTestGrading:B,Id:o}),ci=Fe([Ft,Ot,pi]),ui=be({Id:o,StudentCount:o}),mi=Fe([Ft,Ot,ui]),gi=S({Grade:v,AverageTestResult:o,Id:o,StudentId:o}),Ae=S({AverageTestResult:o,CanGrade:B,EventId:o,GradeId:u(o),GradeValue:u(o),Id:o,StudentId:o}),J=S({HRef:v,Id:o,Number:v,Designation:v,DateFrom:u(oe),DateTo:u(oe),StatusId:o,GradingScaleId:u(o),FinalGrades:u(w(gi)),Gradings:u(w(Ae)),Tests:u(w(Rt)),EvaluationStatusRef:ci,AttendanceRef:mi,ParticipatingStudents:u(w(Et)),Classes:u(w(Mt))}),jt=S({TestResults:w(je),Gradings:w(Ae)}),At=S({Gradings:w(Ae)});var _e=(()=>{class t extends de{constructor(e,i){super(e,i,J,"Courses"),this.statusCodec=S(at(this.codec.props,["Id","StatusId","EvaluationStatusRef"]))}getNumberOfCoursesForRating(){return this.http.get(`${this.baseUrl}/?expand=EvaluationStatusRef&fields=Id,StatusId,EvaluationStatusRef&filter.StatusId=;10300;10240`,{headers:{"X-Role-Restriction":"TeacherRole"}}).pipe(C(U(this.statusCodec)),m(e=>e.filter(i=>i.EvaluationStatusRef.HasEvaluationStarted===!0)),m(e=>e.length))}getExpandedCourses(e){return Gt(e,"TeacherRole")?this.http.get(`${this.baseUrl}/?expand=EvaluationStatusRef,AttendanceRef,Classes,FinalGrades&filter.StatusId=;${this.settings.eventlist.statusfilter}`,{headers:{"X-Role-Restriction":"TeacherRole"}}).pipe(C(U(J))):Pe([])}getExpandedCourse(e){return this.http.get(`${this.baseUrl}/${e}?expand=ParticipatingStudents,EvaluationStatusRef,Tests,Gradings,FinalGrades,Classes`).pipe(C(z(J)))}getExpandedCourseWithParticipants(e){return this.http.get(`${this.baseUrl}/${e}?expand=ParticipatingStudents,Classes,AttendanceRef`).pipe(C(z(J)))}getExpandedCoursesForDossier(){return this.http.get(`${this.baseUrl}/?expand=Tests,Gradings,FinalGrades,EvaluationStatusRef,ParticipatingStudents,Classes&filter.StatusId=;${this.settings.eventlist.statusfilter}`).pipe(C(U(J)))}getExpandedCoursesForStudent(){return this.http.get(`${this.baseUrl}/?expand=Tests,Gradings,FinalGrades&filter.StatusId=;${this.settings.eventlist.statusfilter}`,{headers:{"X-Role-Restriction":"StudentRole"}}).pipe(C(U(J)))}add(e,i,n,s,y,k,g){let h={Tests:[{Date:i,Designation:n,Weight:s,IsPointGrading:y,MaxPoints:k,MaxPointsAdjusted:g}]};return this.http.put(`${this.baseUrl}/${e}/Tests/New`,h).pipe(m(()=>{}))}update(e,i,n,s,y,k,g,h){let Q={Tests:[{Id:i,Designation:n,Date:s,Weight:y,IsPointGrading:k,MaxPoints:g,MaxPointsAdjusted:h}]};return this.http.put(`${this.baseUrl}/${e}/Tests/Update`,Q).pipe(m(()=>{}))}delete(e,i){let n={TestIds:[i]};return this.http.put(`${this.baseUrl}/${e}/Tests/Delete`,n).pipe(m(()=>i))}updateTestResult(e,i){let h=i,{studentId:n,testId:s}=h,y=We(h,["studentId","testId"]),k={StudentIds:[n],TestId:s},g="gradeId"in y?A(j({},k),{GradeId:y.gradeId}):A(j({},k),{Points:y.points});return this.http.put(`${this.baseUrl}/${e}/SetTestResult`,g).pipe(C(z(jt)),C(({TestResults:Q,Gradings:Le})=>Q.length<=1&&Le.length===1?Pe({courseId:e,testResult:Q[0]??null,grading:Le[0]}):qe(()=>new Error("`TestResults` or `Gradings` does not contain a single value"))))}setAverageAsFinalGrade(e){return this.http.put(`${this.baseUrl}/SetAverageTestResult`,e).pipe(C(z(At)))}publishTest(e){let i={TestIds:[e]};return this.http.put(`${this.baseUrl}/PublishTest`,i).pipe(m(()=>e))}unpublishTest(e){let i={TestIds:[e]};return this.http.put(`${this.baseUrl}/UnpublishTest`,i).pipe(m(()=>e))}static{this.\u0275fac=function(i){return new(i||t)(x(ae),x(K))}}static{this.\u0275prov=R({token:t,factory:t.\u0275fac,providedIn:"root"})}}return t})();function Vt(t){return t.length===0?0:Be(t.map(({value:r,weight:e})=>r*e))/Be(t.map(({weight:r})=>r))}function ke(t){return t.length===0?0:Number(Be(t)/t.length)}function Be(t){return t.reduce(fi,0)}function fi(t,r){return t+r}function Tn(t,r,e){return t?t.Tests?.reduce((i,n)=>i||n.Id===r&&n.Results?.find(s=>s.TestId===r&&s.StudentId===e)||null,null)??null:null}function _n(t,r,e){return r.map(i=>i.Id===t.TestId?Ne(t,i,e):i)}function Gn(t,r,e){return e.map(i=>i.Id===t?hi(r,i):i)}function wn(t,r){return r.map(e=>e.Id===t?A(j({},e),{IsPublished:!e.IsPublished}):e)}function En(t){let r=Si(t);if(r.length===0)throw new Error("unable to calculate averages without results");return ke(r)}function Ve(t){return t.MaxPointsAdjusted||t.MaxPoints}function Pn(t){let r=Ii(t);if(r.length===0)throw new Error("unable to calculate averages without results");return ke(r)}function Y(t,r){return r.Results?.find(e=>e.StudentId===t)}function $n(t,r){return r===null?null:r.filter(e=>e.Id!==t)}function Ne(t,r,e){let i=e&&r.Results?.find(s=>s.TestId===t.TestId&&s.StudentId===t.StudentId),n=r.Results?.filter(s=>!(s.TestId===t.TestId&&s.StudentId===t.StudentId))||[];return i&&e==="grade"?t.GradeId=i.GradeId:i&&e==="points"&&(t.Points=i.Points),A(j({},r),{Results:[...n,t]})}function Ht(t){return t.slice().sort((r,e)=>e.Date.getTime()-r.Date.getTime())}function Ge(t,r){return r?.find(e=>e.Id===t.GradingScaleId)||null}function hi(t,r){return A(j({},r),{Results:r.Results?.filter(e=>e.StudentId!==t)||[]})}function Ii(t){return t.Results?.filter(r=>r.GradeDesignation!==null).map(r=>Number(r.GradeDesignation)).filter(r=>!isNaN(r))||[]}function Si(t){return t.Results?.map(r=>r.Points!==null?r.Points:Nt).filter(r=>r>Nt)||[]}var Nt=-1;var On=S({Id:v,SubscriptionId:o,VssId:o,EventId:o,DropdownItems:u(w(_t)),IdPerson:o,ShowAsRadioButtons:B,Value:u(v)}),He=S({Id:o,EventId:u(o),PersonId:u(o),Status:v,EventDesignation:u(v)});var Ut=(()=>{class t extends de{constructor(e,i){super(e,i,He,"Subscriptions")}getSubscriptionIdsByStudentAndCourse(e,i){return this.http.get(`${this.baseUrl}/`,{params:{"filter.PersonId":`=${e}`,"filter.EventId":`;${i}`}}).pipe(C(U(st)),m(n=>n.map(s=>s.Id)))}getSubscriptionCountsByEvents(e){return this.http.get(`${this.baseUrl}/`,{params:{"filter.EventId":`;${e.join(";")}`,fields:["Id","EventId"].join(",")}}).pipe(C(U(S({Id:o,EventId:o}))),m(i=>i.reduce((n,s)=>(n[s.EventId]=n[s.EventId]?n[s.EventId]+1:1,n),{})))}getSubscriptionsByCourse(e,i){return this.http.get(`${this.baseUrl}/`,{params:A(j({"filter.EventId":`=${e}`},i),{fields:["Id","EventId","EventDesignation","PersonId","Status"].join(",")})}).pipe(C(U(He)))}static{this.\u0275fac=function(i){return new(i||t)(x(ae),x(K))}}static{this.\u0275prov=R({token:t,factory:t.\u0275fac,providedIn:"root"})}}return t})();var vi=S({Id:o,Designation:v}),Ue=S({Id:o,Grades:w(vi)});var Lt=(()=>{class t extends de{constructor(e,i){super(e,i,Ue,"GradingScales")}getGradingScale(e){return this.http.get(`${this.baseUrl}/${e}`).pipe(C(z(Ue)))}getGradingScales(e){return he(e.map(this.getGradingScale.bind(this)))}static{this.\u0275fac=function(i){return new(i||t)(x(ae),x(K))}}static{this.\u0275prov=R({token:t,factory:t.\u0275fac,providedIn:"root"})}}return t})();var we=(()=>{class t{constructor(e,i,n,s,y,k){this.coursesRestService=e,this.subscriptionRestService=i,this.reportsService=n,this.loadingService=s,this.gradingScalesRestService=y,this.settings=k,this.studentId$=new pe(1),this.initialStudentCourses$=this.studentId$.pipe(Xe(),C(this.loadCourses.bind(this)),m(g=>g.sort((h,Q)=>h.Designation.localeCompare(Q.Designation))),De(1)),this.action$=new pe(1),this.studentCourses$=Ke(this.action$,this.initialStudentCourses$.pipe(m(g=>({type:"initializeCourses",payload:g})))).pipe(Je(this.coursesReducer.bind(this),[]),De(1)),this.loading$=this.loadingService.loading$,this.studentCourseIds$=this.studentCourses$.pipe(m(g=>g.flatMap(h=>h.Id))),this.subscriptionIds$=ce([this.studentId$,this.studentCourseIds$]).pipe(C(([g,h])=>this.subscriptionRestService.getSubscriptionIdsByStudentAndCourse(g,h))),this.testReports$=this.subscriptionIds$.pipe(m(g=>this.reportsService.getTeacherSubscriptionGradesReports(g))),this.tests$=this.studentCourses$.pipe(m(g=>g.flatMap(h=>h.Tests).filter(ye))),this.gradingScaleIdsFromTests$=this.tests$.pipe(m(g=>[...g.map(h=>h.GradingScaleId)].filter(ye).filter(Te))),this.gradingScaleIdsFromCourses$=this.studentCourses$.pipe(m(g=>g.flatMap(h=>h.GradingScaleId).filter(ye).filter(Te))),this.gradingScaleIds$=ce([this.gradingScaleIdsFromCourses$,this.gradingScaleIdsFromTests$]).pipe(m(([g,h])=>g.concat(h).filter(Te))),this.gradingScales$=this.gradingScaleIds$.pipe(C(g=>he(g.map(h=>this.gradingScalesRestService.getGradingScale(h)))))}setStudentId(e){this.studentId$.next(e)}getFinalGradeForStudent(e,i){return e?.FinalGrades?.find(n=>n.StudentId===i)}getGradingForStudent(e,i){return e?.Gradings?.find(n=>n.StudentId===i)}getGradingScaleOfCourse(e,i){return i?.find(n=>n.Id===e.GradingScaleId)}getGradesForStudent(e,i,n){return e.Tests?.flatMap(s=>({value:Number(Ge(s,n)?.Grades.find(k=>k.Id===Y(i,s)?.GradeId)?.Designation),weight:s.Weight})).filter(({value:s})=>!!s)||[]}updateStudentCourses(e){this.action$.next({type:"updateCourses",payload:e})}loadCourses(e){return this.loadingService.load(this.coursesRestService.getExpandedCoursesForDossier().pipe(m(i=>i.filter(n=>n.ParticipatingStudents?.find(s=>s.Id===e)))))}coursesReducer(e,i){switch(i.type){case"initializeCourses":return i.payload;case"updateCourses":return this.updateCourses([...e],i.payload);default:return e}}updateCourses(e,i){return e.map(n=>A(j({},n),{Tests:n.Tests!==null?n.Tests.map(s=>s.Id===i.Id?i:s):null}))}static{this.\u0275fac=function(i){return new(i||t)(x(_e),x(Ut),x($t),x(Pt),x(Lt),x(K))}}static{this.\u0275prov=R({token:t,factory:t.\u0275fac})}}return t})();var qt=(()=>{class t{constructor(){}get inIframe(){return window.parent!==window}get window(){return this.inIframe?window.parent:null}get document(){return this.window?.document.documentElement??null}querySelector(e){return this.window?.document?.querySelector("bkd-portal")?.shadowRoot?.querySelector(e)??null}getIframeElement(){return this.querySelector("bkd-content")?.shadowRoot?.querySelector("iframe")??null}getIframeTop(){return this.getIframeElement()?.offsetTop??0}getIFrameBottom(){let e=this.getIframeElement();return e?e.offsetTop+e.offsetHeight:0}static{this.\u0275fac=function(i){return new(i||t)}}static{this.\u0275prov=R({token:t,factory:t.\u0275fac,providedIn:"root"})}}return t})();var Kt=(()=>{class t{constructor(e,i){this.modal=e,this.portal=i}open(...e){let i=this.modal.open(...e);return this.applyPortalOffsetAndMaxHeight(i),this.disablePortalScrolling(i),i}get activeInstances(){return this.modal.activeInstances}dismissAll(...e){return this.modal.dismissAll(...e)}hasOpenModals(...e){return this.modal.hasOpenModals(...e)}applyPortalOffsetAndMaxHeight(e){let i=this.getModalWindowElement(e);if(!i){console.warn("Trying to apply portal offset to <ngb-modal-window>, but element is not present!");return}this.portal.window&&(i.style.top=`${this.getModalIframeOffset()}px`,i.style.maxHeight=`${this.getModalHeight()}px`)}disablePortalScrolling(e){if(this.portal.window&&this.portal.document){let i=this.portal.window.innerWidth-this.portal.document.clientWidth;this.portal.document.style.paddingRight=`${i}px`,this.portal.document.style.overflow="hidden"}e.hidden.subscribe(()=>{this.portal.document&&(this.portal.document.style.paddingRight="0px",this.portal.document.style.overflow="auto")})}getModalWindowElement(e){return e._windowCmptRef?.instance?._elRef?.nativeElement??null}getModalIframeOffset(){return Math.max(this.getViewportTop()-this.portal.getIframeTop(),0)}getModalTop(){return Math.max(this.getViewportTop(),this.portal.getIframeTop())}getModalBottom(){return Math.min(this.getViewportBottom(),this.portal.getIFrameBottom())}getModalHeight(){return this.getModalBottom()-this.getModalTop()}getViewportTop(){return this.portal.window?.scrollY??0}getViewportBottom(){return this.getViewportTop()+this.getViewportHeight()}getViewportHeight(){return this.portal.window?.innerHeight??0}static{this.\u0275fac=function(i){return new(i||t)(x(Tt),x(qt))}}static{this.\u0275prov=R({token:t,factory:t.\u0275fac,providedIn:"root"})}}return t})();function Ee(t,r,e){return r?r.Grade:_i(t,e)||t?.GradeValue}function _i(t,r){return r?.Grades.find(e=>e.Id===t?.GradeId)?.Designation}var Gi="1-3",Xt="\u2013",Jt=(()=>{class t{constructor(e){this.locale=e}transform(e,i,n){let s=Number(e??null);return isNaN(s)?Xt:wi(Number(e??null),n??this.locale,i)}static{this.\u0275fac=function(i){return new(i||t)($(et,16))}}static{this.\u0275pipe=Z({name:"decimalOrDash",type:t,pure:!0,standalone:!0})}}return t})();function wi(t,r,e){return t===0?Xt:tt(t,r,`1.${Ei(e)}`)}function Ei(t){return t?String(t).includes("-")?String(t):`${t}-${t}`:Gi}var Yt=(()=>{class t{constructor(){}getGradeForStudent(){return Ee(this.grading,this.finalGrade,this.gradingScale)}static{this.\u0275fac=function(i){return new(i||t)}}static{this.\u0275cmp=P({type:t,selectors:[["bkd-dossier-grades-final-grade"]],inputs:{finalGrade:"finalGrade",grading:"grading",gradingScale:"gradingScale",average:"average"},standalone:!0,features:[D],decls:14,vars:11,consts:[[1,"final-entry"],["data-testid","final-grade"],["data-testid","average-test-results"]],template:function(i,n){i&1&&(l(0,"div",0)(1,"div"),p(2),c(3,"translate"),d(),l(4,"div",1)(5,"span"),p(6),d()(),l(7,"div"),p(8),c(9,"translate"),d(),l(10,"div",2)(11,"span"),p(12),c(13,"decimalOrDash"),d()()()),i&2&&(a(2),M(f(3,4,"dossier.grade")),a(4),M(n.getGradeForStudent()||"\u2013"),a(2),M(f(9,6,"dossier.average")),a(4),M(q(13,8,n.average,"1-3")))},dependencies:[O,F,Jt],styles:[".final-entry[_ngcontent-%COMP%]{padding:1rem;display:grid;grid-template-columns:repeat(2,1fr)}span[_ngcontent-%COMP%]{margin-left:2em}"]})}}return t})();var Qt=(()=>{class t{constructor(e){this.translate=e}transform(e,i,n,s="tests.points"){return e.IsPointGrading&&(e.IsPublished||n)?`${Y(i,e)?.Points||"\u2013"} / ${e.MaxPointsAdjusted||e.MaxPoints} ${this.translate.instant(s)}`:""}static{this.\u0275fac=function(i){return new(i||t)($(xe,16))}}static{this.\u0275pipe=Z({name:"bkdTestPoints",type:t,pure:!0,standalone:!0})}}return t})();var Zt=(()=>{class t{constructor(e){this.translate=e}transform(e){return`${this.translate.instant("tests.factor")} ${e.Weight} (${e.WeightPercent}%)`}static{this.\u0275fac=function(i){return new(i||t)($(xe,16))}}static{this.\u0275pipe=Z({name:"bkdTestWeight",type:t,pure:!0,standalone:!0})}}return t})();var Pi=t=>({maxPoints:t});function $i(t,r){if(t&1&&(l(0,"div",13),p(1),c(2,"translate"),d()),t&2){let e=I(2);a(),b(" ",q(2,1,"global.validation-errors.invalidPoints",Se(4,Pi,e.maxPoints))," ")}}function Di(t,r){if(t&1){let e=se();l(0,"div",3)(1,"label",11),p(2),c(3,"translate"),d(),l(4,"div",6)(5,"input",12,0),N("input",function(){ee(e);let n=ue(6),s=I();return te(s.onPointsChange(n.value))}),d()(),T(7,$i,3,6,"div",13),d()}if(t&2){let e=I();a(2),M(f(3,8,"dossier.dialog.points")),a(2),Re("is-invalid",e.pointsInput.errors),a(),Re("is-invalid",e.pointsInput.errors),Ie("max",e.maxPoints),G("formControl",e.pointsInput),a(2),_(e.pointsInput.errors?7:-1)}}var ei=500,ti=(()=>{class t{constructor(e,i){this.activeModal=e,this.courseService=i,this.maxPoints=0,this.gradeSubject$=new fe,this.pointsSubject$=new fe,this.closeButtonDisabled$=new V(!1),this.gradingScaleDisabled$=new V(!0),this.grade$=this.gradeSubject$.pipe($e(ei)),this.points$=this.pointsSubject$.pipe($e(ei),ze(this.isValid.bind(this)),m(Number)),this.destroy$=new fe}ngOnInit(){this.maxPoints=Ve(this.test),this.pointsInput=new dt({value:this.points,disabled:!1},[Oe.min(0),Oe.pattern("[0-9]+([\\.][0-9]+)?"),this.maxPointValidator()]),this.gradingScaleDisabled$.next(this.test.IsPointGrading&&this.points>0),this.points$.pipe(Me(this.destroy$)).subscribe(e=>this.updateTestResult({studentId:this.studentId,testId:this.test.Id,points:e})),this.grade$.pipe(Me(this.destroy$)).subscribe(e=>this.updateTestResult({studentId:this.studentId,testId:this.test.Id,gradeId:e}))}onGradeChange(e){this.gradeSubject$.next(e)}onPointsChange(e){this.pointsSubject$.next(e),this.gradingScaleDisabled$.next(e.length>0)}updateTestResult(e){this.closeButtonDisabled$.next(!0),this.courseService.updateTestResult(this.test.CourseId,e).subscribe(({testResult:i})=>{this.gradeId=i?.GradeId??null,this.updatedTestResult=i,this.closeButtonDisabled$.next(!1)})}isValid(e){return e===""||isNaN(Number(e))?!1:!(Number(e)<0||Number(e)>this.maxPoints)}maxPointValidator(){return e=>Number(e.value)>Ve(this.test)?{customMax:!0}:null}static{this.\u0275fac=function(i){return new(i||t)($(yt),$(_e))}}static{this.\u0275cmp=P({type:t,selectors:[["bkd-dossier-grades-edit"]],inputs:{test:"test",gradeId:"gradeId",gradeOptions:"gradeOptions",points:"points",studentId:"studentId"},standalone:!0,features:[D],decls:19,vars:20,consts:[["pointInput",""],[1,"modal-body"],[1,"mb-4"],[1,"form-group","row"],[1,"form-group","row","mt-2"],["for","grade",1,"col-6","col-form-label"],[1,"col-6"],["id","grade",3,"valueChange","options","value","allowEmpty","disabled"],[1,"text-muted","mt-4"],[1,"modal-footer"],["type","button",1,"btn","btn-primary",3,"click","disabled"],["for","points",1,"col-6","col-form-label"],["id","points","type","number","step","0.01","min","0",1,"form-control",3,"input","max","formControl"],["data-testid","validation-error-message",1,"invalid-feedback","col-6","offset-6"]],template:function(i,n){i&1&&(l(0,"div",1)(1,"p",2),p(2),d(),T(3,Di,8,10,"div",3),l(4,"div",4)(5,"label",5),p(6),c(7,"translate"),d(),l(8,"div",6)(9,"bkd-select",7),c(10,"async"),N("valueChange",function(y){return y&&n.onGradeChange(y)}),d()()(),l(11,"p",8),p(12),c(13,"translate"),d()(),l(14,"div",9)(15,"button",10),c(16,"async"),N("click",function(){return n.activeModal.close(n.updatedTestResult)}),p(17),c(18,"translate"),d()()),i&2&&(a(2),M(n.test.Designation),a(),_(n.test.IsPointGrading?3:-1),a(3),M(f(7,10,"dossier.dialog.grade")),a(3),G("options",n.gradeOptions)("value",n.gradeId)("allowEmpty",!1)("disabled",f(10,12,n.gradingScaleDisabled$)),a(3),b(" ",f(13,14,n.test.IsPointGrading?"dossier.dialog.hint.points":"dossier.dialog.hint.grade")," "),a(3),G("disabled",f(16,16,n.closeButtonDisabled$)),a(2),b(" ",f(18,18,"dossier.dialog.close")," "))},dependencies:[Ce,ot,pt,ve,ht,ft,It,ct,Dt,H,O,F]})}}return t})();function Mi(t,r){if(t&1){let e=se();l(0,"a",10),N("click",function(){ee(e);let n=I(2),s=W(0);return te(n.editGrading(s))}),l(1,"i",11),p(2,"edit"),d(),l(3,"span",5),p(4),d()()}if(t&2){I(2);let e=W(2);a(4),M(e)}}function Ri(t,r){if(t&1&&(l(0,"span",5),p(1),d()),t&2){I(2);let e=W(2);a(),M(e)}}function Fi(t,r){if(t&1&&(l(0,"div",9),p(1),c(2,"translate"),d()),t&2){I(2);let e=W(0);a(),b(" ",f(2,1,e.IsPublished?"tests.published":"tests.not-published")," ")}}function Oi(t,r){if(t&1&&(l(0,"div",0)(1,"div",1),p(2),d(),l(3,"div",2),p(4),c(5,"date"),d(),l(6,"div",3),T(7,Mi,5,1,"a",4)(8,Ri,2,1,"span",5),d(),l(9,"div",6),p(10),c(11,"bkdTestWeight"),d(),l(12,"div",7)(13,"span"),p(14),c(15,"bkdTestPoints"),d()(),l(16,"div",8),p(17),d(),T(18,Fi,3,3,"div",9),d()),t&2){let e=I(),i=W(0);a(2),b(" ",i.Designation," "),a(2),b(" ",q(5,7,i.Date,"dd.MM.yyyy")," "),a(3),_(e.isEditable&&i.IsOwner?7:8),a(3),b(" ",f(11,10,i)," "),a(4),M(Ze(15,12,i,e.studentId,e.isEditable,"dossier.points")),a(3),b(" ",i.Owner," "),a(),_(e.isEditable?18:-1)}}var ii=(()=>{class t{constructor(e,i){this.gradeService=e,this.modalService=i,this.test$=new pe(1),this.grading$=this.test$.pipe(m(this.getGrading.bind(this)))}ngOnChanges(e){e.test&&this.test$.next(this.test)}editGrading(e){let i=this.modalService.open(ti,{backdrop:"static"});i.componentInstance.test=e,i.componentInstance.gradeId=this.getGradeId(e),i.componentInstance.gradeOptions=t.mapToOptions(this.gradingScale),i.componentInstance.studentId=this.studentId,i.componentInstance.points=this.getPoints(e),i.result.then(n=>{n&&this.updateStudentGrade(n,e)},()=>{})}updateStudentGrade(e,i){let n=Ne(e,i);this.gradeService.updateStudentCourses(n)}getGrading(e){return this.gradingScale?.Grades.find(i=>i.Id===this.getGradeId(e))?.Designation||"\u2013"}getGradeId(e){return Y(this.studentId,e)?.GradeId||null}getPoints(e){return Y(this.studentId,e)?.Points||null}static mapToOptions(e){return e?.Grades.map(i=>({Key:i.Id,Value:i.Designation}))||null}static{this.\u0275fac=function(i){return new(i||t)($(we),$(Kt))}}static{this.\u0275cmp=P({type:t,selectors:[["bkd-dossier-single-test"]],inputs:{test:"test",studentId:"studentId",gradingScale:"gradingScale",isEditable:"isEditable"},standalone:!0,features:[L,D],decls:5,vars:7,consts:[[1,"test-entry"],["data-testid","test-designation",1,"designation"],["data-testid","test-date",1,"date"],[1,"grade"],["aria-label","edit grade",1,"btn","btn-link"],["data-testid","test-grade"],["data-testid","test-factor",1,"factor"],["data-testid","test-points",1,"points"],["data-testid","test-teacher",1,"teacher"],["data-testid","test-status",1,"state"],["aria-label","edit grade",1,"btn","btn-link",3,"click"],["data-testid","test-grade-edit-icon",1,"material-icons"]],template:function(i,n){if(i&1&&(me(0),c(1,"async"),me(2),c(3,"async"),T(4,Oi,19,17,"div",0)),i&2){let s=ge(f(1,1,n.test$));a(2),ge(f(3,4,n.grading$)),a(2),_(s?4:-1)}},dependencies:[H,nt,O,F,Qt,Zt],styles:['.test-entry[_ngcontent-%COMP%]{border-top:1px solid #dee2e6;padding:1rem;display:grid;grid-template-areas:"designation designation grade factor" "date date points ." "teacher teacher . ." "state state . .";grid-template-columns:repeat(4,1fr)}span[_ngcontent-%COMP%]{margin-left:2em}.designation[_ngcontent-%COMP%]{grid-area:designation}.date[_ngcontent-%COMP%]{grid-area:date}.grade[_ngcontent-%COMP%]{grid-area:grade}.grade[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{display:flex;color:#000;padding:0;text-decoration:none}.grade[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{text-decoration:underline}.grade[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:hover{text-decoration-color:#ea161f}.grade[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{margin-right:-1em;color:#00000080}.points[_ngcontent-%COMP%]{grid-area:points;color:#00000080}.teacher[_ngcontent-%COMP%]{grid-area:teacher}.state[_ngcontent-%COMP%]{grid-area:state}@media (max-width: 575.98px){.test-entry[_ngcontent-%COMP%]{grid-template-areas:"designation designation" "date grade" "factor points" "teacher teacher" "state state";grid-template-columns:repeat(2,1fr)}}']})}}return t})();var ji=(t,r)=>r.Id,Ai=()=>[];function Bi(t,r){if(t&1&&re(0,"bkd-dossier-single-test",2),t&2){let e=r.$implicit,i=I(2);G("test",e)("studentId",i.studentId)("gradingScale",i.getGradingScaleOfTest(e))("isEditable",i.isEditable)}}function ki(t,r){if(t&1&&(l(0,"div"),re(1,"bkd-dossier-grades-final-grade",1),ie(2,Bi,1,4,"bkd-dossier-single-test",2,ji),d()),t&2){let e=I(),i=W(0);a(),G("finalGrade",e.decoratedCourse.finalGrade)("grading",e.decoratedCourse.grading)("gradingScale",e.decoratedCourse.gradingScale)("average",e.decoratedCourse.average),a(),ne(i)}}function Vi(t,r){t&1&&(l(0,"p",0),p(1),c(2,"translate"),d()),t&2&&(a(),b(" ",f(2,1,"dossier.no-tests")," "))}var ni=(()=>{class t{ngOnChanges(e){e.decoratedCourse&&this.sortedTests$.next(this.sortedTests())}constructor(){this.sortedTests$=new V([])}sortedTests(){return this.decoratedCourse.course.Tests?Ht(this.decoratedCourse.course.Tests):[]}getGradingScaleOfTest(e){return Ge(e,this.gradingScales)}static{this.\u0275fac=function(i){return new(i||t)}}static{this.\u0275cmp=P({type:t,selectors:[["bkd-dossier-course-tests"]],inputs:{studentId:"studentId",decoratedCourse:"decoratedCourse",gradingScales:"gradingScales",isEditable:"isEditable"},standalone:!0,features:[L,D],decls:4,vars:5,consts:[["data-testid","message-no-tests",1,"p-3"],[3,"finalGrade","grading","gradingScale","average"],[3,"test","studentId","gradingScale","isEditable"]],template:function(i,n){if(i&1&&(me(0),c(1,"async"),T(2,ki,4,4,"div")(3,Vi,3,3,"p",0)),i&2){let s,y=ge((s=f(1,1,n.sortedTests$))!==null&&s!==void 0?s:Qe(4,Ai));a(2),_(y.length>0?2:3)}},dependencies:[Yt,ii,H,O,F]})}}return t})();function Ni(t,r){if(t&1&&(l(0,"span",0),p(1),d()),t&2){let e=I();a(),b(" (",e.grade,")")}}function Hi(t,r){if(t&1&&(l(0,"span",1),p(1),c(2,"number"),d()),t&2){let e=I();a(),b(" (",q(2,1,e.average,"1.1-3"),")")}}var ri=(()=>{class t{constructor(){}get grade(){return this.getGradeForStudent()}getGradeForStudent(){return Ee(this.grading,this.finalGrade,this.gradingScale)}static{this.\u0275fac=function(i){return new(i||t)}}static{this.\u0275cmp=P({type:t,selectors:[["bkd-dossier-grades-course-header"]],inputs:{designation:"designation",finalGrade:"finalGrade",grading:"grading",gradingScale:"gradingScale",average:"average"},standalone:!0,features:[D],decls:3,vars:3,consts:[["data-testId","grade",1,"grade"],["data-testId","average",1,"average"]],template:function(i,n){i&1&&(p(0),T(1,Ni,2,1,"span",0)(2,Hi,3,4,"span",1)),i&2&&(b("",n.designation,`
`),a(),_(n.grade?1:-1),a(),_(!n.grade&&n.average?2:-1))},dependencies:[rt],styles:[".average[_ngcontent-%COMP%]{color:#00000080}"]})}}return t})();var Ui=(t,r)=>r.course.Id;function Li(t,r){if(t&1&&re(0,"bkd-dossier-course-tests",9),t&2){let e=I().$implicit,i=I(2);G("decoratedCourse",e)("studentId",i.studentId)("gradingScales",i.gradingScales)("isEditable",i.isEditable)}}function Wi(t,r){if(t&1){let e=se();l(0,"div")(1,"div",2)(2,"div",3,0)(4,"div",4)(5,"bkd-student-dossier-entry-header",5),N("click",function(){ee(e);let n=ue(3);return te(n.toggle())}),re(6,"bkd-dossier-grades-course-header",6),d()(),l(7,"div",7)(8,"div",8),T(9,Li,1,4,"ng-template"),d()()()()()}if(t&2){let e=r.$implicit,i=ue(3);a(5),G("opened",!i.collapsed),a(),G("designation",e.course.Designation)("finalGrade",e.finalGrade)("grading",e.grading)("gradingScale",e.gradingScale)("average",e.average)}}function qi(t,r){if(t&1&&(ie(0,Wi,10,6,"div",null,Ui),c(2,"async")),t&2){let e=I();ne(f(2,0,e.decoratedCoursesSubject$))}}function Ki(t,r){t&1&&(l(0,"p",1),p(1),c(2,"translate"),d()),t&2&&(a(),b(" ",f(2,1,"dossier.no-courses")," "))}var zr=(()=>{class t{constructor(e){this.dossierGradesService=e,this.isEditable=!0,this.decoratedCoursesSubject$=new V([])}ngOnChanges(){this.decoratedCoursesSubject$.next(this.decorateCourses())}decorateCourses(){return this.courses.map(e=>{let i=this.dossierGradesService.getFinalGradeForStudent(e,this.studentId),n=this.dossierGradesService.getGradesForStudent(e,this.studentId,this.gradingScales);return{course:e,finalGrade:i,grading:this.dossierGradesService.getGradingForStudent(e,this.studentId),gradingScale:this.dossierGradesService.getGradingScaleOfCourse(e,this.gradingScales),average:i?.AverageTestResult||Vt(n)}})}static{this.\u0275fac=function(i){return new(i||t)($(we))}}static{this.\u0275cmp=P({type:t,selectors:[["bkd-dossier-grades-view"]],inputs:{courses:"courses",studentId:"studentId",gradingScales:"gradingScales",isEditable:"isEditable"},standalone:!0,features:[L,D],decls:2,vars:1,consts:[["courses","ngbAccordionItem"],["data-testid","message-no-courses",1,"py-3"],["ngbAccordion",""],["ngbAccordionItem",""],["ngbAccordionHeader",""],[3,"click","opened"],[3,"designation","finalGrade","grading","gradingScale","average"],["ngbAccordionCollapse",""],["ngbAccordionBody",""],[3,"decoratedCourse","studentId","gradingScales","isEditable"]],template:function(i,n){i&1&&T(0,qi,3,2)(1,Ki,3,3,"p",1),i&2&&_(n.courses.length>0?0:1)},dependencies:[xt,Ct,vt,wt,ri,bt,St,ni,H,O,F]})}}return t})();export{ke as a,Tn as b,_n as c,Gn as d,wn as e,En as f,Pn as g,$n as h,Ht as i,Xt as j,Jt as k,wi as l,Dt as m,Mt as n,Ae as o,_e as p,On as q,Ut as r,Lt as s,we as t,qt as u,Kt as v,zr as w};