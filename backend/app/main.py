from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to NexusPlay API", "docs": "/docs"}

from app.modules.auth.router import router as auth_router
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])

from app.modules.agent.router import router as agent_router
app.include_router(agent_router, prefix=f"{settings.API_V1_STR}/agent", tags=["agent"])

from app.modules.affiliate.router import router as affiliate_router
app.include_router(affiliate_router, prefix=f"{settings.API_V1_STR}/affiliate", tags=["affiliate"])
