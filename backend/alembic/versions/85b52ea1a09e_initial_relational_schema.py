"""initial_relational_schema reconstructed

Revision ID: 85b52ea1a09e
Revises: 
Create Date: 2026-01-31 12:37:31.185629+00:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '85b52ea1a09e'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # USERS
    op.create_table(
        'users',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('role', sa.Enum('ADMIN', 'AGENT', 'AFFILIATE', 'USER', name='userrole'), nullable=False),
        sa.Column('first_name', sa.String(), nullable=True),
        sa.Column('last_name', sa.String(), nullable=True),
        sa.Column('telegram_id', sa.String(), nullable=True),
        sa.Column('agent_id', sa.UUID(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['agent_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # WALLETS
    op.create_table(
        'wallets',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('balance', sa.Numeric(precision=18, scale=2), nullable=True),
        sa.Column('currency', sa.String(), nullable=True),
        sa.Column('is_frozen', sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )

    # TRANSACTIONS
    op.create_table(
        'transactions',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('wallet_id', sa.UUID(), nullable=False),
        sa.Column('amount', sa.Numeric(precision=18, scale=2), nullable=False),
        sa.Column('type', sa.Enum('DEPOSIT', 'WITHDRAWAL', 'WAGER', 'WIN', 'COMMISSION', name='transactiontype'), nullable=False),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['wallet_id'], ['wallets.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # COMMISSIONS
    op.create_table(
        'commissions',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('agent_id', sa.UUID(), nullable=False),
        sa.Column('source_user_id', sa.UUID(), nullable=True),
        sa.Column('amount', sa.Numeric(precision=18, scale=2), nullable=False),
        sa.Column('type', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['agent_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['source_user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # AFFILIATE LINKS
    op.create_table(
        'affiliate_links',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('affiliate_id', sa.UUID(), nullable=False),
        sa.Column('slug', sa.String(), nullable=True),
        sa.Column('target_url', sa.String(), nullable=True),
        sa.Column('campaign_name', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['affiliate_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_affiliate_links_slug'), 'affiliate_links', ['slug'], unique=True)

    # CLICK EVENTS
    op.create_table(
        'click_events',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('link_id', sa.UUID(), nullable=False),
        sa.Column('ip_address', sa.String(), nullable=True),
        sa.Column('geo_lat', sa.Float(), nullable=True),
        sa.Column('geo_lng', sa.Float(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['link_id'], ['affiliate_links.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('click_events')
    op.drop_index(op.f('ix_affiliate_links_slug'), table_name='affiliate_links')
    op.drop_table('affiliate_links')
    op.drop_table('commissions')
    op.drop_table('transactions')
    op.drop_table('wallets')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
