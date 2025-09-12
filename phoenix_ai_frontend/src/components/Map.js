import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const Map = () => {
  const mapContainer = useRef(null);
  const [risk, setRisk] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [reports, setReports] = useState([]);
  const [reportForm, setReportForm] = useState({ lat: '', lon: '', description: '' });
  const [showReportForm, setShowReportForm] = useState(false);
  const [socialPosts, setSocialPosts] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [dynamicRisk, setDynamicRisk] = useState(null);
  const [damageReport, setDamageReport] = useState(null);
    // Fetch social media posts
    const fetchSocial = async () => {
      const res = await fetch(process.env.REACT_APP_API_URL + '/v1/social');
      const data = await res.json();
      setSocialPosts(data.posts || []);
      // Remove old social markers
      document.querySelectorAll('.social-marker').forEach(el => el.remove());
      // Add new social markers
      (data.posts || []).forEach(p => {
        const el = document.createElement('div');
        el.className = 'social-marker';
        el.style.background = 'deepskyblue';
        el.style.width = '14px';
        el.style.height = '14px';
        el.style.borderRadius = '50%';
        el.title = p.text;
        new mapboxgl.Marker(el).setLngLat([p.lon, p.lat]).addTo(map);
      });
    };
    fetchSocial();
    const socialInterval = setInterval(fetchSocial, 10000);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [77.209, 28.6139],
      zoom: 10
    });


    // Click handler for risk assessment and reporting
    map.on('click', async (e) => {
      const { lng, lat } = e.lngLat;
      // Show report form on click
      setReportForm({ lat, lon: lng, description: '' });
      setShowReportForm(true);
      // Risk assessment
      const location = `lat:${lat.toFixed(4)},lon:${lng.toFixed(4)}`;
      const res = await fetch(process.env.REACT_APP_API_URL + '/v1/risk-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location })
      });
      const data = await res.json();
      setRisk(data);
      new mapboxgl.Marker({ color: data.risk_level === 'high' ? 'red' : data.risk_level === 'medium' ? 'yellow' : 'green' })
        .setLngLat([lng, lat])
        .addTo(map);
    });
    // Fetch and display citizen reports
    const fetchReports = async () => {
      const res = await fetch(process.env.REACT_APP_API_URL + '/v1/reports');
      const data = await res.json();
      setReports(data.reports || []);
      // Remove old report markers
      document.querySelectorAll('.report-marker').forEach(el => el.remove());
      // Add new report markers
      (data.reports || []).forEach(r => {
        const el = document.createElement('div');
        el.className = 'report-marker';
        el.style.background = 'crimson';
        el.style.width = '14px';
        el.style.height = '14px';
        el.style.borderRadius = '50%';
        el.title = r.description;
        new mapboxgl.Marker(el).setLngLat([parseFloat(r.lon), parseFloat(r.lat)]).addTo(map);
      });
    };
    fetchReports();
    const reportInterval = setInterval(fetchReports, 7000);

    // Fetch and display vehicles every 5 seconds
    const fetchVehicles = async () => {
      const res = await fetch(process.env.REACT_APP_API_URL + '/v1/vehicles');
      const data = await res.json();
      setVehicles(data.vehicles);
      // Remove old vehicle markers
      document.querySelectorAll('.vehicle-marker').forEach(el => el.remove());
      // Add new vehicle markers
      data.vehicles.forEach(v => {
        const el = document.createElement('div');
        el.className = 'vehicle-marker';
        el.style.background = v.type === 'Ambulance' ? 'blue' : v.type === 'Fire Truck' ? 'orange' : 'purple';
        el.style.width = '16px';
        el.style.height = '16px';
        el.style.borderRadius = '50%';
        el.title = v.type;
        new mapboxgl.Marker(el).setLngLat([v.lon, v.lat]).addTo(map);
      });
    };
    fetchVehicles();
    const interval = setInterval(fetchVehicles, 5000);

    return () => {
      map.remove();
      clearInterval(interval);
      clearInterval(reportInterval);
      clearInterval(socialInterval);
    };
  }, []);

  return (
    <div>
      <div ref={mapContainer} style={{height: '400px', width: '100%'}} />
      {risk && (
        <div style={{marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px #ccc'}}>
          <h3>Risk Assessment</h3>
          <p><strong>Location:</strong> {risk.location}</p>
          <p><strong>Risk Level:</strong> <span style={{color: risk.risk_level === 'high' ? 'red' : risk.risk_level === 'medium' ? 'orange' : 'green'}}>{risk.risk_level}</span></p>
          <p><strong>Explanation:</strong> {risk.explanation}</p>
        </div>
      )}
      {showReportForm && (
        <div style={{marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', boxShadow: '0 2px 8px #ccc'}}>
          <h3>Report a Hazard</h3>
          <form onSubmit={async e => {
            e.preventDefault();
            await fetch(process.env.REACT_APP_API_URL + '/v1/report', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(reportForm)
            });
            setShowReportForm(false);
          }}>
            <div>Lat: <input type="text" value={reportForm.lat} readOnly style={{width:'100px'}} /></div>
            <div>Lon: <input type="text" value={reportForm.lon} readOnly style={{width:'100px'}} /></div>
            <div>Description: <input type="text" value={reportForm.description} onChange={e => setReportForm({...reportForm, description: e.target.value})} required style={{width:'200px'}} /></div>
            <button type="submit">Submit Report</button>
            <button type="button" onClick={()=>setShowReportForm(false)} style={{marginLeft:'1rem'}}>Cancel</button>
          </form>
        </div>
      )}
      {/* Social Media Posts */}
      {socialPosts.length > 0 && (
        <div style={{marginTop:'1rem', padding:'1rem', background:'#e0f7fa', borderRadius:'8px'}}>
          <h3>Social Media Alerts</h3>
          <ul>
            {socialPosts.map(p => <li key={p.id}>{p.text}</li>)}
          </ul>
        </div>
      )}
      {/* AI Chatbot */}
      <div style={{marginTop:'1rem', padding:'1rem', background:'#f3e8ff', borderRadius:'8px'}}>
        <h3>Ask the AI Chatbot</h3>
        <form onSubmit={async e => {
          e.preventDefault();
          setChatResponse('...');
          const res = await fetch(process.env.REACT_APP_API_URL + '/v1/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: chatInput })
          });
          const data = await res.json();
          setChatResponse(data.answer);
        }}>
          <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask about shelters, evacuation, aid..." style={{width:'250px'}} required />
          <button type="submit" style={{marginLeft:'1rem'}}>Ask</button>
        </form>
        {chatResponse && <div style={{marginTop:'0.5rem'}}><strong>AI:</strong> {chatResponse}</div>}
      </div>
      {/* Dynamic Risk Modeling */}
      <div style={{marginTop:'1rem', padding:'1rem', background:'#fffbe7', borderRadius:'8px'}}>
        <h3>Dynamic Risk Modeling</h3>
        <form onSubmit={async e => {
          e.preventDefault();
          const rainfall = parseFloat(e.target.rainfall.value);
          const river_level = parseFloat(e.target.river_level.value);
          const res = await fetch(process.env.REACT_APP_API_URL + '/v1/dynamic-risk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rainfall, river_level })
          });
          const data = await res.json();
          setDynamicRisk(data);
        }}>
          <label>Rainfall (mm): <input name="rainfall" type="number" step="0.1" required /></label>
          <label style={{marginLeft:'1rem'}}>River Level (m): <input name="river_level" type="number" step="0.1" required /></label>
          <button type="submit" style={{marginLeft:'1rem'}}>Assess</button>
        </form>
        {dynamicRisk && <div style={{marginTop:'0.5rem'}}><strong>Risk Level:</strong> <span style={{color: dynamicRisk.risk_level === 'high' ? 'red' : dynamicRisk.risk_level === 'medium' ? 'orange' : 'green'}}>{dynamicRisk.risk_level}</span> (Rainfall: {dynamicRisk.rainfall} mm, River: {dynamicRisk.river_level} m)</div>}
      </div>
      {/* Automated Damage Assessment */}
      <div style={{marginTop:'1rem', padding:'1rem', background:'#ffeaea', borderRadius:'8px'}}>
        <h3>Automated Damage Assessment</h3>
        <button onClick={async ()=>{
          const res = await fetch(process.env.REACT_APP_API_URL + '/v1/damage-assessment', { method: 'POST' });
          const data = await res.json();
          setDamageReport(data);
        }}>Run Assessment</button>
        {damageReport && <div style={{marginTop:'0.5rem'}}><strong>Damage Score:</strong> {damageReport.damage_score} <br/> <strong>Summary:</strong> {damageReport.summary}</div>}
      </div>
    </div>
  );
};

export default Map;
