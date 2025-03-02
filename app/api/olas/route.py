import os
import json
from typing import Dict, List, Optional, Union
import asyncio
from fastapi import FastAPI, HTTPException, Depends, Header, Body
from pydantic import BaseModel, Field
from autonolas.core import OlasClient, ComponentRegistry, Service, AgentExecution
from autonolas.staking import StakingManager

# Initialize FastAPI for our API routes
app = FastAPI()

# Initialize Olas client
olas_client = OlasClient(
    api_key=os.environ.get("OLAS_API_KEY"),
    environment="mainnet"  # or "testnet" for development
)

# Authentication dependency - checks if the user is authenticated
async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    token = authorization.replace("Bearer ", "")
    # Verify the token from your auth system
    # This would integrate with your existing Next.js auth
    # Similar to how auth() is used in your existing routes
    try:
        # Mock implementation - replace with actual auth verification
        user_id = "user_from_token"  # Extract user ID from token
        return {"id": user_id}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication token")

# Models for request/response
class AgentComponent(BaseModel):
    id: str
    name: str
    description: str
    type: str
    config: Dict

class AgentDefinition(BaseModel):
    name: str
    description: str
    components: List[AgentComponent]
    prompt: str

class ExecutionRequest(BaseModel):
    agent_id: str
    input: str
    parameters: Optional[Dict] = Field(default_factory=dict)

class StakingRequest(BaseModel):
    amount: float
    agent_id: str

# Routes
@app.get("/components")
async def get_available_components(current_user = Depends(get_current_user)):
    """Get available components from Olas registry"""
    try:
        registry = ComponentRegistry(olas_client)
        components = await registry.list_components()
        return {"components": components}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch components: {str(e)}")

@app.post("/agents")
async def create_agent(
    agent: AgentDefinition,
    current_user = Depends(get_current_user)
):
    """Create a new agent on Olas"""
    try:
        # Convert our agent definition to Olas format
        olas_agent = {
            "name": agent.name,
            "description": agent.description,
            "components": [comp.dict() for comp in agent.components],
            "prompt_template": agent.prompt,
            "owner_id": current_user["id"]
        }
        
        # Create the agent on Olas
        agent_service = Service(olas_client)
        result = await agent_service.create_agent(olas_agent)
        
        return {"agent_id": result["id"], "status": "created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create agent: {str(e)}")

@app.get("/agents/{agent_id}")
async def get_agent(
    agent_id: str,
    current_user = Depends(get_current_user)
):
    """Get agent details"""
    try:
        agent_service = Service(olas_client)
        agent = await agent_service.get_agent(agent_id)
        
        # Check ownership
        if agent.get("owner_id") != current_user["id"]:
            raise HTTPException(status_code=403, detail="You don't have access to this agent")
            
        return agent
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch agent: {str(e)}")

@app.post("/execute")
async def execute_agent(
    request: ExecutionRequest,
    current_user = Depends(get_current_user)
):
    """Execute an agent to generate a response"""
    try:
        # Verify agent ownership first
        agent_service = Service(olas_client)
        agent = await agent_service.get_agent(request.agent_id)
        
        if agent.get("owner_id") != current_user["id"]:
            raise HTTPException(status_code=403, detail="You don't have access to this agent")
        
        # Execute the agent
        execution = AgentExecution(olas_client)
        execution_id = await execution.start(
            agent_id=request.agent_id,
            input=request.input,
            parameters=request.parameters
        )
        
        # Return the execution ID which can be used to poll for results
        return {"execution_id": execution_id, "status": "running"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to execute agent: {str(e)}")

@app.get("/executions/{execution_id}")
async def get_execution_status(
    execution_id: str, 
    current_user = Depends(get_current_user)
):
    """Get the status and result of an agent execution"""
    try:
        execution = AgentExecution(olas_client)
        result = await execution.get_status(execution_id)
        
        # If completed, include the response
        if result["status"] == "completed":
            response = await execution.get_result(execution_id)
            result["response"] = response
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get execution status: {str(e)}")

@app.post("/stake")
async def stake_tokens(
    request: StakingRequest,
    current_user = Depends(get_current_user)
):
    """Stake OLAS tokens for an agent to increase reputation and performance"""
    try:
        staking = StakingManager(olas_client)
        
        # Stake tokens
        transaction = await staking.stake(
            amount=request.amount,
            agent_id=request.agent_id,
            user_id=current_user["id"]
        )
        
        return {
            "transaction_id": transaction["tx_id"],
            "status": transaction["status"],
            "staked_amount": request.amount
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to stake tokens: {str(e)}")

@app.get("/staking/{user_id}")
async def get_staking_info(
    user_id: str,
    current_user = Depends(get_current_user)
):
    """Get staking information for a user"""
    if user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="You can only view your own staking information")
        
    try:
        staking = StakingManager(olas_client)
        info = await staking.get_user_staking_info(user_id)
        
        return info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get staking info: {str(e)}") 