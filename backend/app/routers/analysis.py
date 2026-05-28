"""分析任务路由"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from ..database import get_db
from ..models import User, AnalysisTask, AnalysisAsinResult, ActionItem, MissingReport
from ..auth import get_current_user, require_operator

router = APIRouter()


class AnalysisResultRequest(BaseModel):
    task_name: Optional[str] = ""
    date_range: Optional[str] = ""
    data_directory: Optional[List[Dict]] = None
    missing_reports: Optional[List[Dict]] = None
    asin_overview: Optional[List[Dict]] = None
    actions: Optional[List[Dict]] = None
    llm_report: Optional[str] = ""


@router.post("/")
def create_analysis(
    req: AnalysisResultRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_operator),
):
    """创建分析任务"""
    task = AnalysisTask(
        user_id=user.id,
        task_name=req.task_name or f"分析_{__import__('datetime').datetime.now().strftime('%Y%m%d')}",
        date_range=req.date_range,
        status="completed",
        llm_report_text=req.llm_report,
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    # 保存ASIN结果
    if req.asin_overview:
        for a in req.asin_overview:
            db.add(AnalysisAsinResult(task_id=task.id, **a))

    # 保存动作
    if req.actions:
        for a in req.actions:
            db.add(ActionItem(
                task_id=task.id,
                asin=a.get('asin', ''),
                priority=a.get('priority', 'P2'),
                campaign_name=a.get('campaign_name', ''),
                target_text=a.get('target_text', ''),
                suggested_action=a.get('action', ''),
                action_layer=a.get('action_layer', ''),
                reason=a.get('reason', ''),
                status="pending",
            ))

    # 保存缺失清单
    if req.missing_reports:
        for m in req.missing_reports:
            db.add(MissingReport(task_id=task.id, **m))

    db.commit()
    return {"id": task.id, "status": "completed"}


@router.get("/")
def list_analysis(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """我的分析记录"""
    query = db.query(AnalysisTask)
    if user.role != "admin":
        query = query.filter(AnalysisTask.user_id == user.id)
    tasks = query.order_by(AnalysisTask.created_at.desc()).limit(100).all()
    return [{"id": t.id, "task_name": t.task_name, "status": t.status, "created_at": t.created_at.isoformat() if t.created_at else ""} for t in tasks]


@router.get("/{task_id}")
def get_analysis(task_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """获取分析详情"""
    task = db.query(AnalysisTask).filter(AnalysisTask.id == task_id).first()
    if not task:
        return {"error": "任务不存在"}
    return {
        "id": task.id,
        "task_name": task.task_name,
        "date_range": task.date_range,
        "asin_results": [
            {"asin": a.asin, "spend": a.spend, "sales": a.sales, "acos": a.acos, "main_problem": a.main_problem}
            for a in task.asin_results
        ],
        "actions": [
            {"priority": a.priority, "campaign_name": a.campaign_name, "action": a.suggested_action, "status": a.status}
            for a in task.action_items
        ],
        "llm_report": task.llm_report_text,
    }
