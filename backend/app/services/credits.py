# SECURITY NOTE (H-1): TOCTOU Race Condition
# The current read-modify-write pattern (get → compute → upsert) is NOT atomic.
# Two simultaneous requests can both read the same balance, both pass the
# balance check, and both deduct — resulting in over-spending / free credits.
#
# RECOMMENDED FIX: Replace add_credits and deduct_credits with a Supabase
# database RPC (Postgres function) that performs an atomic UPDATE:
#
#   CREATE OR REPLACE FUNCTION deduct_credits(p_user_id uuid, p_amount int)
#   RETURNS int LANGUAGE plpgsql AS $$
#   DECLARE v_new int;
#   BEGIN
#     UPDATE profiles SET credits = credits - p_amount
#     WHERE id = p_user_id AND credits >= p_amount
#     RETURNING credits INTO v_new;
#     IF NOT FOUND THEN RAISE EXCEPTION 'insufficient_credits'; END IF;
#     RETURN v_new;
#   END;
#   $$;
#
# Then call: supabase.rpc("deduct_credits", {"p_user_id": user_id, "p_amount": amount}).execute()
# This eliminates the race entirely at the database level.

from app.core.supabase import supabase

def get_user_credits(user_id: str) -> int:
    try:
        res = supabase.table("profiles").select("credits").eq("id", user_id).single().execute()
        if res.data:
            return res.data.get("credits", 0) or 0
        return 0
    except Exception as e:
        print(f"Error fetching credits for {user_id}: {e}")
        return 0

def add_credits(user_id: str, amount: int):
    # TODO (H-1): Replace with atomic Supabase RPC (see note above).
    try:
        current = get_user_credits(user_id)
        new_balance = current + amount

        data = {
            "id": user_id,
            "credits": new_balance,
            "updated_at": "now()"
        }
        supabase.table("profiles").upsert(data).execute()
        print(f"Added {amount} credits to {user_id}. New Balance: {new_balance}")
        return new_balance
    except Exception as e:
        print(f"Error adding credits: {e}")
        raise e

def deduct_credits(user_id: str, amount: int):
    """
    Deducts credits. Raises ValueError if insufficient funds.

    WARNING (H-1): This is a non-atomic read-modify-write. Under concurrent
    load, two requests can both pass the balance check and both deduct.
    Replace with an atomic Supabase RPC before enabling high-traffic features.
    """
    # TODO (H-1): Replace with atomic Supabase RPC (see note above).
    try:
        current = get_user_credits(user_id)
        if current < amount:
            raise ValueError(f"Insufficient credits. Required: {amount}, Available: {current}")

        new_balance = current - amount

        data = {
            "id": user_id,
            "credits": new_balance,
            "updated_at": "now()"
        }
        supabase.table("profiles").upsert(data).execute()
        print(f"Deducted {amount} credits from {user_id}. Remaining: {new_balance}")
        return new_balance
    except Exception as e:
        if "Insufficient credits" in str(e):
            raise e
        print(f"Error deducting credits: {e}")
        raise e
