from __future__ import annotations

from textwrap import dedent

from app.settings import Settings


def test_settings_loads_from_toml(tmp_path, monkeypatch):
    config_contents = dedent(
        """
        [app]
        app_name = "Test App"
        LOG_LEVEL = "DEBUG"
        """
    ).strip()
    config_path = tmp_path / "custom.toml"
    config_path.write_text(config_contents, encoding="utf-8")

    monkeypatch.setenv("CONFIG_PATH", str(config_path))

    settings = Settings()

    assert settings.app_name == "Test App"
    assert settings.logging_level == "DEBUG"
    assert settings.config_path == config_path
