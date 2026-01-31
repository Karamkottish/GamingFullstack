import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
import os
from dotenv import load_dotenv

# Load env from the backend directory
load_dotenv('c:/Users/karam/OneDrive/Desktop/GamingFullstack(Backend)/backend/.env')

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL)

async def check_commissions():
    from app.modules.agent.models import Commission
    from app.modules.auth.models import User
    
    async with AsyncSession(engine) as session:
        try:
            # Check total count
            result = await session.execute(select(func.count(Commission.id)))
            count = result.scalar()
            print(f"Total Commissions: {count}")
            
            # Check for any commission with insane amount
            result = await session.execute(select(Commission).limit(10))
            commissions = result.scalars().all()
            for c in commissions:
                print(f"ID: {c.id}, Agent: {c.agent_id}, User: {c.user_id}, Amount: {c.amount}, Status: {c.status}")
                
            # Test the join that is failing
            query = select(Commission, User).join(User, Commission.user_id == User.id).limit(5)
            result = await session.execute(query)
            data = result.all()
            print(f"Join rows: {len(data)}")
            
        except Exception as e:
            print(f"ERROR: {str(e)}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    import sys
    # Add app to path
    sys.path.append('c:/Users/karam/OneDrive/Desktop/GamingFullstack(Backend)/backend')
    asyncio.run(check_commissions())
