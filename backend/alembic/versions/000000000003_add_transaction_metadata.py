"""add_transaction_metadata_and_updated_at

Revision ID: 000000000003
Revises: 000000000002
Create Date: 2026-01-31 18:20:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '000000000003'
down_revision = '000000000002'
branch_labels = None
depends_on = None

def upgrade():
    # Add updated_at and metadata columns to transactions table
    op.execute("""
    DO $$
    BEGIN
        -- Add updated_at if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='transactions' AND column_name='updated_at') THEN
            ALTER TABLE transactions ADD COLUMN updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW();
        END IF;
        
        -- Add metadata if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='transactions' AND column_name='metadata') THEN
            ALTER TABLE transactions ADD COLUMN metadata JSONB;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Error in transaction migration: %', SQLERRM;
    END
    $$;
    """)

def downgrade():
    op.drop_column('transactions', 'metadata')
    op.drop_column('transactions', 'updated_at')
