!function(){function e(e){return function(e){if(Array.isArray(e))return t(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,n){if(!e)return;if("string"==typeof e)return t(e,n);var c=Object.prototype.toString.call(e).slice(8,-1);"Object"===c&&e.constructor&&(c=e.constructor.name);if("Map"===c||"Set"===c)return Array.from(e);if("Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c))return t(e,n)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function t(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,c=new Array(t);n<t;n++)c[n]=e[n];return c}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){for(var n=0;n<t.length;n++){var c=t[n];c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(e,c.key,c)}}function i(e,t,n){return t&&c(e.prototype,t),n&&c(e,n),e}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&s(e,t)}function s(e,t){return(s=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function r(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}();return function(){var n,c=l(e);if(t){var i=l(this).constructor;n=Reflect.construct(c,arguments,i)}else n=c.apply(this,arguments);return o(this,n)}}function o(e,t){return!t||"object"!=typeof t&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function l(e){return(l=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{pXY1:function(t,c,s){"use strict";s.r(c),s.d(c,"EditAbsencesModule",function(){return bt});var o=s("PCNd"),l=s("tyNb"),b=s("itXk"),u=s("UXun"),d=s("lJxs"),f=s("1G5W"),p=s("v6cN"),h=s("CCnw"),g=s("CqUA"),m=s("KJh6"),v=s("FJ3f"),y=s("eB9A"),S=s("NPit"),z=s("fhBx"),O=s("Xr/R"),I=s("RYjX");function R(e,t,n){return e.map(function(e){var c,i=null;return e.TypeRef.Id&&(i=t.find(function(t){return t.Id===e.TypeRef.Id})||null),e.ConfirmationStateId&&(c=n.find(function(t){return t.Key===e.ConfirmationStateId})),new I.b(e,i,null,c)})}var k,C,$,T,j=s("fXoL"),P=s("ofXK"),D=((k=function(e){a(c,e);var t=r(c);function c(e,i,a,s,r,o){var l;return n(this,c),(l=t.call(this,e,i,a,"/edit-absences")).lessonPresencesService=s,l.presenceTypesService=r,l.dropDownItemsService=o,l.presenceTypes$=l.loadPresenceTypes().pipe(Object(u.a)(1)),l.absenceConfirmationStates$=l.loadAbsenceConfirmationStates().pipe(Object(d.a)(v.b),Object(u.a)(1)),l.presenceControlEntries$=Object(b.a)([l.entries$,l.presenceTypes$,l.absenceConfirmationStates$]).pipe(Object(d.a)(Object(y.a)(R)),Object(u.a)(1)),l.selected=[],l.queryParamsString$.pipe(Object(f.a)(l.destroy$)).subscribe(function(e){return l.confirmBackLinkParams={returnparams:e}}),l}return i(c,[{key:"resetSelection",value:function(){this.selected=[]}},{key:"getInitialFilter",value:function(){return{student:null,educationalEvent:null,studyClass:null,dateFrom:null,dateTo:null,presenceTypes:null,confirmationStates:null,incidentTypes:null}}},{key:"isValidFilter",value:function(e){return Boolean(e.student||e.educationalEvent||e.studyClass||e.dateFrom||e.dateTo||e.presenceTypes||e.confirmationStates||e.incidentTypes)}},{key:"loadEntries",value:function(e,t,n){return this.loadingService.load(this.lessonPresencesService.getFilteredList(e,n,{sort:"StudentFullName.asc,LessonDateTimeFrom.asc"}),z.a)}},{key:"buildParamsFromFilter",value:function(e){return Object(S.a)(e)}},{key:"loadPresenceTypes",value:function(){return this.loadingService.load(this.presenceTypesService.activePresenceTypes$)}},{key:"loadAbsenceConfirmationStates",value:function(){return this.loadingService.load(this.dropDownItemsService.getAbsenceConfirmationStates())}}]),c}(z.b)).\u0275fac=function(e){return new(e||k)(j.Zb(P.i),j.Zb(g.a),j.Zb(O.a),j.Zb(h.a),j.Zb(m.a),j.Zb(p.a))},k.\u0275prov=j.Ib({token:k,factory:k.\u0275fac}),k),F=s("qUtt"),E=s("0HM3"),w=((C=function(){function e(t){n(this,e),this.state=t}return i(e,[{key:"ngOnInit",value:function(){}}]),e}()).\u0275fac=function(e){return new(e||C)(j.Mb(D))},C.\u0275cmp=j.Gb({type:C,selectors:[["erz-edit-absences"]],features:[j.yb([D,{provide:F.a,useExisting:D},{provide:E.a,useValue:"/edit-absences"}])],decls:1,vars:0,template:function(e,t){1&e&&j.Nb(0,"router-outlet")},directives:[l.k],styles:["[_nghost-%COMP%]{display:block}"],changeDetection:0}),C),A=s("XNiG"),x=s("IzEk"),B=s("wO+i"),M=s("pLZG"),G=s("ulei"),q=(($=function(e){a(c,e);var t=r(c);function c(){return n(this,c),t.apply(this,arguments)}return c}(G.a)).\u0275fac=function(e){return N(e||$)},$.\u0275prov=j.Ib({token:$,factory:$.\u0275fac}),$),N=j.Ub(q),L=s("yl8S"),_=s("KCaQ"),V=s("K+0v"),K=s("EOpz"),H=s("1kSV"),X=s("M34a"),Z=s("vlqf"),J=s("YDIV"),U=s("PAVU"),Y=s("vjgy"),Q=s("mmcK"),W=s("4vbw"),ee=s("sYmb"),te=s("jSy9"),ne=s("DKSB"),ce=s("/N9o"),ie=((T=function(){function e(t,c,i,a,s){var r=this;n(this,e),this.studentsService=t,this.educationalEventsService=c,this.studyClassService=i,this.state=a,this.translate=s,this.filter={student:null,educationalEvent:null,studyClass:null,dateFrom:null,dateTo:null,presenceTypes:null,confirmationStates:null,incidentTypes:null},this.filterChange=new j.n,this.absenceConfirmationStatesGrouped$=this.state.absenceConfirmationStates$.pipe(Object(d.a)(function(e){return Object(U.a)(e,r.translate.instant("shared.multiselect.all-option"))})),this.presenceTypesGrouped$=this.state.presenceTypes$.pipe(Object(d.a)(function(e){return e.filter(Object(V.d)(Z.d)).filter(Object(V.d)(Z.f))}),Object(d.a)(U.c),Object(d.a)(U.b),Object(d.a)(function(e){return Object(U.a)(e,r.translate.instant("shared.multiselect.all-option"))})),this.incidentTypesGrouped$=this.state.presenceTypes$.pipe(Object(d.a)(function(e){return e.filter(Z.f)}),Object(d.a)(U.c),Object(d.a)(U.b),Object(d.a)(function(e){return Object(U.a)(e,r.translate.instant("shared.multiselect.all-option"))})),this.classesHttpFilter={params:{fields:"IsActive","filter.IsActive":"=true"}}}return i(e,[{key:"ngOnInit",value:function(){}},{key:"show",value:function(){this.filterChange.emit(Object.assign(Object.assign({},this.filter),{dateFrom:ae(this.filter.dateFrom),dateTo:ae(this.filter.dateTo)}))}}]),e}()).\u0275fac=function(e){return new(e||T)(j.Mb(Q.a),j.Mb(Y.a),j.Mb(W.a),j.Mb(D),j.Mb(ee.d))},T.\u0275cmp=j.Gb({type:T,selectors:[["erz-edit-absences-header"]],inputs:{filter:"filter"},outputs:{filterChange:"filterChange"},features:[j.yb([{provide:H.c,useClass:H.d},{provide:H.e,useClass:J.a}])],decls:49,vars:48,consts:[[1,"filters","mb-2"],[1,"form-group"],[3,"typeaheadService","value","valueChange"],[3,"typeaheadService","value","additionalHttpParams","valueChange"],[3,"value","valueChange"],[1,"filters","mt-2"],[3,"options","values","valuesChange"],[1,"buttons"],["type","button",1,"btn","btn-primary",3,"click"]],template:function(e,t){1&e&&(j.Sb(0,"div",0),j.Sb(1,"div",1),j.Sb(2,"label"),j.Dc(3),j.gc(4,"translate"),j.Rb(),j.Sb(5,"erz-typeahead",2),j.dc("valueChange",function(e){return t.filter.student=e}),j.Rb(),j.Rb(),j.Sb(6,"div",1),j.Sb(7,"label"),j.Dc(8),j.gc(9,"translate"),j.Rb(),j.Sb(10,"erz-typeahead",2),j.dc("valueChange",function(e){return t.filter.educationalEvent=e}),j.Rb(),j.Rb(),j.Sb(11,"div",1),j.Sb(12,"label"),j.Dc(13),j.gc(14,"translate"),j.Rb(),j.Sb(15,"erz-typeahead",3),j.dc("valueChange",function(e){return t.filter.studyClass=e}),j.Rb(),j.Rb(),j.Sb(16,"div",1),j.Sb(17,"label"),j.Dc(18),j.gc(19,"translate"),j.Rb(),j.Sb(20,"erz-date-select",4),j.dc("valueChange",function(e){return t.filter.dateFrom=e}),j.Rb(),j.Rb(),j.Sb(21,"div",1),j.Sb(22,"label"),j.Dc(23),j.gc(24,"translate"),j.Rb(),j.Sb(25,"erz-date-select",4),j.dc("valueChange",function(e){return t.filter.dateTo=e}),j.Rb(),j.Rb(),j.Rb(),j.Sb(26,"div",5),j.Sb(27,"div",1),j.Sb(28,"label"),j.Dc(29),j.gc(30,"translate"),j.Rb(),j.Sb(31,"erz-multiselect",6),j.dc("valuesChange",function(e){return t.filter.confirmationStates=e}),j.gc(32,"async"),j.Rb(),j.Rb(),j.Sb(33,"div",1),j.Sb(34,"label"),j.Dc(35),j.gc(36,"translate"),j.Rb(),j.Sb(37,"erz-multiselect",6),j.dc("valuesChange",function(e){return t.filter.presenceTypes=e}),j.gc(38,"async"),j.Rb(),j.Rb(),j.Sb(39,"div",1),j.Sb(40,"label"),j.Dc(41),j.gc(42,"translate"),j.Rb(),j.Sb(43,"erz-multiselect",6),j.dc("valuesChange",function(e){return t.filter.incidentTypes=e}),j.gc(44,"async"),j.Rb(),j.Rb(),j.Sb(45,"div",7),j.Sb(46,"button",8),j.dc("click",function(){return t.show()}),j.Dc(47),j.gc(48,"translate"),j.Rb(),j.Rb(),j.Rb()),2&e&&(j.zb(3),j.Ec(j.hc(4,24,"edit-absences.header.student")),j.zb(2),j.lc("typeaheadService",t.studentsService)("value",t.filter.student),j.zb(3),j.Ec(j.hc(9,26,"edit-absences.header.module-instance")),j.zb(2),j.lc("typeaheadService",t.educationalEventsService)("value",t.filter.educationalEvent),j.zb(3),j.Ec(j.hc(14,28,"edit-absences.header.study-class")),j.zb(2),j.lc("typeaheadService",t.studyClassService)("value",t.filter.studyClass)("additionalHttpParams",t.classesHttpFilter),j.zb(3),j.Ec(j.hc(19,30,"edit-absences.header.date-from")),j.zb(2),j.lc("value",t.filter.dateFrom),j.zb(3),j.Ec(j.hc(24,32,"edit-absences.header.date-to")),j.zb(2),j.lc("value",t.filter.dateTo),j.zb(4),j.Ec(j.hc(30,34,"edit-absences.header.confirmation-state")),j.zb(2),j.lc("options",j.hc(32,36,t.absenceConfirmationStatesGrouped$))("values",t.filter.confirmationStates),j.zb(4),j.Ec(j.hc(36,38,"edit-absences.header.presence-type")),j.zb(2),j.lc("options",j.hc(38,40,t.presenceTypesGrouped$))("values",t.filter.presenceTypes),j.zb(4),j.Ec(j.hc(42,42,"edit-absences.header.incident")),j.zb(2),j.lc("options",j.hc(44,44,t.incidentTypesGrouped$))("values",t.filter.incidentTypes),j.zb(4),j.Fc(" ",j.hc(48,46,"edit-absences.header.show")," "))},directives:[te.a,ne.a,ce.a],pipes:[ee.c,P.b],styles:["[_nghost-%COMP%]{display:flex;flex-direction:column;padding:1.5rem;border-bottom:1px solid #dee2e6}.filters[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap}.form-group[_ngcontent-%COMP%]{flex:1;min-width:20rem;max-width:40rem;margin-right:1.5rem;margin-bottom:.75rem}.buttons[_ngcontent-%COMP%]{flex:none;margin-top:2.75rem;margin-right:0}@media (max-width:767.98px){.buttons[_ngcontent-%COMP%]{width:100%;margin-top:1.5rem;margin-bottom:1.5rem}}"],changeDetection:0}),T);function ae(e){return e?Object(X.a)(e):null}var se=s("dlKe"),re=s("4Kj8"),oe=function(e){return{count:e}},le=function(e){return{returnparams:e}};function be(e,t){if(1&e&&(j.Sb(0,"div",12),j.Sb(1,"div",13),j.Dc(2),j.gc(3,"translate"),j.gc(4,"async"),j.gc(5,"translate"),j.Rb(),j.Sb(6,"a",14),j.gc(7,"async"),j.Sb(8,"i",15),j.Dc(9,"edit"),j.Rb(),j.Rb(),j.Rb()),2&e){var n=j.fc(4).erzLet,c=j.fc();j.zb(2),j.Gc(" ",j.ic(3,5,"edit-absences.list.total",j.pc(15,oe,j.hc(4,8,c.state.total$)||0)),", ",j.ic(5,10,"edit-absences.list.selected",j.pc(17,oe,n.selection.length))," "),j.zb(4),j.Eb("disabled",0===n.selection.length),j.lc("queryParams",j.pc(19,le,j.hc(7,13,c.state.queryParamsString$)))}}var ue=function(e){return["student",e]};function de(e,t){if(1&e){var n=j.Tb();j.Sb(0,"tr"),j.Sb(1,"td",20),j.dc("click",function(e){j.vc(n);var t=j.uc(3);return j.fc(6).onCheckboxCellClick(e,t)}),j.Sb(2,"input",17,21),j.dc("change",function(){j.vc(n);var e=t.$implicit;return j.fc(6).selectionService.toggle(e.lessonPresence)}),j.gc(4,"async"),j.Rb(),j.Rb(),j.Sb(5,"td",18),j.gc(6,"translate"),j.Sb(7,"span",22),j.Sb(8,"i",15),j.Dc(9),j.Rb(),j.Rb(),j.Rb(),j.Sb(10,"td"),j.gc(11,"translate"),j.Sb(12,"a",23),j.gc(13,"async"),j.Dc(14),j.Rb(),j.Nb(15,"br"),j.Dc(16),j.Rb(),j.Sb(17,"td"),j.gc(18,"translate"),j.Dc(19),j.gc(20,"date"),j.Rb(),j.Sb(21,"td"),j.gc(22,"translate"),j.Dc(23),j.gc(24,"date"),j.gc(25,"date"),j.Rb(),j.Sb(26,"td"),j.gc(27,"translate"),j.Dc(28),j.Rb(),j.Sb(29,"td",24),j.gc(30,"translate"),j.Dc(31),j.Rb(),j.Sb(32,"td"),j.gc(33,"translate"),j.Dc(34),j.Rb(),j.Rb()}if(2&e){var c=t.$implicit,i=j.fc(6);j.zb(2),j.lc("checked",j.hc(4,21,i.selectionService.isSelected$(c.lessonPresence))),j.zb(3),j.Ab("data-label",j.hc(6,23,"edit-absences.list.header.presence")),j.zb(2),j.lc("className",c.presenceCategory),j.zb(2),j.Ec(c.presenceCategoryIcon),j.zb(1),j.Ab("data-label",j.hc(11,25,"edit-absences.list.header.mobil-student-module-instance-study-class")),j.zb(2),j.lc("routerLink",j.pc(48,ue,c.lessonPresence.StudentRef.Id))("queryParams",j.pc(50,le,j.hc(13,27,i.profileReturnParams$))),j.zb(2),j.Fc(" ",c.lessonPresence.StudentFullName," "),j.zb(2),j.Gc(" ",c.lessonPresence.EventDesignation,", ",c.lessonPresence.StudyClassNumber," "),j.zb(1),j.Ab("data-label",j.hc(18,29,"edit-absences.list.header.date")),j.zb(2),j.Fc(" ",j.ic(20,31,c.lessonPresence.LessonDateTimeFrom,"mediumDate")," "),j.zb(2),j.Ab("data-label",j.hc(22,34,"edit-absences.list.header.time")),j.zb(2),j.Gc(" ",j.ic(24,36,c.lessonPresence.LessonDateTimeFrom,"shortTime"),"\u2013",j.ic(25,39,c.lessonPresence.LessonDateTimeTo,"shortTime")," "),j.zb(3),j.Ab("data-label",j.hc(27,42,"edit-absences.list.header.confirmation-state")),j.zb(2),j.Fc(" ",null==c.confirmationState?null:c.confirmationState.Value," "),j.zb(1),j.Ab("data-label",j.hc(30,44,"edit-absences.list.header.mobil-presence-type-incident")),j.zb(2),j.Fc(" ",null==c.presenceType?null:c.presenceType.Designation," "),j.zb(1),j.Ab("data-label",j.hc(33,46,"edit-absences.list.header.teacher")),j.zb(2),j.Fc(" ",c.lessonPresence.TeacherInformation," ")}}function fe(e,t){if(1&e){var n=j.Tb();j.Sb(0,"table",16),j.Sb(1,"thead"),j.Sb(2,"tr"),j.Sb(3,"th"),j.Sb(4,"input",17),j.dc("change",function(e){return j.vc(n),j.fc(5).toggleAll(e.currentTarget.checked)}),j.Rb(),j.Rb(),j.Sb(5,"th",18),j.Dc(6),j.gc(7,"translate"),j.Rb(),j.Sb(8,"th"),j.Dc(9),j.gc(10,"translate"),j.Nb(11,"br"),j.Dc(12),j.gc(13,"translate"),j.gc(14,"translate"),j.Rb(),j.Sb(15,"th"),j.Dc(16),j.gc(17,"translate"),j.Rb(),j.Sb(18,"th"),j.Dc(19),j.gc(20,"translate"),j.Rb(),j.Sb(21,"th"),j.Dc(22),j.gc(23,"translate"),j.Rb(),j.Sb(24,"th"),j.Dc(25),j.gc(26,"translate"),j.gc(27,"translate"),j.Rb(),j.Sb(28,"th"),j.Dc(29),j.gc(30,"translate"),j.Rb(),j.Rb(),j.Rb(),j.Sb(31,"tbody"),j.Bc(32,de,35,52,"tr",19),j.Rb(),j.Rb()}if(2&e){var c=j.fc(4).erzLet;j.zb(4),j.lc("checked",c.selection.length===c.entries.length),j.zb(2),j.Fc(" ",j.hc(7,12,"edit-absences.list.header.presence")," "),j.zb(3),j.Fc(" ",j.hc(10,14,"edit-absences.list.header.student")," "),j.zb(3),j.Gc(" ",j.hc(13,16,"edit-absences.list.header.module-instance"),", ",j.hc(14,18,"edit-absences.list.header.study-class")," "),j.zb(4),j.Fc(" ",j.hc(17,20,"edit-absences.list.header.date")," "),j.zb(3),j.Ec(j.hc(20,22,"edit-absences.list.header.time")),j.zb(3),j.Fc(" ",j.hc(23,24,"edit-absences.list.header.confirmation-state")," "),j.zb(3),j.Gc(" ",j.hc(26,26,"edit-absences.list.header.presence-type")," / ",j.hc(27,28,"edit-absences.list.header.incident")," "),j.zb(4),j.Ec(j.hc(30,30,"edit-absences.list.header.teacher")),j.zb(3),j.lc("ngForOf",c.entries)}}function pe(e,t){1&e&&j.Nb(0,"erz-spinner",25)}function he(e,t){if(1&e){var n=j.Tb();j.Sb(0,"button",26),j.dc("click",function(){return j.vc(n),j.fc(5).state.nextPage()}),j.Dc(1),j.gc(2,"translate"),j.Rb()}2&e&&(j.zb(1),j.Fc(" ",j.hc(2,1,"global.pagination.load-more")," "))}function ge(e,t){if(1&e){var n=j.Tb();j.Sb(0,"div",7),j.dc("scrolled",function(){return j.vc(n),j.fc(4).onScroll()}),j.Bc(1,be,10,21,"div",8),j.Bc(2,fe,33,32,"table",9),j.Bc(3,pe,1,0,"erz-spinner",10),j.Bc(4,he,3,3,"button",11),j.Rb()}if(2&e){var c=j.fc(3).erzLet;j.zb(1),j.lc("ngIf",c.entries&&c.entries.length>0),j.zb(1),j.lc("ngIf",c.entries&&c.entries.length>0),j.zb(1),j.lc("ngIf",c.loadingPage),j.zb(1),j.lc("ngIf",c.hasMore&&!c.loadingPage)}}function me(e,t){1&e&&(j.Sb(0,"p",27),j.Dc(1),j.gc(2,"translate"),j.Rb()),2&e&&(j.zb(1),j.Ec(j.hc(2,1,"edit-absences.no-entries")))}function ve(e,t){if(1&e&&(j.Qb(0),j.Bc(1,ge,5,4,"div",5),j.Bc(2,me,3,3,"ng-template",null,6,j.Cc),j.Pb()),2&e){var n=j.uc(3),c=j.fc(2).erzLet;j.zb(1),j.lc("ngIf",c.entries&&c.entries.length>0||c.loadingPage)("ngIfElse",n)}}function ye(e,t){1&e&&j.Nb(0,"erz-spinner")}function Se(e,t){if(1&e&&(j.Qb(0),j.Bc(1,ve,4,2,"ng-container",2),j.gc(2,"async"),j.Bc(3,ye,1,0,"ng-template",null,4,j.Cc),j.Pb()),2&e){var n=j.uc(4),c=j.fc(2);j.zb(1),j.lc("ngIf",!j.hc(2,2,c.state.loading$))("ngIfElse",n)}}function ze(e,t){1&e&&(j.Sb(0,"p",27),j.Dc(1),j.gc(2,"translate"),j.Rb()),2&e&&(j.zb(1),j.Ec(j.hc(2,1,"edit-absences.no-filter")))}function Oe(e,t){if(1&e){var n=j.Tb();j.Qb(0),j.Sb(1,"erz-edit-absences-header",1),j.dc("filterChange",function(e){return j.vc(n),j.fc().state.setFilter(e)}),j.gc(2,"async"),j.Rb(),j.Bc(3,Se,5,4,"ng-container",2),j.gc(4,"async"),j.Bc(5,ze,3,3,"ng-template",null,3,j.Cc),j.Pb()}if(2&e){var c=j.uc(6),i=j.fc();j.zb(1),j.lc("filter",j.hc(2,3,i.filterFromParams$)),j.zb(2),j.lc("ngIf",j.hc(4,5,i.state.isFilterValid$))("ngIfElse",c)}}var Ie,Re=function(e,t,n,c){return{selection:e,entries:t,hasMore:n,loadingPage:c}},ke=((Ie=function(){function e(t,c,i,a){n(this,e),this.state=t,this.selectionService=c,this.scrollPosition=i,this.route=a,this.filterFromParams$=this.route.queryParams.pipe(Object(d.a)(Ce)),this.profileReturnParams$=this.state.queryParamsString$,this.destroy$=new A.a}return i(e,[{key:"ngOnInit",value:function(){var e=this;this.filterFromParams$.pipe(Object(x.a)(1)).subscribe(function(t){return e.state.setFilter(t)}),this.state.validFilter$.pipe(Object(f.a)(this.destroy$)).subscribe(function(){return e.selectionService.clear()}),this.selectionService.selection$.pipe(Object(f.a)(this.destroy$)).subscribe(function(t){return e.state.selected=t}),this.route.queryParams.pipe(Object(x.a)(1),Object(B.a)("reload"),Object(M.a)(V.b)).subscribe(function(){return e.state.resetEntries()})}},{key:"ngAfterViewInit",value:function(){this.scrollPosition.restore()}},{key:"ngOnDestroy",value:function(){this.destroy$.next()}},{key:"toggleAll",value:function(e){var t=this;this.state.entries$.pipe(Object(x.a)(1)).subscribe(function(n){return t.selectionService.clear(e?n:null)})}},{key:"onCheckboxCellClick",value:function(e,t){e.target!==t&&t.click()}},{key:"onScroll",value:function(){this.state.nextPage()}}]),e}()).\u0275fac=function(e){return new(e||Ie)(j.Mb(D),j.Mb(q),j.Mb(L.a),j.Mb(l.a))},Ie.\u0275cmp=j.Gb({type:Ie,selectors:[["erz-edit-absences-list"]],features:[j.yb([q])],decls:5,vars:14,consts:[[4,"erzLet"],[3,"filter","filterChange"],[4,"ngIf","ngIfElse"],["noFilter",""],["loading",""],["class","p-3","infiniteScroll","",3,"scrolled",4,"ngIf","ngIfElse"],["noEntries",""],["infiniteScroll","",1,"p-3",3,"scrolled"],["class","d-flex align-items-center justify-content-between",4,"ngIf"],["class","table table-striped",4,"ngIf"],["class","inline",4,"ngIf"],["type","button","class","btn btn-secondary btn-sm d-block mx-auto",3,"click",4,"ngIf"],[1,"d-flex","align-items-center","justify-content-between"],[1,"total"],["routerLink","/edit-absences/edit",1,"edit","btn","btn-primary","mt-1","mb-2",3,"queryParams"],[1,"material-icons"],[1,"table","table-striped"],["type","checkbox",3,"checked","change"],[1,"presence-category"],[4,"ngFor","ngForOf"],[1,"edit-absences-checkbox",3,"click"],["checkbox",""],[3,"className"],[1,"student",3,"routerLink","queryParams"],[1,"designation-incident"],[1,"inline"],["type","button",1,"btn","btn-secondary","btn-sm","d-block","mx-auto",3,"click"],[1,"mt-3","px-3"]],template:function(e,t){1&e&&(j.Bc(0,Oe,7,7,"ng-container",0),j.gc(1,"async"),j.gc(2,"async"),j.gc(3,"async"),j.gc(4,"async")),2&e&&j.lc("erzLet",j.sc(9,Re,j.hc(1,1,t.selectionService.selection$),j.hc(2,3,t.state.presenceControlEntries$),j.hc(3,5,t.state.hasMore$),j.hc(4,7,t.state.loadingPage$)))},directives:[K.a,ie,P.m,se.a,l.i,P.l,re.a],pipes:[P.b,ee.c,P.e],styles:[".edit[_ngcontent-%COMP%]{line-height:1;font-size:2.2rem}.presence-category[_ngcontent-%COMP%]{text-align:center}.presence-category[_ngcontent-%COMP%]   .absent[_ngcontent-%COMP%]{color:#dc3545}.presence-category[_ngcontent-%COMP%]   .present[_ngcontent-%COMP%]{color:#28a745}.presence-category[_ngcontent-%COMP%]   .unapproved[_ngcontent-%COMP%]{color:#ffa814}.designation-incident[_ngcontent-%COMP%]{max-width:50ch}.student[_ngcontent-%COMP%]{color:#33333d}@media screen and (max-width:820px){.edit-absences-checkbox[_ngcontent-%COMP%]{text-align:left}.presence-category[_ngcontent-%COMP%]{text-align:right}.designation-incident[_ngcontent-%COMP%]{max-width:none}}"],changeDetection:0}),Ie);function Ce(e){return{student:e.student?Number(e.student):null,educationalEvent:e.educationalEvent?Number(e.educationalEvent):null,studyClass:e.studyClass?Number(e.studyClass):null,dateFrom:e.dateFrom?Object(_.c)(e.dateFrom):null,dateTo:e.dateTo?Object(_.c)(e.dateTo):null,presenceTypes:e.presenceTypes?e.presenceTypes.split(",").map(Number):null,confirmationStates:e.confirmationStates?e.confirmationStates.split(",").map(Number):null,incidentTypes:e.incidentTypes?e.incidentTypes.split(",").map(Number):null}}var $e,Te=s("3Pt+"),je=s("2Vo4"),Pe=s("eIep"),De=s("nYR2"),Fe=s("BeL+"),Ee=s("CqXF"),we=s("LpL1"),Ae=s("IClS"),xe=function(e){return e.Absent="absent",e.Dispensation="dispensation",e.HalfDay="half-day",e.Incident="incident",e.Present="present",e}({}),Be=(($e=function(){function t(e,c){n(this,t),this.updateService=e,this.settings=c}return i(t,[{key:"update",value:function(e,t,n,c,i,a){var s=[];switch(n){case xe.Present:s=this.createResetBulkRequests(e);break;case xe.Absent:s=this.createAbsentEditBulkRequests(e,t,c,i);break;case xe.Dispensation:s=this.createEditBulkRequests(e,null,this.settings.dispensationPresenceTypeId);break;case xe.HalfDay:s=this.createEditBulkRequests(e,null,this.settings.halfDayPresenceTypeId);break;case xe.Incident:s=this.createEditBulkRequests(e,null,a)}return Object(b.a)(s).pipe(Object(Ee.a)(void 0))}},{key:"createAbsentEditBulkRequests",value:function(t,n,c,i){return c===this.settings.excusedAbsenceStateId?this.createEditBulkRequests(t,c,i):c===this.settings.unexcusedAbsenceStateId?this.createEditBulkRequests(t,c,this.settings.absencePresenceTypeId):[].concat(e(this.createEditBulkRequests(t.filter(Me(n,this.settings)),c,this.settings.absencePresenceTypeId)),e(this.createEditBulkRequests(t.filter(Object(V.d)(Me(n,this.settings))),c,null)))}},{key:"createResetBulkRequests",value:function(e){var t=this;return Object(Ae.a)(e).map(function(e){var n=e.lessonIds,c=e.personIds;return t.updateService.removeLessonPresences(n,c)})}},{key:"createEditBulkRequests",value:function(e,t,n){var c=this;return Object(Ae.a)(e).map(function(e){var i=e.lessonIds,a=e.personIds;return c.updateService.editLessonPresences(i,a,n||void 0,t||void 0)})}}]),t}()).\u0275fac=function(e){return new(e||$e)(j.Zb(we.a),j.Zb(O.a))},$e.\u0275prov=j.Ib({token:$e,factory:$e.\u0275fac,providedIn:"root"}),$e);function Me(e,t){return function(n){var c=e.find(function(e){return e.Id===n.TypeRef.Id});return!c||c.Id===t.dispensationPresenceTypeId||c.Id===t.halfDayPresenceTypeId||c.IsIncident}}var Ge=s("A6ef"),qe=s("AEFh"),Ne=s("5eHb");function Le(e,t){if(1&e&&(j.Sb(0,"div",11),j.Dc(1),j.gc(2,"translate"),j.Rb()),2&e){var n=t.$implicit;j.zb(1),j.Fc(" ",j.ic(2,1,"global.validation-errors."+n.error,n.params)," ")}}function _e(e,t){if(1&e&&(j.Sb(0,"option",23),j.Dc(1),j.Rb()),2&e){var n=t.$implicit;j.lc("ngValue",n.Id),j.zb(1),j.Fc(" ",n.Designation," ")}}function Ve(e,t){if(1&e&&(j.Sb(0,"select",22),j.gc(1,"async"),j.Sb(2,"option",23),j.Dc(3),j.gc(4,"translate"),j.Rb(),j.Bc(5,_e,2,2,"option",24),j.gc(6,"async"),j.Rb()),2&e){var n=j.fc(6);j.Eb("is-invalid",j.hc(1,5,n.absenceTypeIdErrors$).length>0),j.zb(2),j.lc("ngValue",null),j.zb(1),j.Fc(" ",j.hc(4,7,"edit-absences.edit.absence-type-placeholder")," "),j.zb(2),j.lc("ngForOf",j.hc(6,9,n.absenceTypes$))}}function Ke(e,t){if(1&e&&(j.Sb(0,"div",25),j.Dc(1),j.gc(2,"translate"),j.Rb()),2&e){var n=t.$implicit;j.zb(1),j.Fc(" ",j.ic(2,1,"global.validation-errors."+n.error,n.params)," ")}}function He(e,t){if(1&e&&(j.Sb(0,"div",18),j.Nb(1,"input",19),j.Sb(2,"label",14),j.Dc(3),j.Rb(),j.Bc(4,Ve,7,11,"select",20),j.Bc(5,Ke,3,4,"div",21),j.gc(6,"async"),j.Rb()),2&e){var n=t.$implicit,c=j.fc(5);j.zb(1),j.lc("id","state-"+n.Key)("value",n.Key),j.zb(1),j.mc("for","state-"+n.Key),j.zb(1),j.Fc(" ",n.Value," "),j.zb(1),j.lc("ngIf",c.isExcused(n)),j.zb(1),j.lc("ngForOf",j.hc(6,6,c.absenceTypeIdErrors$))}}function Xe(e,t){if(1&e&&(j.Sb(0,"div",16),j.Bc(1,He,7,8,"div",17),j.Rb()),2&e){var n=j.fc(3).erzLet;j.zb(1),j.lc("ngForOf",n.confirmationStates)}}function Ze(e,t){if(1&e&&(j.Sb(0,"option",23),j.Dc(1),j.Rb()),2&e){var n=t.$implicit;j.lc("ngValue",n.Id),j.zb(1),j.Fc(" ",n.Designation," ")}}function Je(e,t){if(1&e&&(j.Sb(0,"div",25),j.Dc(1),j.gc(2,"translate"),j.Rb()),2&e){var n=t.$implicit;j.zb(1),j.Fc(" ",j.ic(2,1,"global.validation-errors."+n.error,n.params)," ")}}function Ue(e,t){if(1&e&&(j.Sb(0,"div",16),j.Sb(1,"select",26),j.gc(2,"async"),j.Sb(3,"option",23),j.Dc(4),j.gc(5,"translate"),j.Rb(),j.Bc(6,Ze,2,2,"option",24),j.gc(7,"async"),j.Rb(),j.Bc(8,Je,3,4,"div",21),j.gc(9,"async"),j.Rb()),2&e){var n=j.fc(4);j.zb(1),j.Eb("is-invalid",j.hc(2,6,n.incidentIdErrors$).length>0),j.zb(2),j.lc("ngValue",null),j.zb(1),j.Fc(" ",j.hc(5,8,"edit-absences.edit.incident-placeholder")," "),j.zb(2),j.lc("ngForOf",j.hc(7,10,n.incidents$)),j.zb(2),j.lc("ngForOf",j.hc(9,12,n.incidentIdErrors$))}}function Ye(e,t){if(1&e&&(j.Sb(0,"div",12),j.Nb(1,"input",13),j.Sb(2,"label",14),j.Dc(3),j.gc(4,"translate"),j.Rb(),j.Bc(5,Xe,2,1,"div",15),j.Bc(6,Ue,10,14,"div",15),j.Rb()),2&e){var n=t.$implicit,c=j.fc(3);j.zb(1),j.lc("id","category-"+n)("value",n),j.zb(1),j.mc("for","category-"+n),j.zb(1),j.Fc(" ",j.hc(4,6,"edit-absences.edit.categories."+n)," "),j.zb(2),j.lc("ngIf",c.isAbsent(n)),j.zb(1),j.lc("ngIf",c.isIncident(n))}}function Qe(e,t){1&e&&(j.Sb(0,"div",27),j.Sb(1,"span",28),j.Dc(2,"Loading..."),j.Rb(),j.Rb())}function We(e,t){if(1&e){var n=j.Tb();j.Sb(0,"form",3),j.dc("ngSubmit",function(){return j.vc(n),j.fc(2).onSubmit()}),j.Bc(1,Le,3,4,"div",4),j.gc(2,"async"),j.Sb(3,"div",5),j.Bc(4,Ye,7,8,"div",6),j.Rb(),j.Sb(5,"div",7),j.Sb(6,"button",8),j.dc("click",function(){return j.vc(n),j.fc(2).cancel()}),j.gc(7,"async"),j.Dc(8),j.gc(9,"translate"),j.Rb(),j.Sb(10,"button",9),j.gc(11,"async"),j.Dc(12),j.gc(13,"translate"),j.Bc(14,Qe,3,0,"div",10),j.gc(15,"async"),j.Rb(),j.Rb(),j.Rb()}if(2&e){var c=j.fc().erzLet,i=j.fc();j.lc("formGroup",c.formGroup),j.zb(1),j.lc("ngForOf",j.hc(2,8,i.formErrors$)),j.zb(3),j.lc("ngForOf",c.categories),j.zb(2),j.lc("disabled",j.hc(7,10,i.saving$)),j.zb(2),j.Fc(" ",j.hc(9,12,"edit-absences.edit.cancel")," "),j.zb(2),j.lc("disabled",j.hc(11,14,i.saving$)),j.zb(2),j.Fc(" ",j.hc(13,16,"edit-absences.edit.save")," "),j.zb(2),j.lc("ngIf",j.hc(15,18,i.saving$))}}function et(e,t){if(1&e&&(j.Sb(0,"div",1),j.Bc(1,We,16,20,"form",2),j.Rb()),2&e){var n=t.erzLet;j.zb(1),j.lc("ngIf",n.formGroup&&n.confirmationStates)}}var tt,nt,ct,it=function(e,t,n){return{confirmationStates:e,categories:t,formGroup:n}},at=((tt=function(){function e(t,c,i,a,s,r,o,l,b,f){var p=this;n(this,e),this.fb=t,this.router=c,this.route=i,this.toastr=a,this.translate=s,this.state=r,this.dropDownItemsService=o,this.presenceTypesService=l,this.updateService=b,this.settings=f,this.absenceTypes$=this.presenceTypesService.confirmationTypes$,this.incidents$=this.presenceTypesService.incidentTypes$,this.formGroup$=this.createFormGroup(),this.saving$=new je.a(!1),this.submitted$=new je.a(!1),this.formErrors$=Object(Ge.c)(this.formGroup$,this.submitted$),this.absenceTypeIdErrors$=Object(Ge.c)(this.formGroup$,this.submitted$,"absenceTypeId"),this.incidentIdErrors$=Object(Ge.c)(this.formGroup$,this.submitted$,"incidentId"),this.availableCategories=[xe.Absent,xe.Dispensation,xe.HalfDay,xe.Incident,xe.Present],this.confirmationStates$=this.dropDownItemsService.getAbsenceConfirmationStates().pipe(Object(d.a)(this.sortAbsenceConfirmationStates.bind(this)),Object(u.a)(1)),this.activeCategories$=this.presenceTypesService.halfDayActive$.pipe(Object(d.a)(function(e){return e?p.availableCategories:p.availableCategories.filter(function(e){return e!==xe.HalfDay})})),this.destroy$=new A.a}return i(e,[{key:"ngOnInit",value:function(){0===this.state.selected.length&&this.navigateBack(),Object(Ge.b)(this.formGroup$,"category").pipe(Object(f.a)(this.destroy$)).subscribe(this.updateConfirmationValueDisabled.bind(this)),Object(Ge.b)(this.formGroup$,"confirmationValue").pipe(Object(f.a)(this.destroy$)).subscribe(this.updateAbsenceTypeIdDisabled.bind(this))}},{key:"ngOnDestroy",value:function(){this.destroy$.next()}},{key:"isAbsent",value:function(e){return e===xe.Absent}},{key:"isExcused",value:function(e){return e.Key===this.settings.excusedAbsenceStateId}},{key:"isIncident",value:function(e){return e===xe.Incident}},{key:"onSubmit",value:function(){var e=this;this.submitted$.next(!0),this.formGroup$.pipe(Object(x.a)(1)).subscribe(function(t){t.valid&&e.save(t)})}},{key:"cancel",value:function(){this.navigateBack()}},{key:"createFormGroup",value:function(){var e=this;return this.getInitialAbsenceTypeId().pipe(Object(d.a)(function(t){return e.fb.group({category:[xe.Absent,Te.q.required],confirmationValue:[e.settings.excusedAbsenceStateId,Te.q.required],absenceTypeId:[t,Te.q.required],incidentId:[{value:null,disabled:!0},Te.q.required]})}),Object(u.a)(1))}},{key:"getInitialAbsenceTypeId",value:function(){var e=this;return this.absenceTypes$.pipe(Object(x.a)(1),Object(d.a)(function(t){var n=t.map(function(e){return e.Id}),c=Object(Fe.a)(e.state.selected.map(function(e){return e.TypeRef.Id}));return 1===c.length&&null!=c[0]&&n.includes(c[0])?c[0]:null}))}},{key:"updateConfirmationValueDisabled",value:function(){var e=this;this.formGroup$.pipe(Object(x.a)(1)).subscribe(function(t){var n=t.get("category"),c=t.get("confirmationValue"),i=t.get("absenceTypeId"),a=t.get("incidentId");n&&c&&i&&a&&(n.value===xe.Absent?(c.enable(),e.updateAbsenceTypeIdDisabled()):(c.disable(),i.disable()),n.value===xe.Incident?a.enable():a.disable())})}},{key:"updateAbsenceTypeIdDisabled",value:function(){var e=this;this.formGroup$.pipe(Object(x.a)(1)).subscribe(function(t){var n=t.get("confirmationValue"),c=t.get("absenceTypeId");n&&c&&(n.value===e.settings.excusedAbsenceStateId?c.enable():c.disable())})}},{key:"save",value:function(e){var t=this;this.saving$.next(!0);var n=e.value,c=n.category,i=n.confirmationValue,a=n.absenceTypeId,s=n.incidentId;this.presenceTypesService.presenceTypes$.pipe(Object(Pe.a)(function(e){return t.updateService.update(t.state.selected,e,c,i,a,s)}),Object(De.a)(function(){return t.saving$.next(!1)})).subscribe(this.onSaveSuccess.bind(this))}},{key:"onSaveSuccess",value:function(){this.state.resetSelection(),this.toastr.success(this.translate.instant("edit-absences.edit.save-success")),this.navigateBack(!0)}},{key:"navigateBack",value:function(e){var t=this;this.route.queryParams.pipe(Object(x.a)(1)).subscribe(function(n){t.router.navigate(["/edit-absences"],{queryParams:Object.assign(Object.assign({},Object(qe.b)(n.returnparams)),{reload:e})})})}},{key:"sortAbsenceConfirmationStates",value:function(e){var t=this;return e.slice().sort(function(e,n){return e.Key===t.settings.excusedAbsenceStateId?-1:n.Key===t.settings.excusedAbsenceStateId?1:e.Value.localeCompare(n.Value)})}}]),e}()).\u0275fac=function(e){return new(e||tt)(j.Mb(Te.c),j.Mb(l.g),j.Mb(l.a),j.Mb(Ne.b),j.Mb(ee.d),j.Mb(D),j.Mb(p.a),j.Mb(m.a),j.Mb(Be),j.Mb(O.a))},tt.\u0275cmp=j.Gb({type:tt,selectors:[["erz-edit-absences-edit"]],decls:4,vars:11,consts:[["class","erz-container erz-container-limited erz-container-padding-y",4,"erzLet"],[1,"erz-container","erz-container-limited","erz-container-padding-y"],[3,"formGroup","ngSubmit",4,"ngIf"],[3,"formGroup","ngSubmit"],["class","alert alert-danger",4,"ngFor","ngForOf"],[1,"form-group","pb-4"],["class","form-check mt-2 mb-3",4,"ngFor","ngForOf"],[1,"d-flex","justify-content-end"],["type","button",1,"btn","btn-secondary",3,"disabled","click"],["type","submit",1,"btn","btn-primary","ml-2",3,"disabled"],["class","spinner-border spinner-border-sm align-middle","role","status",4,"ngIf"],[1,"alert","alert-danger"],[1,"form-check","mt-2","mb-3"],["type","radio","formControlName","category",1,"form-check-input",3,"id","value"],[1,"form-check-label",3,"for"],["class","ml-5",4,"ngIf"],[1,"ml-5"],["class","form-check mt-2 mb-2",4,"ngFor","ngForOf"],[1,"form-check","mt-2","mb-2"],["type","radio","formControlName","confirmationValue",1,"form-check-input",3,"id","value"],["class","form-control mt-1","formControlName","absenceTypeId",3,"is-invalid",4,"ngIf"],["class","invalid-feedback",4,"ngFor","ngForOf"],["formControlName","absenceTypeId",1,"form-control","mt-1"],[3,"ngValue"],[3,"ngValue",4,"ngFor","ngForOf"],[1,"invalid-feedback"],["formControlName","incidentId",1,"form-control","mt-1"],["role","status",1,"spinner-border","spinner-border-sm","align-middle"],[1,"sr-only"]],template:function(e,t){1&e&&(j.Bc(0,et,2,1,"div",0),j.gc(1,"async"),j.gc(2,"async"),j.gc(3,"async")),2&e&&j.lc("erzLet",j.rc(7,it,j.hc(1,1,t.confirmationStates$),j.hc(2,3,t.activeCategories$),j.hc(3,5,t.formGroup$)))},directives:[K.a,P.m,Te.r,Te.j,Te.e,P.l,Te.n,Te.b,Te.i,Te.d,Te.p,Te.m,Te.s],pipes:[P.b,ee.c],styles:[""],changeDetection:0}),tt),st=s("ccj6"),rt=s("hH5/"),ot=[{path:"",component:w,children:[{path:"",component:ke,data:{restoreScrollPositionFrom:["/edit-absences/edit","/edit-absences/student/:id"]}},{path:"edit",component:at},{path:"student/:id",children:[{path:"",component:st.a},{path:"confirm",component:rt.a}]}]}],lt=((ct=function e(){n(this,e)}).\u0275fac=function(e){return new(e||ct)},ct.\u0275mod=j.Kb({type:ct}),ct.\u0275inj=j.Jb({imports:[[l.j.forChild(ot)],l.j]}),ct),bt=((nt=function e(){n(this,e)}).\u0275fac=function(e){return new(e||nt)},nt.\u0275mod=j.Kb({type:nt}),nt.\u0275inj=j.Jb({imports:[[o.a,lt]]}),nt)}}])}();