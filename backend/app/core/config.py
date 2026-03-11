from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8-sig',
        extra='ignore',
    )

    app_name: str = 'AI BI Platform'
    secret_key: str = 'super-secret-change-me'
    algorithm: str = 'HS256'
    access_token_expire_minutes: int = 720

    database_url: str = 'sqlite:///./ai_bi.db'

    # Optional: OpenAI can be used if configured, but the app works without it.
    openai_api_key: str = ''
    openai_model: str = 'gpt-4o-mini'

    aws_access_key_id: str = ''
    aws_secret_access_key: str = ''
    aws_region: str = 'us-east-1'
    s3_bucket_name: str = ''

    excel_base_path: str = ''


settings = Settings()