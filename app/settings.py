#!/usr/bin/env python
from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import tomllib
from pydantic import Field
from pydantic_settings import BaseSettings, PydanticBaseSettingsSource, SettingsConfigDict


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
        class TomlConfigSource(PydanticBaseSettingsSource):
            def __call__(self) -> dict[str, Any]:
                path_override = os.getenv("CONFIG_PATH")
                path = Path(path_override) if path_override else Path("config.toml")
                if not path.exists():
                    return {}
                with path.open("rb") as handle:
                    data = tomllib.load(handle)
                flattened: dict[str, Any] = {}
                for section in data.values():
                    if isinstance(section, dict):
                        flattened.update(section)
                return flattened

        return TomlConfigSource(settings_cls=cls)


def get_settings() -> Settings:
    return Settings()


settings = get_settings()
