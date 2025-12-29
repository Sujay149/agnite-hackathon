"""Safety filtering logic to detect and refuse unsafe queries"""

from typing import Tuple
import re


class SafetyFilter:
    """Filters queries that request approvals, decisions, or unsafe guidance"""
    
    # Patterns that indicate approval-seeking or decision-making requests
    UNSAFE_PATTERNS = [
        # Approval seeking
        r'\b(can i|may i|is it (ok|okay|safe|fine) (to|if)|should i|am i (allowed|permitted))\b',
        r'\b(approve|permission|authorize|allow me to)\b',
        r'\b(skip|bypass|shortcut|ignore|omit)\b.*\b(step|procedure|safety|requirement)\b',
        
        # Decision making
        r'\b(what should i do|tell me what to do|what action|decide for me)\b',
        r'\b(is (this|it|that) (safe|correct|right|compliant))\b',
        r'\b(validate|verify|confirm|certify) (my|this|that)\b',
        
        # Real-time operational guidance
        r'\b(right now|currently|at the moment|immediately)\b.*\b(do|start|begin|proceed)\b',
        r'\b(emergency|urgent|quickly|asap)\b.*\b(what (to|should)|how (to|do))\b',
        
        # Replacing supervision
        r'\b(instead of (supervisor|manager|safety officer)|without (approval|permission))\b',
        r'\b(don\'t (have|need)|without) (supervisor|manager|safety officer)\b',
    ]
    
    # Patterns that indicate explanation requests (SAFE)
    SAFE_PATTERNS = [
        r'\b(what (is|are|does|means)|explain|describe|tell me about)\b',
        r'\b(why (is|are|does|do)|how come|what\'s the reason)\b',
        r'\b(define|definition|meaning of)\b',
        r'\b(summarize|summary|overview of)\b',
        r'\b(understand|learn|know more about)\b',
    ]
    
    @classmethod
    def is_query_safe(cls, query: str) -> Tuple[bool, str]:
        """
        Check if query is safe (explanation-seeking) or unsafe (approval-seeking)
        
        Returns:
            Tuple[bool, str]: (is_safe, reason)
        """
        query_lower = query.lower()
        
        # Check for unsafe patterns
        for pattern in cls.UNSAFE_PATTERNS:
            if re.search(pattern, query_lower):
                return False, cls._get_refusal_message(pattern)
        
        # Query is safe
        return True, ""
    
    @classmethod
    def _get_refusal_message(cls, pattern: str) -> str:
        """Generate appropriate refusal message based on detected pattern"""
        
        if 'approve' in pattern or 'permission' in pattern or 'can i' in pattern:
            return """I cannot approve or grant permission for any actions. 

**Why:** Safety approvals must come from authorized supervisors who can assess the specific situation, verify proper training, and ensure all safety requirements are met.

**What you should do:** Speak with your direct supervisor or safety officer before proceeding with any work activity.

⚠️ **Safety Disclaimer:** This explanation is for educational purposes only and does not constitute approval, authorization, or operational guidance. Always follow your facility's procedures and consult with authorized personnel."""
        
        elif 'skip' in pattern or 'bypass' in pattern or 'shortcut' in pattern:
            return """I cannot advise on skipping, bypassing, or shortcutting any safety procedures or SOP steps.

**Why:** Every step in safety procedures exists for a specific reason - to protect you and your coworkers from injury or death. Skipping steps creates hazards and violates safety regulations.

**What you should do:** If you have concerns about a procedure's efficiency or practicality, discuss them with your supervisor or safety committee. They can evaluate if the procedure needs updating through proper channels.

⚠️ **Safety Disclaimer:** This explanation is for educational purposes only and does not constitute approval, authorization, or operational guidance. Always follow your facility's procedures and consult with authorized personnel."""
        
        elif 'what should i do' in pattern or 'decide for me' in pattern:
            return """I cannot make operational decisions or tell you what actions to take in specific situations.

**Why:** Decisions about work activities must consider factors I cannot assess: your specific training, current conditions, equipment status, and site-specific hazards. Only qualified personnel on-site can make these decisions.

**What you should do:** Consult your supervisor, safety officer, or subject matter expert who can evaluate your specific situation and provide appropriate guidance.

⚠️ **Safety Disclaimer:** This explanation is for educational purposes only and does not constitute approval, authorization, or operational guidance. Always follow your facility's procedures and consult with authorized personnel."""
        
        elif 'is this safe' in pattern or 'validate' in pattern or 'verify' in pattern:
            return """I cannot validate, verify, or certify that any action or condition is safe.

**Why:** Safety validation requires on-site assessment by qualified personnel who can inspect actual conditions, verify equipment status, and confirm all safety requirements are met.

**What you should do:** Request a safety inspection or verification from your supervisor or safety department before proceeding with any questionable work.

⚠️ **Safety Disclaimer:** This explanation is for educational purposes only and does not constitute approval, authorization, or operational guidance. Always follow your facility's procedures and consult with authorized personnel."""
        
        elif 'emergency' in pattern or 'right now' in pattern:
            return """I cannot provide real-time emergency or operational guidance.

**Why:** Emergency situations require immediate response from trained personnel who can assess the actual conditions and take appropriate action. Delays from consulting an AI system could be dangerous.

**What you should do for emergencies:**
- **Immediate danger:** Evacuate and call 911
- **Equipment issues:** Follow emergency shutdown procedures and notify supervisor
- **Injuries:** Render first aid if trained, call for medical help
- **Uncertain situations:** Stop work and consult supervisor immediately

⚠️ **Safety Disclaimer:** This explanation is for educational purposes only and does not constitute approval, authorization, or operational guidance. Always follow your facility's procedures and consult with authorized personnel."""
        
        else:
            return """I cannot provide approval, authorization, or operational decisions.

**Why:** I am an explanation tool only. Safety and operational decisions must be made by qualified, authorized personnel who can assess your specific situation.

**What you should do:** Consult your supervisor, safety officer, or the appropriate subject matter expert for guidance on any work activities.

⚠️ **Safety Disclaimer:** This explanation is for educational purposes only and does not constitute approval, authorization, or operational guidance. Always follow your facility's procedures and consult with authorized personnel."""
