"""rename_source_user_id

Revision ID: 000000000002
Revises: 000000000001
Create Date: 2026-01-31 18:05:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '000000000002'
down_revision = '000000000001'
branch_labels = None
depends_on = None

def upgrade():
    # Attempt to rename source_user_id to user_id for Commissions table
    op.execute("""
    DO $$
    BEGIN
        -- Rename column if it exists under the old name
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='commissions' AND column_name='source_user_id') THEN
            ALTER TABLE commissions RENAME COLUMN source_user_id TO user_id;
        END IF;
        
        -- Add user_id if neither exists (fallback)
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='commissions' AND column_name='user_id') THEN
            ALTER TABLE commissions ADD COLUMN user_id UUID REFERENCES users(id);
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Error in renaming column: %', SQLERRM;
    END
    $$;
    """)

def downgrade():
    op.execute("ALTER TABLE commissions RENAME COLUMN user_id TO source_user_id")
