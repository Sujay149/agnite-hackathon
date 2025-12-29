"""AI service for generating safe SOP explanations using OpenRouter Gemini Flash"""

import httpx
import re
from typing import Optional
try:
    from config import settings
    from safety_filter import SafetyFilter
except ImportError:
    from app.config import settings
    from app.safety_filter import SafetyFilter


class AIService:
    """Service for generating AI explanations with safety controls"""
    
    # Banned action verbs that indicate operational instructions
    # These patterns look for imperative/instructional use, not descriptive use
    BANNED_VERBS = [
        # Strong operational verbs (always banned)
        r'\b(disconnect|lock|attach|turn|switch|press|isolate|activate|deactivate)\s+(the|a|an|it)\b',
        r'\b(connect|remove|insert|pull|push|rotate|flip|engage|disengage)\s+(the|a|an|it)\b',
        r'\b(install|uninstall|mount|unmount|fasten|unfasten)\s+(the|a|an|it)\b',
        
        # Instructional phrases (action + object)
        r'\b(open|close)\s+(the|a|an)\s+(door|valve|panel|switch|breaker)\b',
        r'\b(apply|place|position|adjust)\s+(the|a|an|your)\b',
        
        # Imperative forms suggesting instructions
        r'\byou\s+(should|must|need to)\s+(disconnect|lock|attach|turn|switch|press|isolate|remove|connect|verify|check|test|inspect)\b',
        r'\b(first|then|next|finally),?\s+(disconnect|lock|attach|turn|switch|press)\b',
    ]
    
    SYSTEM_PROMPT = """You are a Manufacturing SOP & Safety Explanation Assistant designed for enterprise training environments.

Your primary objective is to HELP USERS UNDERSTAND safety concepts and SOP intent,
NOT to instruct, decide, or authorize any action.

=================================
🚫 ABSOLUTELY BANNED WORDS & PHRASES
=================================
NEVER use these action verbs or operational language:
- disconnect, lock, attach, turn, switch, press, isolate, activate, deactivate
- connect, remove, insert, pull, push, rotate, flip, engage, disengage
- install, uninstall, mount, unmount, fasten, unfasten, secure
- open, close, start, stop, shut down, power on, power off
- apply, place, position, adjust, verify, check, test, inspect
- Any phrase describing HOW to perform an action
- Any phrase describing WHAT tools or devices to use
- Any phrase describing WHEN or WHERE to perform actions

IF you catch yourself using these words, IMMEDIATELY rewrite in purely conceptual language.

=================================
CORE RESPONSE PHILOSOPHY
=================================
- Explain PURPOSE, INTENT, and SAFETY RATIONALE
- Speak as an educational assistant, not a trainer or operator
- Assume the user may be new, but never assume authority

=================================
ALLOWED BEHAVIOR
=================================
You MAY:
- Explain what a safety concept means in simple, high-level language
- Explain why a rule or SOP exists
- Describe risks in general, non-actionable terms
- Summarize procedures conceptually without describing actions
- Clarify terminology and safety intent
- Support learning and awareness

=================================
STRICTLY FORBIDDEN BEHAVIOR
=================================
You MUST NOT:
- Provide step-by-step explanations
- Use numbered or ordered lists
- Describe how a task is performed
- Mention tools, devices, switches, locks, tags, buttons, or actions
- Use operational verbs (see BANNED WORDS section above)
- Approve, reject, or validate any action
- Answer "Is it safe to…"
- Provide real-time or emergency guidance
- Replace supervisors, safety officers, or official procedures

=================================
✅ GOLD-STANDARD EXAMPLE (FOLLOW THIS)
=================================
QUESTION: "Explain the lockout–tagout (LOTO) procedure in simple terms and why it is important"

CORRECT ANSWER:
"Lockout–tagout (LOTO) is a safety practice used to protect people from hazardous energy while equipment is being serviced or maintained.

In simple terms, the purpose of LOTO is to make sure that machines remain in a safe, inactive state so they cannot start unexpectedly while someone is working on them. Unexpected activation of equipment can lead to serious injuries or fatalities.

LOTO is important because it helps clearly indicate that equipment should not be used until maintenance activities are completed and authorized personnel confirm it is safe. By focusing on control and awareness rather than assumptions, the procedure helps reduce accidents and creates a safer working environment."

NOTICE: Zero action verbs, zero "how to", focuses on WHY not HOW, enterprise-safe language.

=================================
REFUSAL STRATEGY
=================================
If a question requests:
- Approval or permission
- Skipping safety steps
- Operational or real-time guidance

You MUST:
1. Politely refuse the request
2. Explain the safety PURPOSE behind the rule
3. Emphasize human authority and supervision
4. Avoid providing any actionable detail

=================================
LANGUAGE & TONE GUIDELINES
=================================
- Use calm, neutral, professional language
- Avoid commands and directives
- Avoid words that imply action or sequence
- Prefer phrases such as:
  - "In simple terms…"
  - "The purpose is to…"
  - "This is designed to help reduce risk…"
  - "This helps ensure a safer working environment…"
  - "This practice is used to protect…"
  - "This helps clearly indicate…"

=================================
MANDATORY DISCLAIMER (NON-NEGOTIABLE)
=================================
You MUST end EVERY response with the following disclaimer:

⚠️ Safety Disclaimer: This explanation is for educational purposes only. It does not provide operational instructions, approvals, or real-time guidance. Always follow your organization's official procedures and consult authorized supervisors or safety officers.

=================================
FINAL OVERRIDING RULE
=================================
If there is ANY doubt whether content could be interpreted as instructional or operational,
you MUST choose to be MORE ABSTRACT, LESS DETAILED, and MORE CAUTIOUS.

Before sending ANY response:
1. Scan for banned action verbs
2. Check if you described HOW instead of WHY
3. If found, REWRITE in conceptual language only

You are an EXPLAINER of safety intent — not an INSTRUCTOR of safety actions."""

    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.api_url = settings.OPENROUTER_API_URL
        self.model = settings.MODEL_NAME
    
    def _contains_banned_verbs(self, text: str) -> tuple[bool, list]:
        """
        Check if response contains banned action verbs
        
        Returns:
            (has_violations, list_of_violations)
        """
        violations = []
        text_lower = text.lower()
        
        for pattern in self.BANNED_VERBS:
            matches = re.findall(pattern, text_lower, re.IGNORECASE)
            if matches:
                violations.extend(matches)
        
        return (len(violations) > 0, violations)
    
    async def generate_explanation(
        self, 
        user_query: str, 
        sop_context: Optional[str] = None
    ) -> dict:
        """
        Generate safe explanation for user query
        
        Args:
            user_query: User's question
            sop_context: Optional SOP content for context
            
        Returns:
            dict with 'response' and 'safe' keys
        """
        
        # First, apply safety filter
        is_safe, refusal_message = SafetyFilter.is_query_safe(user_query)
        
        if not is_safe:
            return {
                "response": refusal_message,
                "safe": False,
                "filtered": True
            }
        
        # Build context message
        context_parts = []
        if sop_context:
            context_parts.append(f"**Relevant SOP Content:**\n{sop_context}\n")
        
        context_parts.append(f"**User Question:** {user_query}")
        
        user_message = "\n".join(context_parts)
        
        # Call OpenRouter API
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.api_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {
                                "role": "system",
                                "content": self.SYSTEM_PROMPT
                            },
                            {
                                "role": "user",
                                "content": user_message
                            }
                        ],
                        "temperature": 0.7,
                        "max_tokens": 1000,
                    }
                )
                
                response.raise_for_status()
                data = response.json()
                
                ai_response = data["choices"][0]["message"]["content"]
                
                # CRITICAL: Validate response for banned verbs
                has_violations, violations = self._contains_banned_verbs(ai_response)
                
                if has_violations:
                    # Response contains operational language - trigger rewrite
                    print(f"⚠️ COMPLIANCE VIOLATION DETECTED: {violations}")
                    
                    rewrite_prompt = f"""Your previous response contained operational language that violates safety compliance rules.

VIOLATIONS FOUND: {', '.join(violations)}

You MUST rewrite this response in PURELY CONCEPTUAL language:
- Remove ALL action verbs
- Focus on PURPOSE and WHY, not HOW
- Use the gold-standard LOTO example as your template
- Make it enterprise-safe and judge-approved

Original response that needs rewriting:
{ai_response}

Provide the corrected, compliant version now:"""
                    
                    # Request rewrite
                    rewrite_response = await client.post(
                        self.api_url,
                        headers={
                            "Authorization": f"Bearer {self.api_key}",
                            "Content-Type": "application/json",
                        },
                        json={
                            "model": self.model,
                            "messages": [
                                {
                                    "role": "system",
                                    "content": self.SYSTEM_PROMPT
                                },
                                {
                                    "role": "user",
                                    "content": rewrite_prompt
                                }
                            ],
                            "temperature": 0.5,  # Lower temperature for more compliance
                            "max_tokens": 1000,
                        }
                    )
                    
                    rewrite_response.raise_for_status()
                    rewrite_data = rewrite_response.json()
                    ai_response = rewrite_data["choices"][0]["message"]["content"]
                    
                    # Check again
                    has_violations_2, violations_2 = self._contains_banned_verbs(ai_response)
                    if has_violations_2:
                        print(f"⚠️ SECOND VIOLATION: {violations_2} - Using fallback response")
                        # Use fallback safe response
                        ai_response = """I apologize, but I'm having difficulty providing a response that meets our strict safety compliance standards.

To ensure I don't inadvertently provide operational instructions, I recommend:
- Consulting your organization's official SOP documentation
- Speaking with your supervisor or safety officer
- Attending authorized training sessions

⚠️ Safety Disclaimer: This explanation is for educational purposes only. It does not provide operational instructions, approvals, or real-time guidance. Always follow your organization's official procedures and consult authorized supervisors or safety officers."""
                
                # Ensure disclaimer is present
                if "Safety Disclaimer" not in ai_response:
                    ai_response += "\n\n⚠️ Safety Disclaimer: This explanation is for educational purposes only. It does not provide operational instructions, approvals, or real-time guidance. Always follow your organization's official procedures and consult authorized supervisors or safety officers."
                
                return {
                    "response": ai_response,
                    "safe": True,
                    "filtered": False,
                    "rewritten": has_violations
                }
                
        except httpx.HTTPError as e:
            return {
                "response": f"I apologize, but I'm experiencing technical difficulties connecting to the AI service. Please try again in a moment or contact your supervisor for assistance.\n\nError: {str(e)}",
                "safe": True,
                "filtered": False,
                "error": str(e)
            }
        except Exception as e:
            return {
                "response": f"An unexpected error occurred. Please contact your supervisor for assistance.\n\nError: {str(e)}",
                "safe": True,
                "filtered": False,
                "error": str(e)
            }
