"use client";

import { useEffect, useRef, useState } from "react";

function Mark({ large = false }: { large?: boolean }) {
  return <span className={`mark ${large ? "markLarge" : ""}`} aria-hidden="true"><i/><i/><i/></span>;
}

const roster = [
  ["Maya Chen", "AM", "AM", "AM", "Off", "PM", "PM", "Off"],
  ["Jon Bell", "PM", "PM", "Off", "PM", "PM", "Off", "AM"],
  ["Ari Singh", "ON", "ON", "ON", "Off", "Off", "ON", "ON"],
  ["Nora Hall", "AM", "Off", "AM", "AM", "AM", "AM", "Off"],
];

const incidentSamples = [
  { type: "Guest fall", account: "Guest Jane Smith in Room 814 slipped near the pool entrance at 21:40. Security attended and photos were taken. She declined medical assistance.", question: "Was the surface condition documented and corrected?", track: ["Injury", "Medical response", "Evidence", "Hazard correction"] },
  { type: "Theft", account: "Guest reported a laptop missing from Room 614 after returning at 18:25. Security was notified and the electronic lock audit was requested.", question: "Was CCTV preserved and was a police file opened?", track: ["Property", "Access history", "CCTV", "Police response"] },
  { type: "Equipment failure", account: "The service elevator stopped between floors at 14:12 with one employee inside. Engineering responded and the employee declined medical assistance.", question: "Who released the equipment back to service?", track: ["Entrapment", "Engineering", "Medical refusal", "Return to service"] },
];

export default function Experience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tidemarkOpacity, setTidemarkOpacity] = useState(.24);
  const [day, setDay] = useState(3);
  const [vacation, setVacation] = useState(false);
  const [incidentSample, setIncidentSample] = useState(0);
  const [privacyView, setPrivacyView] = useState<"manager"|"processing">("manager");
  const [auditComplete, setAuditComplete] = useState(false);

  useEffect(() => {
    const update = () => {
      const core = document.querySelector<HTMLElement>(".systemCore");
      if (!core) return;
      const rect = core.getBoundingClientRect();
      const reveal = Math.max(0, Math.min(1, (innerHeight * .88 - rect.top) / (innerHeight * .5)));
      setTidemarkOpacity(.24 + reveal * .76);
    };
    update(); addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let frame = 0, raf = 0;
    const count = innerWidth < 700 ? 170 : 460;
    const points = Array.from({length:count},(_,i)=>({seed:i*12.9898,angle:i/count*Math.PI*2,lane:i%9,size:.55+(i*17%13)/11}));
    const resize=()=>{const d=Math.min(devicePixelRatio,2);canvas.width=innerWidth*d;canvas.height=innerHeight*d;canvas.style.width=`${innerWidth}px`;canvas.style.height=`${innerHeight}px`;ctx.setTransform(d,0,0,d,0,0)};
    resize(); addEventListener("resize",resize);
    const draw=()=>{
      frame+=.006; const w=innerWidth,h=innerHeight; ctx.clearRect(0,0,w,h);
      const p=Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-h));
      const incoming=Math.max(0,Math.min(1,(p-.025)/.12));
      const retreat=Math.max(0,Math.min(1,(p-.17)/.12));
      const branch=Math.max(0,Math.min(1,(p-.29)/.16));
      const evidence=Math.max(0,Math.min(1,(p-.62)/.14));
      const learning=Math.max(0,Math.min(1,(p-.82)/.10));
      ctx.globalCompositeOperation="lighter";
      points.forEach((pt,i)=>{
        const n1=Math.sin(pt.seed+frame*(1+(i%4)*.18)),n2=Math.cos(pt.seed*.41-frame*1.3);
        const chaosX=w*.5+n1*w*.49,chaosY=h*.5+n2*h*.52;
        const coastX=(i/count)*w*1.16-w*.08;
        const tideY=h*.58+Math.sin(coastX*.008+frame+pt.lane*.18)*h*.12+Math.sin(coastX*.022-frame)*28;
        const highY=tideY-h*.28*incoming;
        const recedeY=highY+h*.56*retreat;
        const branchX=(i%2===0?w*.30:w*.70)+Math.sin(pt.seed+frame)*w*.075;
        const branchY=(i/count)*h*1.25-h*.1;
        let x=chaosX+(coastX-chaosX)*incoming,y=chaosY+(recedeY-chaosY)*incoming;
        x+=(branchX-x)*branch;y+=(branchY-y)*branch;
        const c=i%2===0?[72,237,208]:[157,139,255];
        if(i%2===1&&evidence>0){
          const factColumn=i%5, factRow=Math.floor(i/5)%8;
          const factX=w*.22+factColumn*w*.14, factY=h*.20+factRow*h*.085;
          x+=(factX-x)*evidence;y+=(factY-y)*evidence;
          const archiveX=w*.5+Math.cos(pt.angle)*w*(.12+.18*(i%4)/4);
          const archiveY=h*.5+Math.sin(pt.angle)*h*(.10+.22*(i%4)/4);
          x+=(archiveX-x)*learning;y+=(archiveY-y)*learning;
        }
        const fade=i%2===0?1-evidence*.8:1;
        ctx.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},${(.18+incoming*.48)*(1-retreat*.42)*fade})`;ctx.beginPath();ctx.arc(x,y,pt.size*(1+incoming*.25),0,Math.PI*2);ctx.fill();
      });
      if(retreat>0){
        const lineY=h*.43;ctx.beginPath();
        for(let x=0;x<=w;x+=8){const y=lineY+Math.sin(x*.008+frame*.22)*h*.055+Math.sin(x*.021)*14;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y)}
        ctx.strokeStyle=`rgba(74,237,209,${.12+retreat*.42})`;ctx.lineWidth=1;ctx.shadowBlur=18;ctx.shadowColor="#49ecd0";ctx.stroke();ctx.shadowBlur=0;
      }
      ctx.globalCompositeOperation="source-over"; raf=requestAnimationFrame(draw);
    }; draw(); return()=>{cancelAnimationFrame(raf);removeEventListener("resize",resize)};
  },[]);

  return <main>
    <canvas ref={canvasRef} className="particleField" aria-hidden="true"/><div className="grain" aria-hidden="true"/>
    <nav><a className="brand" href="#top" aria-label="Project TideMark home"><Mark/><span>Project TideMark</span></a><div className="navLinks"><a href="#ecosystem">Ecosystem</a><a href="#shift">Shift</a><a href="#incident">Incident</a><a className="navCta" href="#contact">Request access <span>↗</span></a></div></nav>

    <section id="top" className="hero chapter">
      <div className="eyebrow"><span/> Project TideMark · Hotel operations intelligence</div>
      <h1>One system for<br/><em>the operating hotel.</em></h1>
      <p>Project TideMark connects hotel demand, staffing decisions, employee commitments, operating rules, and frontline events, so leaders can understand what is happening, decide what comes next, and act with confidence.</p>
      <div className="heroActions"><a className="primary" href="#ecosystem">Explore the ecosystem <span>↗</span></a><span className="micro">Many operational signals.<br/>One intelligent system.</span></div>
      <div className="heroProof">Purpose-built for continuous hotel operations, not generic workflow.</div>
      <div className="scrollCue"><span>FOLLOW THE TIDE</span><i/></div>
    </section>

    <section id="ecosystem" className="story chapter">
      <div className="storyCopy left"><span className="index">01 / THE INCOMING TIDE</span><h2>Every operation sends<br/>a thousand signals.</h2><p>Occupancy. Arrivals. Groups. Employee requests. Coverage rules. Overnight continuity. Incidents. They arrive like a tide: continuous, overlapping, and usually separated across systems.</p></div>
      <div className="signalLabels" aria-hidden="true"><span style={{left:"9%",top:"22%"}}>OCCUPANCY · 94%</span><span style={{right:"8%",top:"30%"}}>TIME OFF · REVIEW</span><span style={{left:"18%",bottom:"23%"}}>OVERNIGHT · COVERAGE</span><span style={{right:"14%",bottom:"18%"}}>INCIDENT · OPEN</span><span style={{left:"46%",top:"13%"}}>GROUP PICKUP</span></div>
    </section>

    <section className="converge chapter"><div className="systemCore" style={{opacity:tidemarkOpacity}}><span className="index">WHAT THE TIDE LEAVES BEHIND</span><Mark large/><span>PROJECT TIDEMARK</span><h2>Signals recede.<br/>Operational intelligence remains.</h2><p className="tideDefinition">A tidemark is the lasting evidence of everything the operation carried in.</p><div className="coreSteps"><span>Observe</span><i/> <span>Understand</span><i/> <span>Decide</span><i/> <span>Remember</span></div></div></section>

    <section className="branch chapter"><div className="branchIntro"><span className="index">02 / THE ECOSYSTEM</span><h2>One tidemark.<br/>Two operating branches.</h2><p>Project TideMark turns shared hotel intelligence into focused products. Each solves a distinct operational workflow; both leave the hotel with clearer decisions and stronger memory.</p></div><div className="productBranches"><a href="#shift" className="branchCard active"><span>01</span><b>Shift</b><p>Turn demand, requirements, employee commitments, and rules into a coverage-ready weekly roster.</p><em>STAFFING DECISIONS ↘</em></a><a href="#incident" className="branchCard incident"><span>02</span><b>Incident</b><p>Turn frontline events into clear ownership, response, resolution, and evidence.</p><em>OPERATIONAL RESPONSE ↘</em></a></div></section>

    <section id="shift" className="product chapter shiftProduct">
      <div className="productIntro"><div><span className="productNumber">01</span><span className="index">TIDEMARK SHIFT</span></div><h2>Every shift covered.<br/>Every decision understood.</h2><p>Shift turns changing demand, employee commitments, and operating rules into a coverage-ready weekly roster leaders can inspect, adjust, and publish with confidence.</p><div className="pillRow"><span>Demand</span><span>Requirements</span><span>Commitments</span><span>Rules</span><span>Published roster</span></div></div>
      <div className="shiftFlow glass">
        <div className="flowTop"><div><Mark/> TideMark <b>Shift</b></div><span>Week of July 13</span><em>PLANNING</em></div>
        <div className="demandPanel"><header><div><small>WEEK-LONG DEMAND HORIZON</small><b>Read the operation before building the roster.</b></div><span>Drag through the week →</span></header><div className="days">{["MON","TUE","WED","THU","FRI","SAT","SUN"].map((x,i)=><button key={x} className={day===i?"selected":""} onClick={()=>setDay(i)} aria-label={`View ${x} demand`}><small>{x}</small><b>{82+[4,7,9,12,10,6,1][i]}%</b><i style={{height:`${36+[4,12,19,30,22,10,2][i]}px`}}/></button>)}</div></div>
        <div className="requirements"><div><small>DEMAND SIGNAL</small><b>{["148 arrivals","176 arrivals","211 arrivals","Group peak · 228 arrivals","218 arrivals","184 arrivals","131 arrivals"][day]}</b><p>{day===3?"Harbour Ballroom group arrival increases PM desk pressure.":"Forecast and operating context for this day."}</p></div><span className="flowArrow">→</span><div><small>REQUIREMENT TACTIC</small><b>{day===3?"Add one PM Guest Agent":"Baseline coverage"}</b><p>Role-by-shift requirements update with a stated rationale.</p></div><span className="flowArrow">→</span><div><small>COVERAGE PLAN</small><b>{day===3?"PM · 4 required":"All required roles"}</b><p>Coverage is defined before anyone is assigned.</p></div></div>
      </div>

      <div className="decisionStack chapter"><div className="stackCopy"><span className="index">THE DECISION STACK</span><h2>Thousands of tradeoffs.<br/>One coherent week.</h2><p>Coverage comes first. Role fit, employee commitments, hours, rest, seniority, stability, and fairness shape the result without hiding remaining gaps.</p></div><div className="stackVisual">{["Demand & required coverage","Hard operating boundaries","Role fit & cross-training","Employee commitments","Stability & fairness","Publishable roster"].map((x,i)=><div key={x} style={{transform:`translateY(${i*8}px) scale(${1-i*.035})`,opacity:1-i*.09}}><span>0{i+1}</span><b>{x}</b><em>{i<5?"EVALUATED":"READY"}</em></div>)}</div></div>

      <div className="controlIntro"><span className="index">MANAGER CONTROL</span><h2>Automation proposes.<br/>Operators decide.</h2><p>Test the change. See the consequences. Protect the decisions that matter. Publish only when the week is ready.</p></div>
      <div className="roster glass"><div className="rosterTop"><div><Mark/> TideMark <b>Shift</b></div><span>Front Office · Weekly roster</span><button onClick={()=>setVacation(!vacation)}>{vacation?"Undo preview":"Preview Maya’s vacation"}</button></div><div className="rosterNotice"><span>{vacation?"IMPACT PREVIEW":"PUBLISHED DRAFT"}</span><p>{vacation?"Maya’s approved Thursday request moves 2 assignments. 25 assignments remain anchored.":"Coverage-ready roster with overnight rest and employee commitments evaluated."}</p><em>{vacation?"1 GAP TO RESOLVE":"NO HIDDEN SHORTAGES"}</em></div><div className="rosterGrid"><div className="row head"><b>EMPLOYEE</b>{["MON","TUE","WED","THU","FRI","SAT","SUN"].map(x=><b key={x}>{x}</b>)}</div>{roster.map((r,ri)=><div className="row" key={r[0]}>{r.map((c,ci)=><span key={ci} className={`${ci>0&&c!=="Off"?"assigned":""} ${vacation&&ri===0&&ci===4?"changed":""} ${vacation&&ri===1&&ci===4?"moved":""}`}>{vacation&&ri===0&&ci===4?"VAC":vacation&&ri===1&&ci===4?"PM ↗":c}{ci===2&&ri===0?<i>⌁</i>:null}</span>)}</div>)}</div><div className="rosterFoot"><span>⌁ Pinned decisions stay anchored while the surrounding roster adapts.</span><b>Coverage <em>{vacation?"Review required":"Ready"}</em></b></div></div>
    </section>

    <section id="incident" className="incidentProduct chapter">
      <div className="incidentArrival"><span className="index">THE INCIDENT BRANCH</span><div className="traceLine"/><span>FRAGMENTED ACCOUNT</span><i/><span>STRUCTURED EVIDENCE</span><i/><span>OPERATIONAL MEMORY</span></div>
      <div className="productIntro"><div><span className="productNumber purple">02</span><span className="index">TIDEMARK INCIDENT</span></div><h2>When something happens,<br/>capture what matters.</h2><p>TideMark guides hotel managers from a first account to a complete, privacy-protected incident record without forcing the situation into a generic form.</p><div className="pillRow incidentProof"><span>Guided intake</span><span>Hospitality playbooks</span><span>Privacy before AI</span><span>Human confirmation</span><span>Word + PDF reporting</span></div></div>

      <div className="truthProblem"><span className="index">THE TRUTH-CAPTURE PROBLEM</span><h2>The event is difficult.<br/>Reconstructing it should not be.</h2><p>Managers work from memory, partial statements, radio calls, security notes, and departmental updates. By the time those fragments reach a static form, important details have already begun to disappear.</p><div className="fragments"><span>RADIO · “Security attended”</span><span>NOTE · “Photos taken”</span><span>CCTV · Camera 04</span><span>ROOM MOVE · 814 → 606</span><span>MEMORY · Medical declined?</span></div></div>

      <div className="captureFlow glass">
        <div className="captureHead"><div><Mark/> TideMark <b>Incident</b></div><span>New incident · Natural-language intake</span><em>FIRST ACCOUNT PRESERVED</em></div>
        <div className="captureColumns">
          <div className="rawAccount"><small>MANAGER’S ACCOUNT</small><p>{incidentSamples[incidentSample].account}</p><div className="captureModes"><span>⌨ Text</span><span>◉ Voice</span><span>▧ Image</span></div></div>
          <div className="extraction"><small>TIDEMARK IS ORGANIZING</small><div className="fact"><i/>Incident type<b>{incidentSamples[incidentSample].type}</b></div><div className="fact"><i/>Time captured<b>{incidentSample===0?"21:40":incidentSample===1?"18:25":"14:12"}</b></div><div className="fact"><i/>People & roles<b>Needs clarification</b></div><div className="fact"><i/>Response<b>{incidentSample===1?"Security notified":"Response documented"}</b></div><div className="fact missing"><i/>Missing context<b>{incidentSamples[incidentSample].question}</b></div></div>
          <div className="structuredRecord"><small>STRUCTURED RECORD</small><header><b>{incidentSamples[incidentSample].type}</b><span>DRAFT</span></header>{["Time & location","People & roles","Immediate response","Evidence","Outcome & follow-up"].map((x,i)=><div key={x}><span>{x}</span><em className={i===4?"open":""}>{i===4?"Question open":"Captured"}</em></div>)}</div>
        </div>
      </div>

      <div className="playbookSection"><div className="controlIntro"><span className="index">ADAPTIVE GUIDANCE</span><h2>The next question depends<br/>on what happened.</h2><p>TideMark identifies the incident type, applies its hospitality playbook, and opens only the relevant question paths.</p></div><div className="sampleTabs">{incidentSamples.map((s,i)=><button key={s.type} className={incidentSample===i?"active":""} onClick={()=>setIncidentSample(i)}>{s.type}</button>)}</div><div className="playbookMap glass"><div className="playbookOrigin"><small>IDENTIFIED PLAYBOOK</small><b>{incidentSamples[incidentSample].type}</b><p>{incidentSamples[incidentSample].question}</p></div><div className="playbookTracks">{incidentSamples[incidentSample].track.map((x,i)=><div key={x} className={i<3?"relevant":""}><i/><span>{x}</span><em>{i<3?"Relevant":"If disclosed"}</em></div>)}</div></div></div>

      <div className="privacySection"><div className="stackCopy"><span className="index">PRIVACY BEFORE INTELLIGENCE</span><h2>Protect the identities.<br/>Preserve the meaning.</h2><p>Sensitive details are tokenized locally before external AI processing. Managers inspect the privacy pass and the local workflow restores protected values afterward.</p></div><div className="privacyLens glass"><div className="privacyToggle"><button className={privacyView==="manager"?"active":""} onClick={()=>setPrivacyView("manager")}>Manager’s view</button><button className={privacyView==="processing"?"active":""} onClick={()=>setPrivacyView("processing")}>AI processing view</button></div><div className="deviceBoundary"><small>LOCAL PRIVACY BOUNDARY</small><p>{privacyView==="manager"?<>Jane Smith in <mark>Room 814</mark> slipped near the pool entrance.</>:<><mark>[GUEST_7F2A]</mark> in <mark>[ROOM_C19D]</mark> slipped near the pool entrance.</>}</p><span>{privacyView==="manager"?"Identities available to the authorized manager":"Protected meaning sent for assisted processing"}</span></div><div className="privacyRoute"><span>Local detection</span><i>→</i><span>Privacy review</span><i>→</i><span>Bounded AI</span><i>→</i><span>Local restoration</span></div></div></div>

      <div className="accuracySection"><div className="controlIntro"><span className="index">ACCURACY + HUMAN AUTHORITY</span><h2>Professional language,<br/>accountable to the original.</h2><p>The original account, structured facts, and rewritten narrative remain connected. AI assists the record. It cannot approve it.</p></div><div className="recordLayers glass"><div><small>01 · ORIGINAL ACCOUNT</small><p>“Guest slipped near the pool entrance. Security came and photos were taken. She did not want an ambulance.”</p><span>SOURCE PRESERVED</span></div><i>→</i><div><small>02 · STRUCTURED FACTS</small><p>Location · Pool entrance<br/>Response · Security attended<br/>Evidence · Photos<br/>Medical · Declined</p><span>FACT GROUPS</span></div><i>→</i><div><small>03 · FINAL NARRATIVE</small><p>The guest reported slipping near the pool entrance. Security attended and photographs were captured. The guest declined medical assistance.</p><button onClick={()=>setAuditComplete(!auditComplete)}>{auditComplete?"Restore source fact":"Test factual audit"}</button></div></div><div className={`auditWarning ${auditComplete?"show":""}`}><b>FACT AUDIT · DISCREPANCY FOUND</b><span>The medical-refusal detail is present in the original account but missing from the edited narrative.</span><em>Human confirmation required</em></div></div>

      <div className="archiveSection"><div className="stackCopy"><span className="index">OPERATIONAL MEMORY</span><h2>Confirmed does not<br/>mean forgotten.</h2><p>Reports remain available in an encrypted local archive with search, incident-type filtering, integrity verification, editing, and Word or PDF export.</p></div><div className="archive glass"><header><div><Mark/> Incident archive</div><label>⌕ <input aria-label="Search incident archive" defaultValue="pool deck"/></label><span>12 confirmed records</span></header><div className="archiveRows"><div><span>TM-2026-041</span><b>Guest fall · Pool deck</b><em>Integrity verified</em><small>PDF · Word</small></div><div><span>TM-2025-118</span><b>Equipment failure · Pool access</b><em>Integrity verified</em><small>Open record</small></div><div><span>TM-2025-074</span><b>Guest complaint · Pool deck</b><em>Integrity verified</em><small>Related locally</small></div></div><footer><span>Encrypted local records</span><span>HMAC-SHA256 verification</span><span>Local similarity search</span></footer></div></div>

      <div className="incidentOutcome"><span className="index">THE OUTCOME</span><h2>Clearer reports.<br/>Stronger handoffs.<br/>Fewer unanswered questions.</h2><div className="incidentOutcomeGrid"><div><b>Capture</b><p>Relevant context while memory is fresh.</p></div><div><b>Protect</b><p>Sensitive details inside a deliberate privacy workflow.</p></div><div><b>Verify</b><p>Rewritten language accountable to source facts.</p></div><div><b>Preserve</b><p>Searchable, exportable operating records.</p></div></div></div>
    </section>

    <section className="outcomes chapter"><span className="index">THE OPERATING MODEL</span><h2>Observe the hotel.<br/><em>Decide with context.</em></h2><div className="outcomeGrid state"><div><strong>Know</strong><small>what is covered<br/>and what remains exposed</small></div><div><strong>Understand</strong><small>why the system<br/>made each recommendation</small></div><div><strong>Control</strong><small>what changes,<br/>what stays, and what publishes</small></div></div></section>

    <section className="builder chapter"><div className="builderCard glass"><div><span className="index">FROM THE BUILDER</span><h2>Built inside hospitality.<br/>Opening for others.</h2></div><div className="builderNote"><p>I am preparing Project TideMark for an open-source release so hotel operators and builders can inspect it, adapt it, and improve it. Request early access and I will help you get the project set up.</p><div className="builderIdentity"><span>OG</span><div><b>Oguzhan Gur</b><small>Hospitality professional · Founder, Project TideMark · British Columbia</small></div></div><a href="https://www.linkedin.com/in/oguzhangur" target="_blank" rel="noreferrer">Connect on LinkedIn <span>↗</span></a></div></div></section>

    <section id="contact" className="final chapter"><div className="halo"/><Mark large/><span className="index">OPEN-SOURCE EARLY ACCESS</span><h2>Run it yourself.<br/>I will help you start.</h2><p>Request access to Project TideMark and tell me how you plan to use it. I will follow up with the project status and setup guidance.</p><form className="accessForm" action="https://formspree.io/f/xlgadqyd" method="POST"><input type="hidden" name="_subject" value="Project TideMark early access request"/><label><span>Your name</span><input name="name" autoComplete="name" required placeholder="Name"/></label><label><span>Work email</span><input type="email" name="email" autoComplete="email" required placeholder="you@hotel.com"/></label><label><span>I am interested as</span><select name="interest" defaultValue="Hotel operator"><option>Hotel operator</option><option>Independent hotel</option><option>Hospitality builder</option><option>Open-source contributor</option><option>Other</option></select></label><label className="wide"><span>What would you like to set up?</span><textarea name="setup_goal" rows={3} placeholder="Tell me about your property, team, or intended use."/></label><button type="submit">Request early access <span>↗</span></button></form><small className="formNote">Open-source release in preparation · Personal setup support from Oguzhan</small></section>
    <footer><div className="brand"><Mark/><span>Project TideMark</span></div><span>Built by Oguzhan Gur in British Columbia.</span><a href="https://www.linkedin.com/in/oguzhangur" target="_blank" rel="noreferrer">LinkedIn ↗</a></footer>
  </main>;
}
