from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(
    prefix="/invoices",
    tags=["Invoices"]
)

@router.get("/", response_model=list[schemas.InvoiceResponse])
def get_all_invoices(db: Session = Depends(get_db)):
    return db.query(models.Invoice).order_by(models.Invoice.id.desc()).all()

@router.get("/{invoice_id}", response_model=schemas.InvoiceResponse)
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    inv = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return inv

@router.post("/", response_model=schemas.InvoiceResponse)
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    new_inv = models.Invoice(
        invoice_number=invoice.invoice_number,
        subscription_id=invoice.subscription_id,
        customer_id=invoice.customer_id,
        invoice_date=invoice.invoice_date,
        due_date=invoice.due_date,
        subtotal=invoice.subtotal,
        tax_amount=invoice.tax_amount,
        total_amount=invoice.total_amount,
        status=invoice.status
    )
    db.add(new_inv)
    db.commit()
    db.refresh(new_inv)
    return new_inv

@router.patch("/{invoice_id}/status", response_model=schemas.InvoiceResponse)
def update_invoice_status(invoice_id: int, status_update: dict, db: Session = Depends(get_db)):
    inv = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    status = status_update.get("status")
    if status:
        inv.status = status
        db.commit()
        db.refresh(inv)
    return inv

@router.delete("/{invoice_id}", response_model=schemas.InvoiceResponse)
def delete_invoice(invoice_id: int, db: Session = Depends(get_db)):
    inv = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    db.delete(inv)
    db.commit()
    return inv

@router.get("/{invoice_id}/pdf")
def download_invoice_pdf(invoice_id: int, db: Session = Depends(get_db)):
    # Returns raw text as fake PDF
    from fastapi.responses import PlainTextResponse
    inv = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return PlainTextResponse(f"Invoice PDF content for {inv.invoice_number}\nAmount: {inv.total_amount}", media_type="application/pdf")
