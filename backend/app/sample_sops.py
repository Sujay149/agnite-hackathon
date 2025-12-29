"""SOP data management - supports both uploaded documents and sample data for demo"""

# For demonstration/testing purposes only
# In production, this would be replaced with a document database
SAMPLE_SOPS = {
    "demo_loto": {
        "title": "LOTO Procedure (Demo)",
        "content": """
This is a representative example of a Lockout/Tagout procedure.
In production, this would be replaced with your facility's actual SOP documents.

This document covers the fundamental safety concepts and rationale behind energy control procedures used to protect workers from hazardous energy during maintenance and servicing activities.
"""
    }
}


def get_sop_list():
    """
    Return list of available SOPs.
    In production, this would query a document database.
    """
    return [
        {"id": key, "title": sop["title"]} 
        for key, sop in SAMPLE_SOPS.items()
    ]


def get_sop_content(sop_id: str) -> str:
    """
    Get content of specific SOP.
    In production, this would retrieve from document storage.
    """
    if sop_id in SAMPLE_SOPS:
        return SAMPLE_SOPS[sop_id]["content"]
    return ""


def add_uploaded_sop(sop_id: str, title: str, content: str):
    """
    Add an uploaded SOP document.
    In production, this would store in a database with vector embeddings.
    """
    SAMPLE_SOPS[sop_id] = {
        "title": title,
        "content": content
    }
