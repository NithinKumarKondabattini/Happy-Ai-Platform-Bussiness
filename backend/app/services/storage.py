from datetime import datetime
from pathlib import Path
import boto3
from botocore.exceptions import BotoCoreError
from app.core.config import settings


def save_contract_file(file_name: str, data: bytes) -> str:
    uploads = Path("uploads")
    uploads.mkdir(parents=True, exist_ok=True)
    local_path = uploads / f"{datetime.utcnow().timestamp()}_{file_name}"
    local_path.write_bytes(data)

    if not settings.s3_bucket_name:
        return str(local_path)

    try:
        s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
            region_name=settings.aws_region,
        )
        s3.upload_file(str(local_path), settings.s3_bucket_name, local_path.name)
        return f"s3://{settings.s3_bucket_name}/{local_path.name}"
    except BotoCoreError:
        return str(local_path)
