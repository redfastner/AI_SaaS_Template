from fastapi import APIRouter, HTTPException, Depends, Request
import stripe
from app.core.config import settings
from app.core.supabase import get_user_id
from app.services.credits import add_credits
from pydantic import BaseModel, Field
import re

router = APIRouter()
# TODO (M-5): Add rate limiting to this router.
# Recommended: use `slowapi` with a Redis or in-memory store.
# Key endpoints to limit: /create-checkout-session (5/min per user),
# /webhook (100/min globally — Stripe sends from a known IP range).

stripe.api_key = settings.STRIPE_SECRET_KEY

# SECURITY (M-2): Validate credit amounts and price_id format.
# - credits: must be a positive integer within a sane range.
# - price_id: must match Stripe's price ID format (price_xxxxx).
class CheckoutRequest(BaseModel):
    price_id: str = Field(..., pattern=r'^price_[a-zA-Z0-9]+$', description="Stripe Price ID")
    credits: int = Field(..., ge=1, le=10000, description="Credits to grant (1–9,999)")

@router.post("/create-checkout-session")
async def create_checkout_session(data: CheckoutRequest, user_id: str = Depends(get_user_id)):
    try:
        if not stripe.api_key:
             raise HTTPException(status_code=500, detail="Stripe configuration missing")

        # Create session - Forced to 'payment' for one-time credit top-ups
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': data.price_id,
                'quantity': 1,
            }],
            mode='payment', # <--- FIXED: Explicitly 'payment' for one-time purchases
            success_url=f"{settings.FRONTEND_URL}/account?payment=success",
            cancel_url=f"{settings.FRONTEND_URL}/account?payment=cancelled",
            client_reference_id=user_id,
            metadata={
                "credits": str(data.credits)
            }
        )
        return {"url": checkout_session.url}

    except Exception as e:
        print(f"Stripe Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    event = None

    # SECURITY (H-2): Webhook signature verification is ALWAYS required.
    # There is no development bypass — if STRIPE_WEBHOOK_SECRET is not set,
    # the webhook is rejected. This prevents anyone from faking payment events
    # and granting themselves free credits.
    if not settings.STRIPE_WEBHOOK_SECRET:
        raise HTTPException(
            status_code=500,
            detail="STRIPE_WEBHOOK_SECRET is not configured. Webhook processing is disabled."
        )

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        user_id = session.get('client_reference_id')
        metadata = session.get('metadata', {})
        credits_to_add = int(metadata.get('credits', 100)) # Default to 100 if missing

        if user_id:
             print(f"Payment success for {user_id}. Adding {credits_to_add} credits...")
             try:
                add_credits(user_id, credits_to_add)
             except Exception as e:
                 print(f"Failed to fulfill credits: {e}")

    return {"status": "success"}
