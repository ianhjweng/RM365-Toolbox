from __future__ import annotations
from typing import List
from datetime import date, datetime

from fastapi import APIRouter, Depends, HTTPException

from common.deps import get_current_user
from common.dto import InventorySyncResult
from .schemas import AdjustmentLogIn, AdjustmentOut, AdjustmentHistoryResponse
from .service import AdjustmentsService

router = APIRouter()

def _svc() -> AdjustmentsService:
    return AdjustmentsService()

@router.get("/health")
def inventory_adjustments_health():
    """Health check for inventory adjustments module (no auth required)"""
    try:
        return {
            "status": "healthy",
            "message": "Inventory adjustments module ready",
            "auth_required": "Most endpoints require authentication",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Health check failed: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }

@router.post("/debug-metadata-update")
def debug_metadata_update(
    item_id: str = "772578000000491583",
    field: str = "shelf_lt1_qty", 
    delta: int = 1
):
    """Debug endpoint to test immediate metadata updates (no auth for debugging)"""
    try:
        service = _svc()
        
        # Get current metadata to show before/after
        from modules.inventory.management.repo import InventoryManagementRepo
        mgmt_repo = InventoryManagementRepo()
        
        # Get current value
        metadata_before = mgmt_repo.load_inventory_metadata()
        current_item = next((item for item in metadata_before if item['item_id'] == item_id), None)
        current_value = current_item.get(field, 0) if current_item else 0
        
        # Test the immediate update
        service.repo.update_metadata_quantity(item_id, field, delta)
        
        # Get updated value
        metadata_after = mgmt_repo.load_inventory_metadata()
        updated_item = next((item for item in metadata_after if item['item_id'] == item_id), None)
        new_value = updated_item.get(field, 0) if updated_item else 0
        
        return {
            "status": "success",
            "test": "immediate_metadata_update",
            "item_id": item_id,
            "field": field,
            "delta": delta,
            "before": current_value,
            "after": new_value,
            "change_applied": new_value - current_value,
            "expected_change": delta,
            "working": (new_value - current_value) == delta,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        return {
            "status": "error",
            "test": "immediate_metadata_update",
            "error": str(e),
            "error_type": type(e).__name__,
            "timestamp": datetime.now().isoformat()
        }

@router.get("/status-public")
def get_public_status():
    """Public status check (no auth required)"""
    try:
        return {
            "status": "online",
            "message": "Inventory adjustments API is running",
            "endpoints": {
                "health": "GET /health (public)",
                "connection": "GET /connection-status (auth required)",
                "log": "POST /log (auth required)", 
                "sync": "POST /sync (auth required)",
                "pending": "GET /pending (auth required)"
            },
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "error", 
            "message": str(e),
            "timestamp": datetime.now().isoformat()
        }

@router.get("/connection-status")
def check_zoho_connection(user=Depends(get_current_user)):
    """Check connectivity to Zoho Inventory API"""
    try:
        result = _svc().check_zoho_connection()
        return result
    except Exception as e:
        return {
            "status": "error",
            "connected": False,
            "message": str(e),
            "timestamp": datetime.now().isoformat()
        }

@router.post("/log", response_model=AdjustmentOut)
def log_inventory_adjustment(body: AdjustmentLogIn, user=Depends(get_current_user)):
    """Log an inventory adjustment to PostgreSQL for later sync to Zoho"""
    try:
        result = _svc().log_adjustment(
            barcode=body.barcode,
            quantity=body.quantity,
            reason=body.reason,
            field=body.field
        )
        return AdjustmentOut(**result["adjustment"])
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sync", response_model=InventorySyncResult)
def sync_inventory_adjustments(user=Depends(get_current_user)):
    """Sync pending adjustments from PostgreSQL to Zoho Inventory"""
    try:
        result = _svc().sync_adjustments_to_zoho()
        return InventorySyncResult(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/pending")
def get_pending_adjustments(user=Depends(get_current_user)):
    """Get all pending adjustments that haven't been synced to Zoho yet"""
    try:
        pending = _svc().get_pending_adjustments()
        return {
            "adjustments": pending,
            "count": len(pending),
            "message": f"Found {len(pending)} pending adjustments awaiting sync to Zoho"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
def get_sync_status(user=Depends(get_current_user)):
    """Get comprehensive sync status including pending and recent adjustments"""
    try:
        return _svc().get_sync_status()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{item_id}", response_model=AdjustmentHistoryResponse)
def get_adjustment_history(
    item_id: str, 
    limit: int = 50,
    user=Depends(get_current_user)
):
    """Get adjustment history for a specific item"""
    try:
        history = _svc().get_adjustment_history(item_id, limit)
        return AdjustmentHistoryResponse(**history)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/summary")
def get_adjustment_summary(
    start_date: date = None,
    end_date: date = None,
    user=Depends(get_current_user)
):
    """Get summary of adjustments within date range"""
    try:
        return _svc().get_adjustment_summary(start_date, end_date)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/cleanup-corrupted")
def cleanup_corrupted_adjustments(user=Depends(get_current_user)):
    """Clean up adjustments with corrupted barcode data (tabs, multiple IDs, etc.)"""
    try:
        result = _svc().clean_corrupted_adjustments()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

