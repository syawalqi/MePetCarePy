from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List

# Invoice Item Schemas
class InvoiceItemBase(BaseModel):
    description: str
    quantity: int = 1
    unit_price_at_billing: float

class InvoiceItemCreate(InvoiceItemBase):
    pass

class InvoiceItemRead(InvoiceItemBase):
    id: int
    invoice_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

from typing import Optional, List, Literal

# Invoice Schemas
class InvoiceBase(BaseModel):
    patient_id: int
    medical_record_id: Optional[int] = None
    status: Literal["UNPAID", "PAID", "CANCELLED"] = "UNPAID"

class InvoiceCreate(InvoiceBase):
    items: List[InvoiceItemCreate]

class InvoiceUpdate(BaseModel):
    status: Literal["UNPAID", "PAID", "CANCELLED"]
    paid_at: Optional[datetime] = None

class InvoiceRead(InvoiceBase):
    id: int
    total_amount: float
    created_at: datetime
    updated_at: datetime
    paid_at: Optional[datetime] = None
    is_deleted: bool
    items: List[InvoiceItemRead] = []

    model_config = ConfigDict(from_attributes=True)
