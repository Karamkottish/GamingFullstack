"""add_affiliate_link_id

Revision ID: 000000000004
Revises: 000000000003
Create Date: 2026-02-01 15:20:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '000000000004'
down_revision = '000000000003'
branch_labels = None
depends_on = None

def upgrade():
    # Add affiliate_link_id to users table
    op.execute("""
    DO $$
    BEGIN
        -- Add affiliate_link_id if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='users' AND column_name='affiliate_link_id') THEN
            ALTER TABLE users ADD COLUMN affiliate_link_id UUID;
            ALTER TABLE users ADD CONSTRAINT users_affiliate_link_id_fkey 
                FOREIGN KEY(affiliate_link_id) REFERENCES affiliate_links(id);
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Error adding affiliate_link_id: %', SQLERRM;
    END
    $$;
    """)

def downgrade():
    op.drop_constraint('users_affiliate_link_id_fkey', 'users', type_='foreignkey')
    op.drop_column('users', 'affiliate_link_id')
