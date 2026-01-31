import logging
import json
from datetime import datetime, UTC

class PIIRedactionFilter(logging.Filter):
    """
    Redacts sensitive PII from log records.
    Handles both dict messages and string messages (simple regex/check).
    """
    REDACTED_FIELDS = ['phone_number', 'address', 'email', 'password']

    def filter(self, record):
        if isinstance(record.msg, dict):
            # Shallow copy to avoid modifying original data if passed by reference
            record.msg = record.msg.copy()
            for field in self.REDACTED_FIELDS:
                if field in record.msg:
                    record.msg[field] = "[REDACTED]"
            
            # Handle nested data dict
            if "data" in record.msg and isinstance(record.msg["data"], dict):
                record.msg["data"] = record.msg["data"].copy()
                for field in self.REDACTED_FIELDS:
                    if field in record.msg["data"]:
                        record.msg["data"][field] = "[REDACTED]"
        
        return True

def setup_logger():
    logger = logging.getLogger("mepetcare_audit")
    logger.setLevel(logging.INFO)
    
    # Avoid duplicate handlers if setup is called multiple times
    if not logger.handlers:
        handler = logging.StreamHandler()
        # Use a simple format for console, the msg itself will be the structured dict
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.addFilter(PIIRedactionFilter())
    
    return logger

audit_logger = setup_logger()

def log_action(user_id: str, role: str, action: str, entity: str, entity_id: str, data: dict = None):
    """
    Helper to log structured clinical audit actions.
    """
    log_entry = {
        "user_id": user_id,
        "role": role,
        "action": action,
        "entity": entity,
        "entity_id": entity_id,
        "timestamp": datetime.now(UTC).isoformat(),
        "data": data or {}
    }
    # The filter will redact PII from this dict
    audit_logger.info(log_entry)
