# Toil in SRE: Identification & Prioritization

## 1. What Is Toil?

- **Definition** (per Google SRE): “Toil is operational work tied to running a production service that is manual, repetitive, automatable, tactical, devoid of enduring value.”
- **Key properties**:
  - **Manual & repetitive**: You do it by hand, the same way, every time.
  - **No lasting benefit**: Once it’s done, it doesn’t reduce future work.
  - **Scales with service growth**: As your system grows, toil grows linearly.
  - **Should be reduced**: Automation replaces toil; true engineering work creates lasting improvements.

## 2. Common Toil Activities

| Category               | Examples                                           |
|------------------------|----------------------------------------------------|
| Incident firefighting  | Manually restarting failed servers or pods        |
| Capacity ops           | Hand-scaling clusters or load balancer pools       |
| Deploy and releases    | Running identical deployment scripts by hand       |
| Credential management  | Rotating keys, updating secrets across services    |
| Routine maintenance    | Log cleanup, backups, patching systems on schedule |
| Access requests        | Granting/revoking user permissions                 |
| Alert triage           | Snoozing known flapping alerts, manually clearing alarms |

## 3. Identifying Toil

1. **Time tracking & time-boxing**  
   - Log how much time on operational tasks each week.  
   - Anything repetitive and taking >5% of your calendar is suspect.
2. **Task inventory**  
   - Keep a running checklist of every manual step you perform in ops.  
   - Look for tasks that: repeat without change, have clear automatable steps, and require little human judgment.
3. **On-call postmortems & runbooks**  
   - Review your runbooks: steps in every incident. Are they long, copy-paste-y, or simply “do X then Y”?  
   - Flag each step: is it decision-making or rote execution?
4. **Surveys & interviews**  
   - Ask your team: “What do you dread doing week after week?”  
   - Often the highest-pain manual tasks bubble up.

## 4. Prioritizing Toil for Automation

Rank potential toil by **ROI** and **risk**:

1. **Frequency × Effort**  
   - Estimate how often the task occurs (per week/month) and how long it takes each time.  
   - **High frequency × high duration** = top candidates for automation.
2. **Error risk & blast radius**  
   - Manual tasks prone to mistakes—especially those that, if done wrong, cause outages—should be automated ASAP.
3. **Automation cost & complexity**  
   - Some tasks are trivial to script; others require complex solutions.  
   - Prioritize “low-hanging fruit”: high-toil, low-effort to automate.
4. **Strategic alignment**  
   - Does automating this toil free you to work on high-value projects (e.g., reliability features, capacity planning)?  
   - Pick automations that unlock the most strategic capacity.

## 5. Prioritization Matrix

|                   | **Low Effort to Automate**      | **High Effort to Automate**     |
|-------------------|---------------------------------|---------------------------------|
| **High Toil**     | **Automate now**                | Plan or prototype automation    |
| **Low Toil**      | Consider later (value too small)| Ignore or defer                 |

## 6. Continuous Toil Management

- **Set a Toil Budget** (e.g., max 15% of engineering time on toil).
- **Track monthly**: measure how much time is still being spent on toil versus eliminated.
- **Embed automation in PR reviews**: if someone documents a manual step, challenge “Could this be a job, script, or operator?”
- **Maintain fail-safe runbooks**: automated systems can fail—ensure clear manual fallback instructions that remain as simple as possible.

## Takeaway

Toil is the enemy of long-term reliability. By systematically identifying, quantifying, and prioritizing it—focusing first on repetitive, risky, high-impact tasks—you free your team to build lasting improvements rather than fighting fires. Automate relentlessly, retire manual runbooks, and watch your service stability and team morale soar.
