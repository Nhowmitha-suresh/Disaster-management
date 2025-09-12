import React, { useEffect, useState } from 'react';
import { getStatus } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [status, setStatus] = useState('Loading...');
  const [volunteer, setVolunteer] = useState({ name: '', skill: '', contact: '' });
  const [volunteerMsg, setVolunteerMsg] = useState('');
  // Sample data for chart
  const [incidents, setIncidents] = useState([
    { date: '2025-09-10', count: 2 },
    { date: '2025-09-11', count: 5 },
    { date: '2025-09-12', count: 3 }
  ]);
  // New: Resource prediction, vulnerability, economic impact, feedback loop
  const [resourcePred, setResourcePred] = useState(null);
  const [vulnMap, setVulnMap] = useState(null);
  const [econImpact, setEconImpact] = useState(null);
  const [feedback, setFeedback] = useState(null);
  useEffect(() => {
    getStatus()
      .then(data => setStatus(data.status))
      .catch(() => setStatus('Backend not reachable'));
    fetch(process.env.REACT_APP_API_URL + '/v1/resource-prediction', { method: 'POST' })
      .then(res => res.json()).then(setResourcePred);
    fetch(process.env.REACT_APP_API_URL + '/v1/vulnerability-map')
      .then(res => res.json()).then(setVulnMap);
    fetch(process.env.REACT_APP_API_URL + '/v1/economic-impact', { method: 'POST' })
      .then(res => res.json()).then(setEconImpact);
    fetch(process.env.REACT_APP_API_URL + '/v1/feedback-loop', { method: 'POST' })
      .then(res => res.json()).then(setFeedback);
  }, []);
  return (
    <section className="dashboard-grid">
      <div className="dashboard-card dashboard-alerts">
        <h2>Real-Time Alerts</h2>
        <p>Status: <span className={status === 'Phoenix AI backend running' ? 'status-ok' : 'status-bad'}>{status}</span></p>
      </div>
      <div className="dashboard-card dashboard-kpi">
        <h2>Key Metrics</h2>
        <div className="kpi-row">
          <div className="kpi-item"><span className="kpi-icon">🌊</span> Floods: 2</div>
          <div className="kpi-item"><span className="kpi-icon">🔥</span> Fires: 1</div>
          <div className="kpi-item"><span className="kpi-icon">🚑</span> Rescues: 3</div>
        </div>
      </div>
      <div className="dashboard-card dashboard-chart">
        <h2>Incidents Over Time</h2>
        <svg width="100%" height="80">
          {/* Simple line chart */}
          <polyline
            fill="none"
            stroke="#1976d2"
            strokeWidth="3"
            points={incidents.map((d, i) => `${i * 60 + 20},${80 - d.count * 15}`).join(' ')}
          />
          {incidents.map((d, i) => (
            <circle key={i} cx={i * 60 + 20} cy={80 - d.count * 15} r="4" fill="#1976d2" />
          ))}
        </svg>
        <div className="chart-labels">
          {incidents.map((d, i) => <span key={i}>{d.date}</span>)}
        </div>
      </div>
      <div className="dashboard-card dashboard-mitigation">
        <h2>Mitigation Measures</h2>
        <ul>
          <li>Upgrade drainage infrastructure in high-risk zones</li>
          <li>Implement flood barriers near rivers</li>
          <li>Regular maintenance of water channels</li>
          <li>Community awareness and evacuation drills</li>
          <li>Monitor rainfall and water levels continuously</li>
        </ul>
        {/* Resource Prediction */}
        {resourcePred && (
          <div style={{marginTop:'1rem'}}>
            <h4>Resource Pre-positioning</h4>
            <ul>
              {resourcePred.resources.map((r, i) => (
                <li key={i}><b>{r.type}</b>: {r.quantity} {r.unit} at {r.location}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* Vulnerability Map */}
      <div className="dashboard-card dashboard-vulnerability">
        <h2>Vulnerability Mapping</h2>
        {vulnMap ? (
          <ul>
            {vulnMap.areas.map((a, i) => (
              <li key={i}><b>{a.name}</b> - Risk: <span style={{color:a.risk==='high'?'red':a.risk==='medium'?'orange':'green'}}>{a.risk}</span>, Vulnerable: {a.vulnerable_pop}, Infra: {a.critical_infra.join(', ')}</li>
            ))}
          </ul>
        ) : 'Loading...'}
      </div>
      {/* Economic Impact */}
      <div className="dashboard-card dashboard-economic">
        <h2>Economic Impact</h2>
        {econImpact ? (
          <div>
            <b>Estimated Loss:</b> ${econImpact.estimated_loss_usd.toLocaleString()}<br/>
            <b>Businesses Affected:</b> {econImpact.businesses_affected}<br/>
            <b>Summary:</b> {econImpact.summary}
          </div>
        ) : 'Loading...'}
      </div>
      {/* Feedback Loop */}
      <div className="dashboard-card dashboard-feedback">
        <h2>Lessons Learned & Feedback</h2>
        {feedback ? (
          <div>
            <b>Improvement:</b> {feedback.improvement}<br/>
            <b>Recommendation:</b> {feedback.recommendation}
          </div>
        ) : 'Loading...'}
      </div>
      <div className="dashboard-card dashboard-volunteer">
        <h2>Volunteer Registration</h2>
        <form onSubmit={e => {
          e.preventDefault();
          setVolunteerMsg('Thank you for registering, ' + volunteer.name + '!');
          setVolunteer({ name: '', skill: '', contact: '' });
        }}>
          <input type="text" placeholder="Name" value={volunteer.name} onChange={e => setVolunteer({ ...volunteer, name: e.target.value })} required />
          <input type="text" placeholder="Skill" value={volunteer.skill} onChange={e => setVolunteer({ ...volunteer, skill: e.target.value })} required />
          <input type="text" placeholder="Contact" value={volunteer.contact} onChange={e => setVolunteer({ ...volunteer, contact: e.target.value })} required />
          <button type="submit">Register</button>
        </form>
        {volunteerMsg && <div className="volunteer-msg">{volunteerMsg}</div>}
      </div>
    </section>
  );
};

export default Dashboard;
