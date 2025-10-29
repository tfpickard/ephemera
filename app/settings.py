#!/usr/bin/env python
from __future__ import annotations

import os
from pathlib import Path
from typing import Any

from pydantic import Field
from pydantic_settings import BaseSettings, PydanticBaseSettingsSource, SettingsConfigDict
from pydantic_settings.sources import TomlConfigSettingsSource


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = Field(default="AI Lifeform")
    secret_key: str = Field(default="dev-secret", alias="SECRET_KEY")
    database_url: str = Field(default="sqlite:///./data/lifeform.db", alias="DATABASE_URL")
    port: int = Field(default=8101, alias="PORT")
    scheduler_interval_seconds: int = Field(default=180, alias="SCHEDULER_INTERVAL_SECONDS")
    openai_api_key: str | None = Field(default=None, alias="OPENAI_API_KEY")
    environment: str = Field(default="development", alias="FLASK_ENV")

    logging_level: str = Field(default="INFO", alias="LOG_LEVEL")
    logging_file_path: str = Field(default="logs/app.jsonl", alias="LOG_FILE_PATH")
    logging_console_rich: bool = Field(default=True, alias="LOG_CONSOLE_RICH")

    config_path: Path = Field(default=Path("config.toml"), alias="CONFIG_PATH")

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> tuple[PydanticBaseSettingsSource, ...]:
        return (
            init_settings,
            cls._toml_config_settings_source(),
            dotenv_settings,
            env_settings,
            file_secret_settings,
        )

    @classmethod
    def _toml_config_settings_source(cls) -> PydanticBaseSettingsSource:
        class FlattenedTomlConfigSource(TomlConfigSettingsSource):
            def __init__(self, settings_cls: type[BaseSettings]):
                path_override = os.getenv("CONFIG_PATH")
                default_path = cls.model_fields.get("config_path")
                if path_override:
                    base_path = Path(path_override)
                elif default_path and default_path.default is not None:
                    base_path = Path(default_path.default)
                else:
                    base_path = Path("config.toml")
                super().__init__(settings_cls=settings_cls, toml_file=base_path)

            def __call__(self) -> dict[str, Any]:
                data = super().__call__()
                flattened: dict[str, Any] = {}
                for key, value in data.items():
                    if isinstance(value, dict):
                        flattened.update(value)
                    else:
                        flattened[key] = value
                return flattened

        return FlattenedTomlConfigSource(settings_cls=cls)


def get_settings() -> Settings:
    return Settings()


settings = get_settings()
