from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class SafetyIncident(Base):
    __tablename__ = 'safety_incidents'

    id = Column(Integer, primary_key=True, index=True)
    incident_type = Column(String, index=True)
    description = Column(String)
    date_reported = Column(DateTime, default=datetime.utcnow)
    reported_by = Column(String)
    severity_level = Column(String)  # e.g., Low, Medium, High
    status = Column(String, default='Open')  # e.g., Open, In Progress, Resolved

    def __repr__(self):
        return f"<SafetyIncident(id={self.id}, incident_type={self.incident_type}, status={self.status})>"