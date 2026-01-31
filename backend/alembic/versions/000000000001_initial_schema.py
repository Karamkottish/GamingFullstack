"""initial_schema

Revision ID: 000000000001
Revises: 
Create Date: 2026-01-31 15:45:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '000000000001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # USERS
    # We use execute with "IF NOT EXISTS" concept for robustness on Render
    op.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id UUID NOT NULL, 
        email VARCHAR NOT NULL, 
        hashed_password VARCHAR NOT NULL, 
        role VARCHAR NOT NULL, 
        first_name VARCHAR, 
        last_name VARCHAR, 
        telegram_id VARCHAR, 
        phone_number VARCHAR,
        agent_id UUID, 
        is_active BOOLEAN, 
        created_at TIMESTAMP WITHOUT TIME ZONE, 
        PRIMARY KEY (id), 
        UNIQUE (email), 
        FOREIGN KEY(agent_id) REFERENCES users (id)
    )
    """)
    op.execute("CREATE INDEX IF NOT EXISTS ix_users_email ON users (email)")

    # Explicitly ADD columns if they're missing (Fix for incremental updates)
    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='agent_id') THEN
            ALTER TABLE users ADD COLUMN agent_id UUID REFERENCES users(id);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone_number') THEN
            ALTER TABLE users ADD COLUMN phone_number VARCHAR;
        END IF;
    END
    $$;
    """)

    # WALLETS
    op.execute("""
    CREATE TABLE IF NOT EXISTS wallets (
        id UUID NOT NULL, 
        user_id UUID NOT NULL, 
        balance NUMERIC(18, 2), 
        currency VARCHAR, 
        is_frozen BOOLEAN, 
        PRIMARY KEY (id), 
        UNIQUE (user_id), 
        FOREIGN KEY(user_id) REFERENCES users (id)
    )
    """)

    # TRANSACTIONS
    op.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id UUID NOT NULL, 
        wallet_id UUID NOT NULL, 
        amount NUMERIC(18, 2) NOT NULL, 
        type VARCHAR NOT NULL, 
        status VARCHAR, 
        created_at TIMESTAMP WITHOUT TIME ZONE, 
        PRIMARY KEY (id), 
        FOREIGN KEY(wallet_id) REFERENCES wallets (id)
    )
    """)

    # COMMISSIONS
    op.execute("""
    CREATE TABLE IF NOT EXISTS commissions (
        id UUID NOT NULL, 
        agent_id UUID NOT NULL, 
        source_user_id UUID, 
        amount NUMERIC(18, 2) NOT NULL, 
        type VARCHAR, 
        created_at TIMESTAMP WITHOUT TIME ZONE, 
        status VARCHAR, 
        PRIMARY KEY (id), 
        FOREIGN KEY(agent_id) REFERENCES users (id), 
        FOREIGN KEY(source_user_id) REFERENCES users (id)
    )
    """)

    # AFFILIATE LINKS
    op.execute("""
    CREATE TABLE IF NOT EXISTS affiliate_links (
        id UUID NOT NULL, 
        affiliate_id UUID NOT NULL, 
        slug VARCHAR, 
        target_url VARCHAR, 
        campaign_name VARCHAR, 
        created_at TIMESTAMP WITHOUT TIME ZONE, 
        PRIMARY KEY (id), 
        UNIQUE (slug), 
        FOREIGN KEY(affiliate_id) REFERENCES users (id)
    )
    """)
    op.execute("CREATE INDEX IF NOT EXISTS ix_affiliate_links_slug ON affiliate_links (slug)")

    # CLICK EVENTS
    op.execute("""
    CREATE TABLE IF NOT EXISTS click_events (
        id UUID NOT NULL, 
        link_id UUID NOT NULL, 
        ip_address VARCHAR, 
        geo_lat FLOAT, 
        geo_lng FLOAT, 
        timestamp TIMESTAMP WITHOUT TIME ZONE, 
        PRIMARY KEY (id), 
        FOREIGN KEY(link_id) REFERENCES affiliate_links (id)
    )
    """)

def downgrade():
    op.drop_table('click_events')
    op.drop_table('affiliate_links')
    op.drop_table('commissions')
    op.drop_table('transactions')
    op.drop_table('wallets')
    op.drop_table('users')
