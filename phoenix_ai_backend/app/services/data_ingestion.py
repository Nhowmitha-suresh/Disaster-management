def ingest_data(source):
    # Dummy function for data ingestion
    return f'Data ingested from {source}'

# In-memory storage for demo
_REPORTS = []

def create_report(lat, lon=None, description=None):
    """Saves a new report to the in-memory list."""
    report = {
        'lat': lat,
        'lon': lon,
        'description': description
    }
    _REPORTS.append(report)
    return report

def get_all_reports():
    """Returns all saved reports."""
    return _REPORTS
